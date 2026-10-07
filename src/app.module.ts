import { NoticesModule } from "./notices/notices.module";
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { MentorsModule } from './mentors/mentors.module';
import { StudentsModule } from './students/students.module';
import { CtagoriesModule } from './ctagories/ctagories.module';
import { CourseModule } from './course/course.module';
import { BatchModule } from './batch/batch.module';
import { ModuleModule } from './module/module.module';
import { LessonModule } from './lesson/lesson.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { InstallmentModule } from './installment/installment.module';
import { PaymentsModule } from './payments/payments.module';
import { LiveSchedulesModule } from './live_schedules/live_schedules.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AssignmentSubmissionsModule } from './assignment_submissions/assignment_submissions.module';
import { ResourcesModule } from './resources/resources.module';

import { CertificatesModule } from './certificates/certificates.module';
import { CouponsModule } from './coupons/coupons.module';
import { OverviewModule } from './overview/overview.module';
import { BlogsModule } from './blogs/blogs.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { GalleriesModule } from './galleries/galleries.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    NoticesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [
    NoticesModule,ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    UploadsModule,
    MentorsModule,
    StudentsModule,
    CtagoriesModule,
    CourseModule,
    BatchModule,
    ModuleModule,
    LessonModule,
    EnrollmentModule,
    InstallmentModule,
    PaymentsModule,
    LiveSchedulesModule,
    AssignmentsModule,
    AssignmentSubmissionsModule,
    CouponsModule,
    ResourcesModule,
    CertificatesModule,
    OverviewModule,
    BlogsModule,
    PortfoliosModule,
    GalleriesModule,
    ReviewsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
