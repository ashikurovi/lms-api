"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleriesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const galleries_service_1 = require("./galleries.service");
const galleries_controller_1 = require("./galleries.controller");
const gallery_entity_1 = require("./entities/gallery.entity");
let GalleriesModule = class GalleriesModule {
};
exports.GalleriesModule = GalleriesModule;
exports.GalleriesModule = GalleriesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([gallery_entity_1.Gallery])],
        controllers: [galleries_controller_1.GalleriesController],
        providers: [galleries_service_1.GalleriesService],
    })
], GalleriesModule);
//# sourceMappingURL=galleries.module.js.map