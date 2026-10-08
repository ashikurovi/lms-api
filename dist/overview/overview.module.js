"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const overview_service_1 = require("./overview.service");
const overview_controller_1 = require("./overview.controller");
const enrollment_entity_1 = require("../enrollment/entities/enrollment.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const installment_entity_1 = require("../installment/entities/installment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const course_entity_1 = require("../course/entities/course.entity");
const lesson_entity_1 = require("../lesson/entities/lesson.entity");
const live_schedule_entity_1 = require("../live_schedules/entities/live_schedule.entity");
let OverviewModule = class OverviewModule {
};
exports.OverviewModule = OverviewModule;
exports.OverviewModule = OverviewModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                enrollment_entity_1.Enrollment, payment_entity_1.Payment, installment_entity_1.Installment,
                user_entity_1.User, course_entity_1.Course, lesson_entity_1.Lesson, live_schedule_entity_1.LiveSchedule
            ])],
        controllers: [overview_controller_1.OverviewController],
        providers: [overview_service_1.OverviewService],
    })
], OverviewModule);
//# sourceMappingURL=overview.module.js.map