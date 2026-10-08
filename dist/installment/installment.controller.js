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
exports.InstallmentController = void 0;
const common_1 = require("@nestjs/common");
const installment_service_1 = require("./installment.service");
const create_installment_dto_1 = require("./dto/create-installment.dto");
const update_installment_dto_1 = require("./dto/update-installment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let InstallmentController = class InstallmentController {
    installmentService;
    constructor(installmentService) {
        this.installmentService = installmentService;
    }
    async create(createInstallmentDto) {
        const data = await this.installmentService.create(createInstallmentDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Installment created successfully',
            data,
        };
    }
    async findAll(page, limit, enrollmentId, status) {
        const data = await this.installmentService.findAll(page, limit, enrollmentId, status);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Installments retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.installmentService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Installment retrieved successfully',
            data,
        };
    }
    async update(id, updateInstallmentDto) {
        const data = await this.installmentService.update(id, updateInstallmentDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Installment updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.installmentService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Installment cancelled successfully',
            data,
        };
    }
};
exports.InstallmentController = InstallmentController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_installment_dto_1.CreateInstallmentDto]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.STUDENT),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('enrollment_id')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_installment_dto_1.UpdateInstallmentDto]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstallmentController.prototype, "remove", null);
exports.InstallmentController = InstallmentController = __decorate([
    (0, common_1.Controller)('installments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [installment_service_1.InstallmentService])
], InstallmentController);
//# sourceMappingURL=installment.controller.js.map