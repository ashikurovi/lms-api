import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstallmentService } from './installment.service';
import { InstallmentController } from './installment.controller';
import { Installment } from './entities/installment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Installment, Enrollment])],
  controllers: [InstallmentController],
  providers: [InstallmentService],
  exports: [InstallmentService],
})
export class InstallmentModule {}
