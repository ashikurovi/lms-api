"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const notices_module_1 = require("./notices/notices.module");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const uploads_module_1 = require("./uploads/uploads.module");
const mentors_module_1 = require("./mentors/mentors.module");
const students_module_1 = require("./students/students.module");
const ctagories_module_1 = require("./ctagories/ctagories.module");
const course_module_1 = require("./course/course.module");
const batch_module_1 = require("./batch/batch.module");
const module_module_1 = require("./module/module.module");
const lesson_module_1 = require("./lesson/lesson.module");
const enrollment_module_1 = require("./enrollment/enrollment.module");
const installment_module_1 = require("./installment/installment.module");
const payments_module_1 = require("./payments/payments.module");
const live_schedules_module_1 = require("./live_schedules/live_schedules.module");
const assignments_module_1 = require("./assignments/assignments.module");
const assignment_submissions_module_1 = require("./assignment_submissions/assignment_submissions.module");
const resources_module_1 = require("./resources/resources.module");
const certificates_module_1 = require("./certificates/certificates.module");
const coupons_module_1 = require("./coupons/coupons.module");
const overview_module_1 = require("./overview/overview.module");
const blogs_module_1 = require("./blogs/blogs.module");
const portfolios_module_1 = require("./portfolios/portfolios.module");
const galleries_module_1 = require("./galleries/galleries.module");
const reviews_module_1 = require("./reviews/reviews.module");
const contact_module_1 = require("./contact/contact.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            notices_module_1.NoticesModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [
                    notices_module_1.NoticesModule, config_1.ConfigModule
                ],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    synchronize: true,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            uploads_module_1.UploadsModule,
            mentors_module_1.MentorsModule,
            students_module_1.StudentsModule,
            ctagories_module_1.CtagoriesModule,
            course_module_1.CourseModule,
            batch_module_1.BatchModule,
            module_module_1.ModuleModule,
            lesson_module_1.LessonModule,
            enrollment_module_1.EnrollmentModule,
            installment_module_1.InstallmentModule,
            payments_module_1.PaymentsModule,
            live_schedules_module_1.LiveSchedulesModule,
            assignments_module_1.AssignmentsModule,
            assignment_submissions_module_1.AssignmentSubmissionsModule,
            coupons_module_1.CouponsModule,
            resources_module_1.ResourcesModule,
            certificates_module_1.CertificatesModule,
            overview_module_1.OverviewModule,
            blogs_module_1.BlogsModule,
            portfolios_module_1.PortfoliosModule,
            galleries_module_1.GalleriesModule,
            reviews_module_1.ReviewsModule,
            contact_module_1.ContactModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map