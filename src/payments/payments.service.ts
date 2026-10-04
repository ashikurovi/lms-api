import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  Payment,
  PaymentStatus,
  PaymentGateway,
  PaymentEnvironment,
} from './entities/payment.entity';
import { Installment, InstallmentStatus } from '../installment/entities/installment.entity';
import { Enrollment, EnrollmentStatus } from '../enrollment/entities/enrollment.entity';
import { SslcommerzService } from './sslcommerz.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Installment)
    private installmentRepository: Repository<Installment>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    private sslcommerzService: SslcommerzService,
    private dataSource: DataSource,
  ) {}

  /**
   * Initiate a payment: validate amounts, create PENDING payment,
   * call SSLCOMMERZ to get redirect URL.
   */
  async initiatePayment(createPaymentDto: CreatePaymentDto) {
    const { installment_id, amount } = createPaymentDto;

    // Load installment with enrollment and student
    const installment = await this.installmentRepository.findOne({
      where: { id: installment_id },
      relations: { enrollment: { student: true, batch: true } },
    });

    if (!installment) {
      throw new NotFoundException(
        `Installment with ID ${installment_id} not found`,
      );
    }

    const enrollment = installment.enrollment;

    // Validate: payment amount must not exceed installment due
    const installmentDue = Number(installment.due_amount);
    if (amount > installmentDue) {
      throw new BadRequestException(
        `Payment amount (${amount}) exceeds installment due amount (${installmentDue})`,
      );
    }

    // Validate: payment must not exceed overall enrollment due
    const enrollmentDue = Number(enrollment.due_amount);
    if (amount > enrollmentDue) {
      throw new BadRequestException(
        `Payment amount (${amount}) exceeds enrollment due amount (${enrollmentDue})`,
      );
    }

    // Generate unique transaction ID
    const transactionId = `TXN-${Date.now()}-${uuidv4().slice(0, 8)}`;

    // Determine environment
    const environment = this.sslcommerzService.getEnvironment();

    // Create PENDING payment record
    const payment = this.paymentRepository.create({
      enrollment_id: enrollment.id,
      installment_id: installment.id,
      amount,
      gateway: PaymentGateway.SSLCOMMERZ,
      environment:
        environment === 'SANDBOX'
          ? PaymentEnvironment.SANDBOX
          : PaymentEnvironment.LIVE,
      transaction_id: transactionId,
      status: PaymentStatus.PENDING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Call SSLCOMMERZ to init session
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
      // Mark payment as failed if SSLCOMMERZ init fails
      savedPayment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(savedPayment);
      throw new BadRequestException(
        'Failed to initialize payment gateway session',
      );
    }

    return {
      payment_id: savedPayment.id,
      transaction_id: transactionId,
      gateway_url: sslResponse.GatewayPageURL,
      sessionkey: sslResponse.sessionkey,
    };
  }

  /**
   * Handle SSLCOMMERZ IPN (Instant Payment Notification).
   * Verify with SSLCOMMERZ, then update Payment → Installment → Enrollment
   * inside a database transaction.
   */
  async handleIPN(ipnData: any) {
    const { tran_id, val_id, status: gatewayStatus } = ipnData;

    this.logger.log(`IPN received: tran_id=${tran_id}, status=${gatewayStatus}`);

    if (!tran_id) {
      throw new BadRequestException('Missing transaction ID in IPN');
    }

    // Find the payment by transaction_id
    const payment = await this.paymentRepository.findOne({
      where: { transaction_id: tran_id },
      relations: { installment: true, enrollment: true },
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment with transaction ID ${tran_id} not found`,
      );
    }

    // Idempotency: if payment is already SUCCESS, ignore duplicate IPN
    if (payment.status === PaymentStatus.SUCCESS) {
      this.logger.warn(`Duplicate IPN for transaction ${tran_id}, ignoring`);
      return { message: 'Payment already processed' };
    }

    // Handle non-VALID statuses from gateway
    if (gatewayStatus !== 'VALID') {
      payment.status =
        gatewayStatus === 'CANCELLED'
          ? PaymentStatus.CANCELLED
          : PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
      return { message: `Payment ${payment.status.toLowerCase()}` };
    }

    // Verify with SSLCOMMERZ validation API
    const validation =
      await this.sslcommerzService.validateTransaction(val_id);

    if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
      return { message: 'Payment verification failed' };
    }

    // Validate amount matches
    const validatedAmount = parseFloat(validation.amount);
    if (validatedAmount !== Number(payment.amount)) {
      this.logger.error(
        `Amount mismatch: expected ${payment.amount}, got ${validatedAmount}`,
      );
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
      return { message: 'Payment amount mismatch' };
    }

    // All verified — update Payment, Installment, Enrollment in a transaction
    await this.dataSource.transaction(async (manager) => {
      // 1. Update Payment → SUCCESS
      payment.status = PaymentStatus.SUCCESS;
      payment.paid_at = new Date();
      await manager.save(Payment, payment);

      // 2. Update Installment
      const installment = await manager.findOne(Installment, {
        where: { id: payment.installment_id },
      });

      if (installment) {
        const newPaidAmount =
          Number(installment.paid_amount) + Number(payment.amount);
        const newDueAmount = Number(installment.amount) - newPaidAmount;

        installment.paid_amount = newPaidAmount;
        installment.due_amount = Math.max(0, newDueAmount);

        if (installment.due_amount <= 0) {
          installment.status = InstallmentStatus.PAID;
        } else {
          installment.status = InstallmentStatus.PARTIAL;
        }

        await manager.save(Installment, installment);
      }

      // 3. Update Enrollment
      const enrollment = await manager.findOne(Enrollment, {
        where: { id: payment.enrollment_id },
      });

      if (enrollment) {
        const newPaidAmount =
          Number(enrollment.paid_amount) + Number(payment.amount);
        const newDueAmount =
          Number(enrollment.payable_amount) - newPaidAmount;

        enrollment.paid_amount = newPaidAmount;
        enrollment.due_amount = Math.max(0, newDueAmount);
        enrollment.status = EnrollmentStatus.ACTIVE;

        await manager.save(Enrollment, enrollment);
      }
    });

    return { message: 'Payment verified and processed successfully' };
  }

  /**
   * Success redirect handler — does NOT change payment status.
   * Only returns info for frontend display.
   */
  async handleSuccess(queryData: any) {
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

  /**
   * Fail redirect handler — mark payment as FAILED.
   */
  async handleFail(queryData: any) {
    const { tran_id } = queryData;

    if (tran_id) {
      const payment = await this.paymentRepository.findOne({
        where: { transaction_id: tran_id },
      });

      if (payment && payment.status === PaymentStatus.PENDING) {
        payment.status = PaymentStatus.FAILED;
        await this.paymentRepository.save(payment);
      }
    }

    return {
      message: 'Payment failed',
      transaction_id: tran_id,
    };
  }

  /**
   * Cancel redirect handler — mark payment as CANCELLED.
   */
  async handleCancel(queryData: any) {
    const { tran_id } = queryData;

    if (tran_id) {
      const payment = await this.paymentRepository.findOne({
        where: { transaction_id: tran_id },
      });

      if (payment && payment.status === PaymentStatus.PENDING) {
        payment.status = PaymentStatus.CANCELLED;
        await this.paymentRepository.save(payment);
      }
    }

    return {
      message: 'Payment cancelled',
      transaction_id: tran_id,
    };
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    enrollmentId?: string,
    installmentId?: string,
    status?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

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

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: { installment: true, enrollment: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }
}
