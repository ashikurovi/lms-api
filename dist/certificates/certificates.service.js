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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const certificate_entity_1 = require("./entities/certificate.entity");
const student_entity_1 = require("../students/entities/student.entity");
const batch_entity_1 = require("../batch/entities/batch.entity");
const course_entity_1 = require("../course/entities/course.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
let CertificatesService = class CertificatesService {
    certificateRepository;
    studentRepository;
    batchRepository;
    courseRepository;
    enrollmentRepository;
    constructor(certificateRepository, studentRepository, batchRepository, courseRepository, enrollmentRepository) {
        this.certificateRepository = certificateRepository;
        this.studentRepository = studentRepository;
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }
    async create(createCertificateDto) {
        let { issueDate, studentName, courseName, batchNumber, studentId, courseId, batchId, ...rest } = createCertificateDto;
        if (!studentName) {
            const student = await this.studentRepository.findOne({ where: { id: studentId } });
            if (!student)
                throw new common_1.NotFoundException('Student not found');
            studentName = student.name;
        }
        if (!courseName) {
            const course = await this.courseRepository.findOne({ where: { id: courseId } });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
            courseName = course.title;
        }
        if (!batchNumber) {
            const batch = await this.batchRepository.findOne({ where: { id: batchId } });
            if (!batch)
                throw new common_1.NotFoundException('Batch not found');
            batchNumber = batch.name;
        }
        const certData = {
            ...rest,
            studentId,
            courseId,
            batchId,
            studentName,
            courseName,
            batchNumber,
            issueDate: new Date(issueDate),
            certificateNumber: `CERT-${(0, crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`,
            verificationCode: (0, crypto_1.randomBytes)(8).toString('hex').toUpperCase(),
        };
        const certificate = this.certificateRepository.create(certData);
        return await this.certificateRepository.save(certificate);
    }
    async createBulk(bulkDto) {
        const { batchId, courseId: providedCourseId, issueDate, signature1Url, signature2Url, signature1Name, signature1Designation, signature2Name, signature2Designation } = bulkDto;
        const finalIssueDate = issueDate ? new Date(issueDate) : new Date();
        const batch = await this.batchRepository.findOne({ where: { id: batchId }, relations: { course: true } });
        if (!batch)
            throw new common_1.NotFoundException('Batch not found');
        let course;
        if (providedCourseId) {
            course = await this.courseRepository.findOne({ where: { id: providedCourseId } });
        }
        else {
            course = batch.course || await this.courseRepository.findOne({ where: { id: batch.course_id } });
        }
        if (!course)
            throw new common_1.NotFoundException('Course not found for this batch');
        const enrollments = await this.enrollmentRepository.find({
            where: { batch_id: batchId, status: 'ACTIVE' },
            relations: { student: true },
        });
        if (enrollments.length === 0) {
            throw new common_1.NotFoundException('No active enrollments found for this batch');
        }
        const certsData = [];
        for (const enrollment of enrollments) {
            certsData.push({
                studentId: enrollment.student_id,
                courseId: course.id,
                batchId: batch.id,
                studentName: enrollment.student?.name || 'Unknown Student',
                courseName: course.title,
                batchNumber: batch.name,
                issueDate: finalIssueDate,
                signature1Url,
                signature2Url,
                signature1Name,
                signature1Designation,
                signature2Name,
                signature2Designation,
                certificateNumber: `CERT-${(0, crypto_1.randomBytes)(4).toString('hex').toUpperCase()}`,
                verificationCode: (0, crypto_1.randomBytes)(8).toString('hex').toUpperCase(),
            });
        }
        const certificates = this.certificateRepository.create(certsData);
        return await this.certificateRepository.save(certificates);
    }
    async findAll(pageStr, limitStr, search, batchId, courseId, studentId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.studentName = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (batchId) {
            where.batchId = batchId;
        }
        if (courseId) {
            where.courseId = courseId;
        }
        if (studentId) {
            where.studentId = studentId;
        }
        if (status) {
            where.status = status;
        }
        const [items, total] = await this.certificateRepository.findAndCount({
            where,
            relations: { student: true, batch: true, course: true },
            skip,
            take: limit,
            order: { issueDate: 'DESC' },
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
        const certificate = await this.certificateRepository.findOne({
            where: { id },
            relations: { student: true, batch: true, course: true },
        });
        if (!certificate) {
            throw new common_1.NotFoundException(`Certificate with ID ${id} not found`);
        }
        return certificate;
    }
    async update(id, updateCertificateDto) {
        const certificate = await this.findOne(id);
        const updatedCertificate = Object.assign(certificate, {
            ...updateCertificateDto,
            ...(updateCertificateDto.issueDate !== undefined && {
                issueDate: updateCertificateDto.issueDate
                    ? new Date(updateCertificateDto.issueDate)
                    : null,
            }),
        });
        return await this.certificateRepository.save(updatedCertificate);
    }
    async remove(id) {
        const certificate = await this.findOne(id);
        return await this.certificateRepository.remove(certificate);
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificate)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(batch_entity_1.Batch)),
    __param(3, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(4, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map