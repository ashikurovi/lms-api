import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Installment } from '../installment/entities/installment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Payment, Installment])],
  controllers: [OverviewController],
  providers: [OverviewService],
})
export class OverviewModule {}
