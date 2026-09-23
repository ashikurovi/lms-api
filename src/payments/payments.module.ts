import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SslcommerzService } from './sslcommerz.service';
import { Payment } from './entities/payment.entity';
import { Installment } from '../installment/entities/installment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Installment, Enrollment]),
    HttpModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, SslcommerzService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
