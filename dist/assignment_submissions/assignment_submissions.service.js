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
exports.AssignmentSubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_submission_entity_1 = require("./entities/assignment_submission.entity");
const mentor_entity_1 = require("../mentors/entities/mentor.entity");
let AssignmentSubmissionsService = class AssignmentSubmissionsService {
    submissionRepository;
    dataSource;
    constructor(submissionRepository, dataSource) {
        this.submissionRepository = submissionRepository;
        this.dataSource = dataSource;
    }
    async create(createSubmissionDto, userId) {
        if (!createSubmissionDto.studentId && userId) {
            createSubmissionDto.studentId = userId;
        }
        if (!createSubmissionDto.studentId) {
            throw new common_1.BadRequestException('studentId is required');
        }
        const submissionData = {
            ...createSubmissionDto,
            submittedAt: new Date(),
        };
        const submission = this.submissionRepository.create(submissionData);
        return await this.submissionRepository.save(submission);
    }
    async findAll(pageStr, limitStr, assignmentId, studentId, status, user) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        let resolvedStudentId = studentId;
        if (!resolvedStudentId && user && user.role === 'student') {
            resolvedStudentId = user.id;
        }
        const where = {};
        if (assignmentId) {
            where.assignmentId = assignmentId;
        }
        if (resolvedStudentId) {
            where.studentId = resolvedStudentId;
        }
        if (status) {
            where.status = status;
        }
        if (user && user.role === 'mentor') {
            const mentor = await this.dataSource.getRepository(mentor_entity_1.Mentor).findOne({
                where: { user: { id: user.id } },
            });
            if (mentor) {
                where.assignment = { mentorId: mentor.id };
            }
        }
        const [items, total] = await this.submissionRepository.findAndCount({
            where,
            relations: { assignment: true, student: true },
            skip,
            take: limit,
            order: { submittedAt: 'DESC' },
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
        const submission = await this.submissionRepository.findOne({
            where: { id },
            relations: { assignment: true, student: true },
        });
        if (!submission) {
            throw new common_1.NotFoundException(`Assignment submission with ID ${id} not found`);
        }
        return submission;
    }
    async update(id, updateSubmissionDto, reviewerId) {
        const submission = await this.findOne(id);
        if ((updateSubmissionDto.marks !== undefined || updateSubmissionDto.feedback !== undefined) &&
            !updateSubmissionDto.status) {
            updateSubmissionDto.status = 'reviewed';
        }
        const updatedSubmission = Object.assign(submission, {
            ...updateSubmissionDto,
            ...(updateSubmissionDto.status === 'reviewed' && {
                reviewedAt: new Date(),
                ...(reviewerId && { reviewedBy: reviewerId }),
            }),
        });
        return await this.submissionRepository.save(updatedSubmission);
    }
    async remove(id) {
        const submission = await this.findOne(id);
        return await this.submissionRepository.remove(submission);
    }
};
exports.AssignmentSubmissionsService = AssignmentSubmissionsService;
exports.AssignmentSubmissionsService = AssignmentSubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_submission_entity_1.AssignmentSubmission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], AssignmentSubmissionsService);
//# sourceMappingURL=assignment_submissions.service.js.map