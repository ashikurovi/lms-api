import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Installment } from '../installment/entities/installment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../course/entities/course.entity';
import { Lesson } from '../lesson/entities/lesson.entity';
import { LiveSchedule } from '../live_schedules/entities/live_schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Enrollment, Payment, Installment, 
    User, Course, Lesson, LiveSchedule
  ])],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
