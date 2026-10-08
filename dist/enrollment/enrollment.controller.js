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
exports.EnrollmentController = void 0;
const common_1 = require("@nestjs/common");
const enrollment_service_1 = require("./enrollment.service");
const create_enrollment_dto_1 = require("./dto/create-enrollment.dto");
const create_manual_enrollment_dto_1 = require("./dto/create-manual-enrollment.dto");
const update_enrollment_dto_1 = require("./dto/update-enrollment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let EnrollmentController = class EnrollmentController {
    enrollmentService;
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    async create(createEnrollmentDto) {
        const studentId = await this.enrollmentService.getStudentIdByUserId(createEnrollmentDto.student_id);
        createEnrollmentDto.student_id = studentId;
        const data = await this.enrollmentService.create(createEnrollmentDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Enrollment created successfully',
            data,
        };
    }
    async createManual(dto) {
        const data = await this.enrollmentService.createManual(dto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Manual enrollment completed successfully',
            data,
        };
    }
    async findAll(page, limit, studentId, batchId, status) {
        const data = await this.enrollmentService.findAll(page, limit, studentId, batchId, status);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Enrollments retrieved successfully',
            data,
        };
    }
    async getMyEnrollments(req) {
        const userId = req.user.id;
        const studentId = await this.enrollmentService.getStudentIdByUserId(userId);
        const data = await this.enrollmentService.findAllByStudent(studentId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'My enrollments retrieved successfully',
            data,
        };
    }
    async markLessonCompleted(lessonId, req) {
        const userId = req.user.id;
        const studentId = await this.enrollmentService.getStudentIdByUserId(userId);
        const data = await this.enrollmentService.markLessonCompleted(studentId, lessonId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Lesson progress updated successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.enrollmentService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Enrollment retrieved successfully',
            data,
        };
    }
    async findAllByStudent(studentId) {
        const data = await this.enrollmentService.findAllByStudent(studentId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Student enrollments retrieved successfully',
            data,
        };
    }
    async findByStudentAndBatch(studentId, batchId) {
        const data = await this.enrollmentService.findByStudentAndBatch(studentId, batchId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Student enrollment retrieved successfully',
            data,
        };
    }
    async update(id, updateEnrollmentDto) {
        const data = await this.enrollmentService.update(id, updateEnrollmentDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Enrollment updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.enrollmentService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Enrollment cancelled successfully',
            data,
        };
    }
};
exports.EnrollmentController = EnrollmentController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.STUDENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enrollment_dto_1.CreateEnrollmentDto]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('manual'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manual_enrollment_dto_1.CreateManualEnrollmentDto]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "createManual", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('student_id')),
    __param(3, (0, common_1.Query)('batch_id')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.STUDENT, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "getMyEnrollments", null);
__decorate([
    (0, common_1.Post)('my/progress/:lessonId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.STUDENT),
    __param(0, (0, common_1.Param)('lessonId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "markLessonCompleted", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.STUDENT),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "findAllByStudent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/batch/:batchId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.STUDENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "findByStudentAndBatch", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_enrollment_dto_1.UpdateEnrollmentDto]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnrollmentController.prototype, "remove", null);
exports.EnrollmentController = EnrollmentController = __decorate([
    (0, common_1.Controller)('enrollments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [enrollment_service_1.EnrollmentService])
], EnrollmentController);
//# sourceMappingURL=enrollment.controller.js.map