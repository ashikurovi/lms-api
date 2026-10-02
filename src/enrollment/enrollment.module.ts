import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Installment } from '../installment/entities/installment.entity';
import { LessonProgress } from '../lesson/entities/lesson-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Installment, LessonProgress])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
