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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./entities/assignment.entity");
const mentor_entity_1 = require("../mentors/entities/mentor.entity");
let AssignmentsService = class AssignmentsService {
    assignmentRepository;
    mentorRepository;
    constructor(assignmentRepository, mentorRepository) {
        this.assignmentRepository = assignmentRepository;
        this.mentorRepository = mentorRepository;
    }
    async create(createAssignmentDto, userId) {
        let { mentorId } = createAssignmentDto;
        if (!mentorId && userId) {
            const mentor = await this.mentorRepository.findOne({
                where: { user: { id: userId } },
            });
            if (mentor) {
                mentorId = mentor.id;
            }
        }
        if (!mentorId) {
            throw new common_1.BadRequestException('mentorId is required');
        }
        const { dueAt, mentorId: _, ...rest } = createAssignmentDto;
        const assignmentData = {
            ...rest,
            mentorId,
            dueAt: dueAt ? new Date(dueAt) : undefined,
        };
        const assignment = this.assignmentRepository.create(assignmentData);
        return await this.assignmentRepository.save(assignment);
    }
    async findAll(pageStr, limitStr, search, batchId, mentorId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.title = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (batchId) {
            where.batchId = batchId;
        }
        if (mentorId) {
            where.mentorId = mentorId;
        }
        if (status) {
            where.status = status;
        }
        const [items, total] = await this.assignmentRepository.findAndCount({
            where,
            relations: { batch: true, mentor: true },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
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
        const assignment = await this.assignmentRepository.findOne({
            where: { id },
            relations: { batch: true, mentor: true },
        });
        if (!assignment) {
            throw new common_1.NotFoundException(`Assignment with ID ${id} not found`);
        }
        return assignment;
    }
    async update(id, updateAssignmentDto) {
        const assignment = await this.findOne(id);
        const updatedAssignment = Object.assign(assignment, {
            ...updateAssignmentDto,
            ...(updateAssignmentDto.dueAt !== undefined && {
                dueAt: updateAssignmentDto.dueAt
                    ? new Date(updateAssignmentDto.dueAt)
                    : null,
            }),
        });
        return await this.assignmentRepository.save(updatedAssignment);
    }
    async remove(id) {
        const assignment = await this.findOne(id);
        return await this.assignmentRepository.remove(assignment);
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(1, (0, typeorm_1.InjectRepository)(mentor_entity_1.Mentor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map