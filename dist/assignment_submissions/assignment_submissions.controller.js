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
exports.AssignmentSubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const assignment_submissions_service_1 = require("./assignment_submissions.service");
const create_assignment_submission_dto_1 = require("./dto/create-assignment_submission.dto");
const update_assignment_submission_dto_1 = require("./dto/update-assignment_submission.dto");
const review_submission_dto_1 = require("./dto/review-submission.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let AssignmentSubmissionsController = class AssignmentSubmissionsController {
    submissionsService;
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    async create(createSubmissionDto, req) {
        const data = await this.submissionsService.create(createSubmissionDto, req.user?.id);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Assignment submitted successfully',
            data,
        };
    }
    async findAll(page, limit, assignmentId, studentId, status, req) {
        const data = await this.submissionsService.findAll(page, limit, assignmentId, studentId, status, req?.user);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Assignment submissions retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.submissionsService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Assignment submission retrieved successfully',
            data,
        };
    }
    async update(id, updateSubmissionDto, req) {
        const reviewerId = req.user?.id;
        const data = await this.submissionsService.update(id, updateSubmissionDto, reviewerId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Assignment submission updated successfully',
            data,
        };
    }
    async reviewSubmission(id, reviewDto, req) {
        const reviewerId = req.user?.id;
        const data = await this.submissionsService.update(id, {
            ...reviewDto,
            status: 'reviewed',
        }, reviewerId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Assignment successfully reviewed',
            data,
        };
    }
    async remove(id) {
        const data = await this.submissionsService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Assignment submission deleted successfully',
            data,
        };
    }
};
exports.AssignmentSubmissionsController = AssignmentSubmissionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assignment_submission_dto_1.CreateAssignmentSubmissionDto, Object]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('assignmentId')),
    __param(3, (0, common_1.Query)('studentId')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_assignment_submission_dto_1.UpdateAssignmentSubmissionDto, Object]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/review'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.MENTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_submission_dto_1.ReviewSubmissionDto, Object]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "reviewSubmission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssignmentSubmissionsController.prototype, "remove", null);
exports.AssignmentSubmissionsController = AssignmentSubmissionsController = __decorate([
    (0, common_1.Controller)('assignment-submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [assignment_submissions_service_1.AssignmentSubmissionsService])
], AssignmentSubmissionsController);
//# sourceMappingURL=assignment_submissions.controller.js.map