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
exports.NoticesController = void 0;
const common_1 = require("@nestjs/common");
const notices_service_1 = require("./notices.service");
const create_notice_dto_1 = require("./dto/create-notice.dto");
const update_notice_dto_1 = require("./dto/update-notice.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let NoticesController = class NoticesController {
    constructor(noticesService) {
        this.noticesService = noticesService;
    }
    async create(createNoticeDto) {
        const data = await this.noticesService.create(createNoticeDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Notice created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.noticesService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notices retrieved successfully',
            data,
        };
    }
    async findActive() {
        const data = await this.noticesService.findActive();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Active notice retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.noticesService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notice retrieved successfully',
            data,
        };
    }
    async update(id, updateNoticeDto) {
        const data = await this.noticesService.update(id, updateNoticeDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notice updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.noticesService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notice deleted successfully',
            data,
        };
    }
};
exports.NoticesController = NoticesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notice_dto_1.CreateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "findActive", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_notice_dto_1.UpdateNoticeDto]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NoticesController.prototype, "remove", null);
exports.NoticesController = NoticesController = __decorate([
    (0, common_1.Controller)('notices'),
    __metadata("design:paramtypes", [notices_service_1.NoticesService])
], NoticesController);
//# sourceMappingURL=notices.controller.js.map