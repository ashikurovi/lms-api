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
exports.BatchController = void 0;
const common_1 = require("@nestjs/common");
const batch_service_1 = require("./batch.service");
const create_batch_dto_1 = require("./dto/create-batch.dto");
const update_batch_dto_1 = require("./dto/update-batch.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let BatchController = class BatchController {
    batchService;
    constructor(batchService) {
        this.batchService = batchService;
    }
    async create(createBatchDto) {
        const data = await this.batchService.create(createBatchDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Batch created successfully',
            data,
        };
    }
    async launch(createBatchDto) {
        const data = await this.batchService.launch(createBatchDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Batch launched successfully and previous batches turned off',
            data,
        };
    }
    async findAll(page, limit, search, courseId, status, mode, mentorId) {
        const data = await this.batchService.findAll(page, limit, search, courseId, status, mode, mentorId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Batches retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.batchService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Batch retrieved successfully',
            data,
        };
    }
    async update(id, updateBatchDto) {
        const data = await this.batchService.update(id, updateBatchDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Batch updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.batchService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Batch deleted successfully',
            data,
        };
    }
};
exports.BatchController = BatchController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_batch_dto_1.CreateBatchDto]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('launch'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_batch_dto_1.CreateBatchDto]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "launch", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('course_id')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('mode')),
    __param(6, (0, common_1.Query)('mentor_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_batch_dto_1.UpdateBatchDto]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BatchController.prototype, "remove", null);
exports.BatchController = BatchController = __decorate([
    (0, common_1.Controller)('batches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [batch_service_1.BatchService])
], BatchController);
//# sourceMappingURL=batch.controller.js.map