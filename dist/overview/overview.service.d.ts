import { Repository } from 'typeorm';
import { Payment } from '../payments/entities/payment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Installment } from '../installment/entities/installment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { LiveSchedule } from '../live_schedules/entities/live_schedule.entity';
export declare class OverviewService {
    private readonly paymentRepository;
    private readonly enrollmentRepository;
    private readonly installmentRepository;
    private readonly userRepository;
    private readonly courseRepository;
    private readonly lessonRepository;
    private readonly liveScheduleRepository;
    constructor(paymentRepository: Repository<Payment>, enrollmentRepository: Repository<Enrollment>, installmentRepository: Repository<Installment>, userRepository: Repository<User>, courseRepository: Repository<Course>, lessonRepository: Repository<Lesson>, liveScheduleRepository: Repository<LiveSchedule>);
    getAdminOverview(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
        totalDues: number;
        totalEnrollments: number;
    }>;
    getStudentOverview(studentId: string): Promise<{
        totalPayable: number;
        totalPaid: number;
        totalDue: number;
        upcomingInstallments: Installment[];
        paymentHistory: Payment[];
    }>;
    getPublicStats(): Promise<{
        expertTrainers: number;
        programs: number;
        students: number;
        courseVideos: number;
        liveClasses: number;
        yearsOfExperience: number;
    }>;
}
