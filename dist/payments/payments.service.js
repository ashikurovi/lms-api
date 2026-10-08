"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const installment_entity_1 = require("../installment/entities/installment.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
const sslcommerz_service_1 = require("./sslcommerz.service");
const uuid_1 = require("uuid");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentRepository;
    installmentRepository;
    enrollmentRepository;
    sslcommerzService;
    dataSource;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentRepository, installmentRepository, enrollmentRepository, sslcommerzService, dataSource) {
        this.paymentRepository = paymentRepository;
        this.installmentRepository = installmentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.sslcommerzService = sslcommerzService;
        this.dataSource = dataSource;
    }
    async initiatePayment(createPaymentDto) {
        const { installment_id, amount } = createPaymentDto;
        const installment = await this.installmentRepository.findOne({
            where: { id: installment_id },
            relations: { enrollment: { student: true, batch: true } },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${installment_id} not found`);
        }
        const enrollment = installment.enrollment;
        const installmentDue = Number(installment.due_amount);
        if (amount > installmentDue) {
            throw new common_1.BadRequestException(`Payment amount (${amount}) exceeds installment due amount (${installmentDue})`);
        }
        const enrollmentDue = Number(enrollment.due_amount);
        if (amount > enrollmentDue) {
            throw new common_1.BadRequestException(`Payment amount (${amount}) exceeds enrollment due amount (${enrollmentDue})`);
        }
        const transactionId = `TXN-${Date.now()}-${(0, uuid_1.v4)().slice(0, 8)}`;
        const environment = this.sslcommerzService.getEnvironment();
        const payment = this.paymentRepository.create({
            enrollment_id: enrollment.id,
            installment_id: installment.id,
            amount,
            gateway: payment_entity_1.PaymentGateway.SSLCOMMERZ,
            environment: environment === 'SANDBOX'
                ? payment_entity_1.PaymentEnvironment.SANDBOX
                : payment_entity_1.PaymentEnvironment.LIVE,
            transaction_id: transactionId,
            status: payment_entity_1.PaymentStatus.PENDING,
        });
        const savedPayment = await this.paymentRepository.save(payment);
        const sslResponse = await this.sslcommerzService.initSession({
            total_amount: amount,
            tran_id: transactionId,
            cus_name: enrollment.student?.name || 'Student',
            cus_email: enrollment.student?.email || 'student@example.com',
            cus_phone: enrollment.student?.phone || 'N/A',
            product_name: `Installment #${installment.installment_number}`,
            product_category: 'Education',
        });
        if (sslResponse.status !== 'SUCCESS') {
            savedPayment.status = payment_entity_1.PaymentStatus.FAILED;
            await this.paymentRepository.save(savedPayment);
            throw new common_1.BadRequestException('Failed to initialize payment gateway session');
        }
        return {
            payment_id: savedPayment.id,
            transaction_id: transactionId,
            gateway_url: sslResponse.GatewayPageURL,
            sessionkey: sslResponse.sessionkey,
        };
    }
    async handleIPN(ipnData) {
        const { tran_id, val_id, status: gatewayStatus } = ipnData;
        this.logger.log(`IPN received: tran_id=${tran_id}, status=${gatewayStatus}`);
        if (!tran_id) {
            throw new common_1.BadRequestException('Missing transaction ID in IPN');
        }
        const payment = await this.paymentRepository.findOne({
            where: { transaction_id: tran_id },
            relations: { installment: true, enrollment: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with transaction ID ${tran_id} not found`);
        }
        if (payment.status === payment_entity_1.PaymentStatus.SUCCESS) {
            this.logger.warn(`Duplicate IPN for transaction ${tran_id}, ignoring`);
            return { message: 'Payment already processed' };
        }
        if (gatewayStatus !== 'VALID') {
            payment.status =
                gatewayStatus === 'CANCELLED'
                    ? payment_entity_1.PaymentStatus.CANCELLED
                    : payment_entity_1.PaymentStatus.FAILED;
            await this.paymentRepository.save(payment);
            return { message: `Payment ${payment.status.toLowerCase()}` };
        }
        const validation = await this.sslcommerzService.validateTransaction(val_id);
        if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
            payment.status = payment_entity_1.PaymentStatus.FAILED;
            await this.paymentRepository.save(payment);
            return { message: 'Payment verification failed' };
        }
        const validatedAmount = parseFloat(validation.amount);
        if (validatedAmount !== Number(payment.amount)) {
            this.logger.error(`Amount mismatch: expected ${payment.amount}, got ${validatedAmount}`);
            payment.status = payment_entity_1.PaymentStatus.FAILED;
            await this.paymentRepository.save(payment);
            return { message: 'Payment amount mismatch' };
        }
        await this.dataSource.transaction(async (manager) => {
            payment.status = payment_entity_1.PaymentStatus.SUCCESS;
            payment.paid_at = new Date();
            await manager.save(payment_entity_1.Payment, payment);
            const installment = await manager.findOne(installment_entity_1.Installment, {
                where: { id: payment.installment_id },
            });
            if (installment) {
                const newPaidAmount = Number(installment.paid_amount) + Number(payment.amount);
                const newDueAmount = Number(installment.amount) - newPaidAmount;
                installment.paid_amount = newPaidAmount;
                installment.due_amount = Math.max(0, newDueAmount);
                if (installment.due_amount <= 0) {
                    installment.status = installment_entity_1.InstallmentStatus.PAID;
                }
                else {
                    installment.status = installment_entity_1.InstallmentStatus.PARTIAL;
                }
                await manager.save(installment_entity_1.Installment, installment);
            }
            const enrollment = await manager.findOne(enrollment_entity_1.Enrollment, {
                where: { id: payment.enrollment_id },
            });
            if (enrollment) {
                const newPaidAmount = Number(enrollment.paid_amount) + Number(payment.amount);
                const newDueAmount = Number(enrollment.payable_amount) - newPaidAmount;
                enrollment.paid_amount = newPaidAmount;
                enrollment.due_amount = Math.max(0, newDueAmount);
                enrollment.status = enrollment_entity_1.EnrollmentStatus.ACTIVE;
                await manager.save(enrollment_entity_1.Enrollment, enrollment);
            }
        });
        return { message: 'Payment verified and processed successfully' };
    }
    async handleSuccess(queryData) {
        const { tran_id } = queryData;
        if (!tran_id) {
            return { message: 'Invalid callback', status: 'error' };
        }
        const payment = await this.paymentRepository.findOne({
            where: { transaction_id: tran_id },
        });
        return {
            message: 'Payment completed. Verification in progress.',
            transaction_id: tran_id,
            status: payment?.status || 'UNKNOWN',
        };
    }
    async handleFail(queryData) {
        const { tran_id } = queryData;
        if (tran_id) {
            const payment = await this.paymentRepository.findOne({
                where: { transaction_id: tran_id },
            });
            if (payment && payment.status === payment_entity_1.PaymentStatus.PENDING) {
                payment.status = payment_entity_1.PaymentStatus.FAILED;
                await this.paymentRepository.save(payment);
            }
        }
        return {
            message: 'Payment failed',
            transaction_id: tran_id,
        };
    }
    async handleCancel(queryData) {
        const { tran_id } = queryData;
        if (tran_id) {
            const payment = await this.paymentRepository.findOne({
                where: { transaction_id: tran_id },
            });
            if (payment && payment.status === payment_entity_1.PaymentStatus.PENDING) {
                payment.status = payment_entity_1.PaymentStatus.CANCELLED;
                await this.paymentRepository.save(payment);
            }
        }
        return {
            message: 'Payment cancelled',
            transaction_id: tran_id,
        };
    }
    async findAll(pageStr, limitStr, enrollmentId, installmentId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (enrollmentId) {
            where.enrollment_id = enrollmentId;
        }
        if (installmentId) {
            where.installment_id = installmentId;
        }
        if (status) {
            where.status = status;
        }
        const [items, total] = await this.paymentRepository.findAndCount({
            where,
            relations: { installment: true, enrollment: true },
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: { installment: true, enrollment: true },
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        return payment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(installment_entity_1.Installment)),
    __param(2, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        sslcommerz_service_1.SslcommerzService,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map