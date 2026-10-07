import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Installment, InstallmentStatus } from '../installment/entities/installment.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';
import { Lesson, LessonType } from '../lesson/entities/lesson.entity';
import { LiveSchedule } from '../live_schedules/entities/live_schedule.entity';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Installment)
    private readonly installmentRepository: Repository<Installment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LiveSchedule)
    private readonly liveScheduleRepository: Repository<LiveSchedule>,
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

  async getPublicStats() {
    const trainersCount = await this.userRepository.count({ where: { role: UserRole.MENTOR } });
    const studentsCount = await this.userRepository.count({ where: { role: UserRole.STUDENT } });
    const programsCount = await this.courseRepository.count();
    const courseVideosCount = await this.lessonRepository.count({ where: { type: LessonType.VIDEO } });
    const liveClassesCount = await this.liveScheduleRepository.count();

    // Default fallbacks in case DB is very empty to keep the landing page looking good
    return {
      expertTrainers: trainersCount > 0 ? trainersCount : 15,
      programs: programsCount > 0 ? programsCount : 12,
      students: studentsCount > 0 ? studentsCount : 200,
      courseVideos: courseVideosCount > 0 ? courseVideosCount : 312,
      liveClasses: liveClassesCount > 0 ? liveClassesCount : 45,
      yearsOfExperience: 10,
    };
  }
}

