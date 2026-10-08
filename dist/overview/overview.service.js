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
exports.OverviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../payments/entities/payment.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
const installment_entity_1 = require("../installment/entities/installment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const course_entity_1 = require("../course/entities/course.entity");
const lesson_entity_1 = require("../lesson/entities/lesson.entity");
const live_schedule_entity_1 = require("../live_schedules/entities/live_schedule.entity");
let OverviewService = class OverviewService {
    paymentRepository;
    enrollmentRepository;
    installmentRepository;
    userRepository;
    courseRepository;
    lessonRepository;
    liveScheduleRepository;
    constructor(paymentRepository, enrollmentRepository, installmentRepository, userRepository, courseRepository, lessonRepository, liveScheduleRepository) {
        this.paymentRepository = paymentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.installmentRepository = installmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.liveScheduleRepository = liveScheduleRepository;
    }
    async getAdminOverview(startDate, endDate) {
        const paymentQuery = this.paymentRepository.createQueryBuilder('payment')
            .where('payment.status = :status', { status: payment_entity_1.PaymentStatus.SUCCESS });
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
    async getStudentOverview(studentId) {
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
        const upcomingInstallments = [];
        const paymentHistory = [];
        enrollments.forEach(enrollment => {
            totalPayable += Number(enrollment.payable_amount || 0);
            totalPaid += Number(enrollment.paid_amount || 0);
            totalDue += Number(enrollment.due_amount || 0);
            if (enrollment.installments) {
                upcomingInstallments.push(...enrollment.installments.filter(inst => inst.status !== installment_entity_1.InstallmentStatus.PAID &&
                    inst.status !== installment_entity_1.InstallmentStatus.CANCELLED));
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
        const trainersCount = await this.userRepository.count({ where: { role: user_entity_1.UserRole.MENTOR } });
        const studentsCount = await this.userRepository.count({ where: { role: user_entity_1.UserRole.STUDENT } });
        const programsCount = await this.courseRepository.count();
        const courseVideosCount = await this.lessonRepository.count({ where: { type: lesson_entity_1.LessonType.VIDEO } });
        const liveClassesCount = await this.liveScheduleRepository.count();
        return {
            expertTrainers: trainersCount > 0 ? trainersCount : 15,
            programs: programsCount > 0 ? programsCount : 12,
            students: studentsCount > 0 ? studentsCount : 200,
            courseVideos: courseVideosCount > 0 ? courseVideosCount : 312,
            liveClasses: liveClassesCount > 0 ? liveClassesCount : 45,
            yearsOfExperience: 10,
        };
    }
};
exports.OverviewService = OverviewService;
exports.OverviewService = OverviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(2, (0, typeorm_1.InjectRepository)(installment_entity_1.Installment)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(5, (0, typeorm_1.InjectRepository)(lesson_entity_1.Lesson)),
    __param(6, (0, typeorm_1.InjectRepository)(live_schedule_entity_1.LiveSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OverviewService);
//# sourceMappingURL=overview.service.js.map