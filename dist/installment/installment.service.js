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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const installment_entity_1 = require("./entities/installment.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
let InstallmentService = class InstallmentService {
    installmentRepository;
    enrollmentRepository;
    constructor(installmentRepository, enrollmentRepository) {
        this.installmentRepository = installmentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }
    async create(createInstallmentDto) {
        const { enrollment_id, amount, due_date } = createInstallmentDto;
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id: enrollment_id },
            relations: { installments: true },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Enrollment with ID ${enrollment_id} not found`);
        }
        const existingTotal = enrollment.installments.reduce((sum, inst) => sum + Number(inst.amount), 0);
        if (existingTotal + amount > Number(enrollment.payable_amount)) {
            throw new common_1.BadRequestException(`Total installment amount (${existingTotal + amount}) would exceed payable amount (${enrollment.payable_amount})`);
        }
        const maxNumber = enrollment.installments.reduce((max, inst) => Math.max(max, inst.installment_number), 0);
        const installment = this.installmentRepository.create({
            enrollment_id,
            installment_number: maxNumber + 1,
            amount,
            paid_amount: 0,
            due_amount: amount,
            due_date: new Date(due_date),
            status: installment_entity_1.InstallmentStatus.PENDING,
        });
        return await this.installmentRepository.save(installment);
    }
    async findAll(pageStr, limitStr, enrollmentId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (enrollmentId) {
            where.enrollment_id = enrollmentId;
        }
        if (status) {
            where.status = status;
        }
        const [items, total] = await this.installmentRepository.findAndCount({
            where,
            relations: { payments: true },
            skip,
            take: limit,
            order: { installment_number: 'ASC' },
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
        const installment = await this.installmentRepository.findOne({
            where: { id },
            relations: { payments: true, enrollment: true },
        });
        if (!installment) {
            throw new common_1.NotFoundException(`Installment with ID ${id} not found`);
        }
        return installment;
    }
    async update(id, updateInstallmentDto) {
        const installment = await this.findOne(id);
        if (updateInstallmentDto.due_date) {
            installment.due_date = new Date(updateInstallmentDto.due_date);
        }
        if (updateInstallmentDto.status) {
            installment.status = updateInstallmentDto.status;
        }
        return await this.installmentRepository.save(installment);
    }
    async remove(id) {
        const installment = await this.findOne(id);
        if (Number(installment.paid_amount) > 0) {
            throw new common_1.BadRequestException('Cannot cancel an installment that has received payments');
        }
        installment.status = installment_entity_1.InstallmentStatus.CANCELLED;
        return await this.installmentRepository.save(installment);
    }
};
exports.InstallmentService = InstallmentService;
exports.InstallmentService = InstallmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(installment_entity_1.Installment)),
    __param(1, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], InstallmentService);
//# sourceMappingURL=installment.service.js.map