import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveSchedulesService } from './live_schedules.service';
import { LiveSchedulesController } from './live_schedules.controller';
import { LiveSchedule } from './entities/live_schedule.entity';
import { BatchModule } from '../batch/batch.module';

@Module({
  imports: [TypeOrmModule.forFeature([LiveSchedule]), BatchModule],
  controllers: [LiveSchedulesController],
  providers: [LiveSchedulesService],
  exports: [LiveSchedulesService],
})
export class LiveSchedulesModule {}
