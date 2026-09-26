import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate } from './entities/certificate.entity';
import { Student } from '../students/entities/student.entity';
import { Batch } from '../batch/entities/batch.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Student, Batch, Course, Enrollment])],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
