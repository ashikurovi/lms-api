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
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enrollment_entity_1 = require("./entities/enrollment.entity");
const installment_entity_1 = require("../installment/entities/installment.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const batch_entity_1 = require("../batch/entities/batch.entity");
const lesson_progress_entity_1 = require("../lesson/entities/lesson-progress.entity");
let EnrollmentService = class EnrollmentService {
    enrollmentRepository;
    installmentRepository;
    lessonProgressRepository;
    dataSource;
    constructor(enrollmentRepository, installmentRepository, lessonProgressRepository, dataSource) {
        this.enrollmentRepository = enrollmentRepository;
        this.installmentRepository = installmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.dataSource = dataSource;
    }
    async markLessonCompleted(studentId, lessonId) {
        let progress = await this.lessonProgressRepository.findOne({
            where: { student_id: studentId, lesson_id: lessonId },
        });
        if (!progress) {
            progress = this.lessonProgressRepository.create({
                student_id: studentId,
                lesson_id: lessonId,
                is_completed: true,
            });
        }
        else {
            progress.is_completed = true;
        }
        return await this.lessonProgressRepository.save(progress);
    }
    async create(createEnrollmentDto) {
        const { student_id, batch_id, discount_amount = 0, installment_count, installment_due_dates, } = createEnrollmentDto;
        const batch = await this.dataSource.manager.findOne(batch_entity_1.Batch, {
            where: { id: batch_id },
            relations: { course: true },
        });
        if (!batch || !batch.course) {
            throw new common_1.NotFoundException('Batch or Course not found for enrollment');
        }
        const total_amount = Number(batch.discount_price || batch.price || 0);
        const payable_amount = total_amount - discount_amount;
        if (payable_amount < 0) {
            throw new common_1.BadRequestException('Discount amount cannot exceed total amount');
        }
        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: {
                student_id,
                batch_id,
                status: (0, typeorm_2.Not)(enrollment_entity_1.EnrollmentStatus.CANCELLED),
            },
        });
        if (existingEnrollment) {
            throw new common_1.BadRequestException('Student is already enrolled in this batch');
        }
        return await this.dataSource.transaction(async (manager) => {
            const enrollment = manager.create(enrollment_entity_1.Enrollment, {
                student_id,
                batch_id,
                total_amount,
                discount_amount,
                payable_amount,
                paid_amount: 0,
                due_amount: payable_amount,
                status: enrollment_entity_1.EnrollmentStatus.PENDING,
                enrolled_at: new Date(),
            });
            const savedEnrollment = await manager.save(enrollment_entity_1.Enrollment, enrollment);
            if (installment_count && installment_count > 0) {
                const installmentAmount = Math.floor((payable_amount / installment_count) * 100) / 100;
                const lastInstallmentAmount = payable_amount - installmentAmount * (installment_count - 1);
                const installments = [];
                for (let i = 0; i < installment_count; i++) {
                    const amount = i === installment_count - 1
                        ? lastInstallmentAmount
                        : installmentAmount;
                    const dueDate = installment_due_dates && installment_due_dates[i]
                        ? new Date(installment_due_dates[i])
                        : undefined;
                    installments.push({
                        enrollment_id: savedEnrollment.id,
                        installment_number: i + 1,
                        amount,
                        paid_amount: 0,
                        due_amount: amount,
                        due_date: dueDate,
                        status: installment_entity_1.InstallmentStatus.PENDING,
                    });
                }
                const createdInstallments = manager.create(installment_entity_1.Installment, installments);
                await manager.save(installment_entity_1.Installment, createdInstallments);
            }
            return await manager.findOne(enrollment_entity_1.Enrollment, {
                where: { id: savedEnrollment.id },
                relations: { installments: true, student: true, batch: true },
            });
        });
    }
    async createManual(dto) {
        const { student_id, batch_id, discount_amount = 0, paid_amount, transaction_id, } = dto;
        const batch = await this.dataSource.manager.findOne(batch_entity_1.Batch, {
            where: { id: batch_id },
            relations: { course: true },
        });
        if (!batch || !batch.course) {
            throw new common_1.NotFoundException('Batch or Course not found for enrollment');
        }
        const total_amount = Number(batch.discount_price || batch.price || 0);
        const payable_amount = total_amount - discount_amount;
        const due_amount = payable_amount - paid_amount;
        if (payable_amount < 0) {
            throw new common_1.BadRequestException('Discount amount cannot exceed total amount');
        }
        if (due_amount < 0) {
            throw new common_1.BadRequestException('Paid amount cannot exceed payable amount');
        }
        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: {
                student_id,
                batch_id,
                status: (0, typeorm_2.Not)(enrollment_entity_1.EnrollmentStatus.CANCELLED),
            },
        });
        if (existingEnrollment) {
            throw new common_1.BadRequestException('Student is already enrolled in this batch');
        }
        return await this.dataSource.transaction(async (manager) => {
            const enrollment = manager.create(enrollment_entity_1.Enrollment, {
                student_id,
                batch_id,
                total_amount,
                discount_amount,
                payable_amount,
                paid_amount,
                due_amount,
                status: enrollment_entity_1.EnrollmentStatus.ACTIVE,
                enrolled_at: new Date(),
            });
            const savedEnrollment = await manager.save(enrollment_entity_1.Enrollment, enrollment);
            const installment = manager.create(installment_entity_1.Installment, {
                enrollment_id: savedEnrollment.id,
                installment_number: 1,
                amount: paid_amount,
                paid_amount: paid_amount,
                due_amount: 0,
                due_date: new Date(),
                status: installment_entity_1.InstallmentStatus.PAID,
            });
            const savedInstallment = await manager.save(installment_entity_1.Installment, installment);
            const payment = manager.create(payment_entity_1.Payment, {
                enrollment_id: savedEnrollment.id,
                installment_id: savedInstallment.id,
                amount: paid_amount,
                gateway: payment_entity_1.PaymentGateway.MANUAL,
                environment: payment_entity_1.PaymentEnvironment.LIVE,
                transaction_id: transaction_id || `MANUAL-${Date.now()}`,
                status: payment_entity_1.PaymentStatus.SUCCESS,
                paid_at: new Date(),
            });
            await manager.save(payment_entity_1.Payment, payment);
            if (due_amount > 0) {
                const futureInstallment = manager.create(installment_entity_1.Installment, {
                    enrollment_id: savedEnrollment.id,
                    installment_number: 2,
                    amount: due_amount,
                    paid_amount: 0,
                    due_amount: due_amount,
                    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    status: installment_entity_1.InstallmentStatus.PENDING,
                });
                await manager.save(installment_entity_1.Installment, futureInstallment);
            }
            return await manager.findOne(enrollment_entity_1.Enrollment, {
                where: { id: savedEnrollment.id },
                relations: { installments: { payments: true }, student: true, batch: true },
            });
        });
    }
    async findAll(pageStr, limitStr, studentId, batchId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
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
            relations: {
                student: true,
                batch: {
                    course: {
                        category: true,
                        mentors: true,
                        modules: {
                            lessons: true,
                        }
                    }
                },
                installments: true,
            },
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
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id },
            relations: {
                student: true,
                batch: {
                    course: {
                        category: true,
                        mentors: true,
                        modules: {
                            lessons: true,
                        }
                    }
                },
                installments: { payments: true },
                payments: true,
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Enrollment with ID ${id} not found`);
        }
        return enrollment;
    }
    async findByStudentAndBatch(studentId, batchId) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { student_id: studentId, batch_id: batchId },
            relations: {
                student: true,
                batch: {
                    course: {
                        category: true,
                        mentors: true,
                        modules: {
                            lessons: true,
                        }
                    }
                },
                installments: { payments: true },
                payments: true,
            },
        });
        if (!enrollment) {
            throw new common_1.NotFoundException(`Enrollment for student ${studentId} in batch ${batchId} not found`);
        }
        return enrollment;
    }
    async findAllByStudent(studentId) {
        const enrollments = await this.enrollmentRepository.find({
            where: { student_id: studentId },
            relations: {
                student: true,
                batch: {
                    course: {
                        category: true,
                        mentors: true,
                        modules: {
                            lessons: true,
                        }
                    }
                },
                installments: { payments: true },
                payments: true,
            },
            order: { created_at: 'DESC' },
        });
        const progresses = await this.lessonProgressRepository.find({
            where: { student_id: studentId }
        });
        enrollments.forEach(enr => {
            enr.lesson_progress = progresses;
        });
        return enrollments;
    }
    async update(id, updateEnrollmentDto) {
        const enrollment = await this.findOne(id);
        if (updateEnrollmentDto.discount_amount !== undefined) {
            const newPayable = Number(enrollment.total_amount) - updateEnrollmentDto.discount_amount;
            if (newPayable < 0) {
                throw new common_1.BadRequestException('Discount amount cannot exceed total amount');
            }
            if (newPayable < Number(enrollment.paid_amount)) {
                throw new common_1.BadRequestException('New payable amount cannot be less than already paid amount');
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
    async remove(id) {
        const enrollment = await this.findOne(id);
        enrollment.status = enrollment_entity_1.EnrollmentStatus.CANCELLED;
        return await this.enrollmentRepository.save(enrollment);
    }
    async getStudentIdByUserId(userId) {
        try {
            const student = await this.dataSource.manager.findOne('Student', {
                where: { user: { id: userId } }
            });
            if (student && student.id) {
                return student.id;
            }
            const user = await this.dataSource.manager.findOne('User', {
                where: { id: userId }
            });
            if (user) {
                const newStudent = this.dataSource.manager.create('Student', {
                    user: user,
                    name: user.name || 'Student',
                    email: user.email || `${Date.now()}@example.com`,
                    phone: user.phone || null,
                });
                const savedStudent = await this.dataSource.manager.save(newStudent);
                return savedStudent.id;
            }
        }
        catch (e) {
            console.error('Failed to find or create student by user id', e);
        }
        return userId;
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(1, (0, typeorm_1.InjectRepository)(installment_entity_1.Installment)),
    __param(2, (0, typeorm_1.InjectRepository)(lesson_progress_entity_1.LessonProgress)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map