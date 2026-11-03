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
exports.WalkthroughsController = void 0;
const common_1 = require("@nestjs/common");
const walkthroughs_service_1 = require("./walkthroughs.service");
const create_walkthrough_dto_1 = require("./dto/create-walkthrough.dto");
const update_walkthrough_dto_1 = require("./dto/update-walkthrough.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let WalkthroughsController = class WalkthroughsController {
    constructor(walkthroughsService) {
        this.walkthroughsService = walkthroughsService;
    }
    async create(createWalkthroughDto) {
        const data = await this.walkthroughsService.create(createWalkthroughDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Walkthrough created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.walkthroughsService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Walkthroughs retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.walkthroughsService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Walkthrough retrieved successfully',
            data,
        };
    }
    async update(id, updateWalkthroughDto) {
        const data = await this.walkthroughsService.update(id, updateWalkthroughDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Walkthrough updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.walkthroughsService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Walkthrough deleted successfully',
            data,
        };
    }
};
exports.WalkthroughsController = WalkthroughsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_walkthrough_dto_1.CreateWalkthroughDto]),
    __metadata("design:returntype", Promise)
], WalkthroughsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WalkthroughsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalkthroughsController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_walkthrough_dto_1.UpdateWalkthroughDto]),
    __metadata("design:returntype", Promise)
], WalkthroughsController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WalkthroughsController.prototype, "remove", null);
exports.WalkthroughsController = WalkthroughsController = __decorate([
    (0, common_1.Controller)('walkthroughs'),
    __metadata("design:paramtypes", [walkthroughs_service_1.WalkthroughsService])
], WalkthroughsController);
//# sourceMappingURL=walkthroughs.controller.js.map