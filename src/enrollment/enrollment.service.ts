import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { CreateManualEnrollmentDto } from './dto/create-manual-enrollment.dto';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import {
  Installment,
  InstallmentStatus,
} from '../installment/entities/installment.entity';
import { Payment, PaymentStatus, PaymentGateway, PaymentEnvironment } from '../payments/entities/payment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Installment)
    private installmentRepository: Repository<Installment>,
    private dataSource: DataSource,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const {
      student_id,
      batch_id,
      total_amount,
      discount_amount = 0,
      installment_count,
      installment_due_dates,
    } = createEnrollmentDto;

    const payable_amount = total_amount - discount_amount;

    if (payable_amount < 0) {
      throw new BadRequestException(
        'Discount amount cannot exceed total amount',
      );
    }

    // Use a transaction to create enrollment + installments atomically
    return await this.dataSource.transaction(async (manager) => {
      const enrollment = manager.create(Enrollment, {
        student_id,
        batch_id,
        total_amount,
        discount_amount,
        payable_amount,
        paid_amount: 0,
        due_amount: payable_amount,
        status: EnrollmentStatus.ACTIVE,
        enrolled_at: new Date(),
      });

      const savedEnrollment = await manager.save(Enrollment, enrollment);

      // Auto-generate installments if installment_count is provided
      if (installment_count && installment_count > 0) {
        const installmentAmount = Math.floor(
          (payable_amount / installment_count) * 100,
        ) / 100;
        // Last installment gets the remainder to avoid rounding issues
        const lastInstallmentAmount =
          payable_amount - installmentAmount * (installment_count - 1);

        const installments: Partial<Installment>[] = [];

        for (let i = 0; i < installment_count; i++) {
          const amount =
            i === installment_count - 1
              ? lastInstallmentAmount
              : installmentAmount;

          const dueDate =
            installment_due_dates && installment_due_dates[i]
              ? new Date(installment_due_dates[i])
              : undefined;

          installments.push({
            enrollment_id: savedEnrollment.id,
            installment_number: i + 1,
            amount,
            paid_amount: 0,
            due_amount: amount,
            due_date: dueDate,
            status: InstallmentStatus.PENDING,
          });
        }

        const createdInstallments = manager.create(Installment, installments);
        await manager.save(Installment, createdInstallments);
      }

      // Return enrollment with installments
      return await manager.findOne(Enrollment, {
        where: { id: savedEnrollment.id },
        relations: { installments: true, student: true, batch: true },
      });
    });
  }

  async createManual(dto: CreateManualEnrollmentDto) {
    const {
      student_id,
      batch_id,
      total_amount,
      discount_amount = 0,
      paid_amount,
      transaction_id,
    } = dto;

    const payable_amount = total_amount - discount_amount;
    const due_amount = payable_amount - paid_amount;

    if (payable_amount < 0) {
      throw new BadRequestException('Discount amount cannot exceed total amount');
    }
    if (due_amount < 0) {
      throw new BadRequestException('Paid amount cannot exceed payable amount');
    }

    return await this.dataSource.transaction(async (manager) => {
      // 1. Create Enrollment
      const enrollment = manager.create(Enrollment, {
        student_id,
        batch_id,
        total_amount,
        discount_amount,
        payable_amount,
        paid_amount,
        due_amount,
        status: EnrollmentStatus.ACTIVE,
        enrolled_at: new Date(),
      });
      const savedEnrollment = await manager.save(Enrollment, enrollment);

      // 2. Create Installment for the manual payment
      const installment = manager.create(Installment, {
        enrollment_id: savedEnrollment.id,
        installment_number: 1,
        amount: paid_amount,
        paid_amount: paid_amount,
        due_amount: 0,
        due_date: new Date(),
        status: InstallmentStatus.PAID,
      });
      const savedInstallment = await manager.save(Installment, installment);

      // 3. Create Payment Record
      const payment = manager.create(Payment, {
        enrollment_id: savedEnrollment.id,
        installment_id: savedInstallment.id,
        amount: paid_amount,
        gateway: PaymentGateway.MANUAL,
        environment: PaymentEnvironment.LIVE,
        transaction_id: transaction_id || `MANUAL-${Date.now()}`,
        status: PaymentStatus.SUCCESS,
        paid_at: new Date(),
      });
      await manager.save(Payment, payment);

      // 4. Create remaining pending installment if due amount exists
      if (due_amount > 0) {
        const futureInstallment = manager.create(Installment, {
          enrollment_id: savedEnrollment.id,
          installment_number: 2,
          amount: due_amount,
          paid_amount: 0,
          due_amount: due_amount,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default due date 30 days later
          status: InstallmentStatus.PENDING,
        });
        await manager.save(Installment, futureInstallment);
      }

      return await manager.findOne(Enrollment, {
        where: { id: savedEnrollment.id },
        relations: { installments: { payments: true }, student: true, batch: true },
      });
    });
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    studentId?: string,
    batchId?: string,
    status?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (studentId) {
      where.student_id = studentId;
    }
    if (batchId) {
      where.batch_id = batchId;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.enrollmentRepository.findAndCount({
      where,
      relations: { student: true, batch: true, installments: true },
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
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: {
        student: true,
        batch: true,
        installments: { payments: true },
        payments: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.findOne(id);

    if (updateEnrollmentDto.discount_amount !== undefined) {
      const newPayable =
        Number(enrollment.total_amount) - updateEnrollmentDto.discount_amount;

      if (newPayable < 0) {
        throw new BadRequestException(
          'Discount amount cannot exceed total amount',
        );
      }

      if (newPayable < Number(enrollment.paid_amount)) {
        throw new BadRequestException(
          'New payable amount cannot be less than already paid amount',
        );
      }

      enrollment.discount_amount = updateEnrollmentDto.discount_amount;
      enrollment.payable_amount = newPayable;
      enrollment.due_amount = newPayable - Number(enrollment.paid_amount);
    }

    if (updateEnrollmentDto.status) {
      enrollment.status = updateEnrollmentDto.status;
    }

    return await this.enrollmentRepository.save(enrollment);
  }

  async remove(id: string) {
    const enrollment = await this.findOne(id);
    enrollment.status = EnrollmentStatus.CANCELLED;
    return await this.enrollmentRepository.save(enrollment);
  }
}
