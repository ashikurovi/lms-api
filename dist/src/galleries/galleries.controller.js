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
exports.GalleriesController = void 0;
const common_1 = require("@nestjs/common");
const galleries_service_1 = require("./galleries.service");
const create_gallery_dto_1 = require("./dto/create-gallery.dto");
const update_gallery_dto_1 = require("./dto/update-gallery.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let GalleriesController = class GalleriesController {
    constructor(galleriesService) {
        this.galleriesService = galleriesService;
    }
    async create(createGalleryDto) {
        const data = await this.galleriesService.create(createGalleryDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Gallery item created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.galleriesService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Gallery items retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.galleriesService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Gallery item retrieved successfully',
            data,
        };
    }
    async update(id, updateGalleryDto) {
        const data = await this.galleriesService.update(id, updateGalleryDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Gallery item updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.galleriesService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Gallery item deleted successfully',
            data,
        };
    }
};
exports.GalleriesController = GalleriesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gallery_dto_1.CreateGalleryDto]),
    __metadata("design:returntype", Promise)
], GalleriesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GalleriesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GalleriesController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_gallery_dto_1.UpdateGalleryDto]),
    __metadata("design:returntype", Promise)
], GalleriesController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GalleriesController.prototype, "remove", null);
exports.GalleriesController = GalleriesController = __decorate([
    (0, common_1.Controller)('galleries'),
    __metadata("design:paramtypes", [galleries_service_1.GalleriesService])
], GalleriesController);
//# sourceMappingURL=galleries.controller.js.map