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
exports.LiveSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const live_schedules_service_1 = require("./live_schedules.service");
const create_live_schedule_dto_1 = require("./dto/create-live_schedule.dto");
const update_live_schedule_dto_1 = require("./dto/update-live_schedule.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let LiveSchedulesController = class LiveSchedulesController {
    liveSchedulesService;
    constructor(liveSchedulesService) {
        this.liveSchedulesService = liveSchedulesService;
    }
    async create(createLiveScheduleDto, req) {
        if (!createLiveScheduleDto.createdBy && req.user?.id) {
            createLiveScheduleDto.createdBy = req.user.id;
        }
        if (req.user?.role === user_entity_1.UserRole.MENTOR) {
            createLiveScheduleDto.mentorId = req.user.id;
        }
        const data = await this.liveSchedulesService.create(createLiveScheduleDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Live schedule created successfully',
            data,
        };
    }
    async findAll(page, limit, search, batchId, mentorId, status) {
        const data = await this.liveSchedulesService.findAll(page, limit, search, batchId, mentorId, status);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Live schedules retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.liveSchedulesService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Live schedule retrieved successfully',
            data,
        };
    }
    async update(id, updateLiveScheduleDto) {
        const data = await this.liveSchedulesService.update(id, updateLiveScheduleDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Live schedule updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.liveSchedulesService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Live schedule deleted successfully',
            data,
        };
    }
};
exports.LiveSchedulesController = LiveSchedulesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.MENTOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_live_schedule_dto_1.CreateLiveScheduleDto, Object]),
    __metadata("design:returntype", Promise)
], LiveSchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('batchId')),
    __param(4, (0, common_1.Query)('mentorId')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LiveSchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveSchedulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.MENTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_live_schedule_dto_1.UpdateLiveScheduleDto]),
    __metadata("design:returntype", Promise)
], LiveSchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER, user_entity_1.UserRole.MENTOR),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LiveSchedulesController.prototype, "remove", null);
exports.LiveSchedulesController = LiveSchedulesController = __decorate([
    (0, common_1.Controller)('live-schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [live_schedules_service_1.LiveSchedulesService])
], LiveSchedulesController);
//# sourceMappingURL=live_schedules.controller.js.map