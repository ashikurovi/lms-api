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
exports.CtagoriesController = void 0;
const common_1 = require("@nestjs/common");
const ctagories_service_1 = require("./ctagories.service");
const create_ctagory_dto_1 = require("./dto/create-ctagory.dto");
const update_ctagory_dto_1 = require("./dto/update-ctagory.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let CtagoriesController = class CtagoriesController {
    ctagoriesService;
    constructor(ctagoriesService) {
        this.ctagoriesService = ctagoriesService;
    }
    async create(createCourseCategoryDto) {
        const data = await this.ctagoriesService.create(createCourseCategoryDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Course category created successfully',
            data,
        };
    }
    async findAll(page, limit, search, parentId) {
        const data = await this.ctagoriesService.findAll(page, limit, search, parentId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Course categories retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.ctagoriesService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Course category retrieved successfully',
            data,
        };
    }
    async update(id, updateCourseCategoryDto) {
        const data = await this.ctagoriesService.update(id, updateCourseCategoryDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Course category updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.ctagoriesService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Course category deleted successfully',
            data,
        };
    }
};
exports.CtagoriesController = CtagoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ctagory_dto_1.CreateCourseCategoryDto]),
    __metadata("design:returntype", Promise)
], CtagoriesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('parent_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CtagoriesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CtagoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ctagory_dto_1.UpdateCourseCategoryDto]),
    __metadata("design:returntype", Promise)
], CtagoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CtagoriesController.prototype, "remove", null);
exports.CtagoriesController = CtagoriesController = __decorate([
    (0, common_1.Controller)('course-categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ctagories_service_1.CtagoriesService])
], CtagoriesController);
//# sourceMappingURL=ctagories.controller.js.map