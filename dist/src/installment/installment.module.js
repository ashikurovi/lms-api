"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const installment_service_1 = require("./installment.service");
const installment_controller_1 = require("./installment.controller");
const installment_entity_1 = require("./entities/installment.entity");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
let InstallmentModule = class InstallmentModule {
};
exports.InstallmentModule = InstallmentModule;
exports.InstallmentModule = InstallmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([installment_entity_1.Installment, enrollment_entity_1.Enrollment])],
        controllers: [installment_controller_1.InstallmentController],
        providers: [installment_service_1.InstallmentService],
        exports: [installment_service_1.InstallmentService],
    })
], InstallmentModule);
//# sourceMappingURL=installment.module.js.map