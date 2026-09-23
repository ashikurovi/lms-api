import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Installment, InstallmentStatus } from '../installment/entities/installment.entity';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,
  ) {}

  async getAdminOverview(startDate?: string, endDate?: string) {
    const paymentQuery = this.paymentRepository.createQueryBuilder('payment')
      .where('payment.status = :status', { status: PaymentStatus.SUCCESS });

    const enrollmentQuery = this.enrollmentRepository.createQueryBuilder('enrollment');

    if (startDate) {
      paymentQuery.andWhere('payment.paid_at >= :startDate', { startDate });
      enrollmentQuery.andWhere('enrollment.enrolled_at >= :startDate', { startDate });
    }
    if (endDate) {
      paymentQuery.andWhere('payment.paid_at <= :endDate', { endDate });
      enrollmentQuery.andWhere('enrollment.enrolled_at <= :endDate', { endDate });
    }

    const { totalRevenue } = await paymentQuery
      .select('SUM(payment.amount)', 'totalRevenue')
      .getRawOne();

    const { totalDues } = await enrollmentQuery
      .select('SUM(enrollment.due_amount)', 'totalDues')
      .getRawOne();

    const totalEnrollments = await enrollmentQuery.getCount();

    return {
      totalRevenue: Number(totalRevenue || 0),
      totalDues: Number(totalDues || 0),
      totalEnrollments,
    };
  }

  async getStudentOverview(studentId: string) {
    const enrollments = await this.enrollmentRepository.find({
      where: { student_id: studentId },
      relations: {
        batch: true,
        installments: true,
        payments: true,
      },
    });

    let totalPayable = 0;
    let totalPaid = 0;
    let totalDue = 0;
    const upcomingInstallments: Installment[] = [];
    const paymentHistory: Payment[] = [];

    enrollments.forEach(enrollment => {
      totalPayable += Number(enrollment.payable_amount || 0);
      totalPaid += Number(enrollment.paid_amount || 0);
      totalDue += Number(enrollment.due_amount || 0);

      if (enrollment.installments) {
        upcomingInstallments.push(
          ...enrollment.installments.filter(inst => 
            inst.status !== InstallmentStatus.PAID && 
            inst.status !== InstallmentStatus.CANCELLED
          )
        );
      }

      if (enrollment.payments) {
        paymentHistory.push(...enrollment.payments);
      }
    });

    upcomingInstallments.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    paymentHistory.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return {
      totalPayable,
      totalPaid,
      totalDue,
      upcomingInstallments,
      paymentHistory,
    };
  }
}

