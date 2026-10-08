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
exports.MentorsController = void 0;
const common_1 = require("@nestjs/common");
const mentors_service_1 = require("./mentors.service");
const create_mentor_dto_1 = require("./dto/create-mentor.dto");
const update_mentor_dto_1 = require("./dto/update-mentor.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let MentorsController = class MentorsController {
    mentorsService;
    constructor(mentorsService) {
        this.mentorsService = mentorsService;
    }
    async create(createMentorDto) {
        const data = await this.mentorsService.create(createMentorDto);
        return { statusCode: common_1.HttpStatus.CREATED, message: 'Mentor created successfully', data };
    }
    async findAll(page, limit, search) {
        const data = await this.mentorsService.findAll(page, limit, search);
        return { statusCode: common_1.HttpStatus.OK, message: 'Mentors retrieved successfully', data };
    }
    async findOne(id) {
        const data = await this.mentorsService.findOne(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Mentor retrieved successfully', data };
    }
    async update(id, updateMentorDto) {
        const data = await this.mentorsService.update(id, updateMentorDto);
        return { statusCode: common_1.HttpStatus.OK, message: 'Mentor updated successfully', data };
    }
    async ban(id) {
        const data = await this.mentorsService.ban(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Mentor banned successfully', data };
    }
    async unban(id) {
        const data = await this.mentorsService.unban(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Mentor unbanned successfully', data };
    }
    async remove(id) {
        const data = await this.mentorsService.remove(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Mentor deleted successfully', data };
    }
};
exports.MentorsController = MentorsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mentor_dto_1.CreateMentorDto]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_mentor_dto_1.UpdateMentorDto]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/ban'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "ban", null);
__decorate([
    (0, common_1.Patch)(':id/unban'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "unban", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MentorsController.prototype, "remove", null);
exports.MentorsController = MentorsController = __decorate([
    (0, common_1.Controller)('mentors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [mentors_service_1.MentorsService])
], MentorsController);
//# sourceMappingURL=mentors.controller.js.map