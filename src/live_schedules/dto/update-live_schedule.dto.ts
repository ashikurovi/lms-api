import { PartialType } from '@nestjs/mapped-types';
import { CreateLiveScheduleDto } from './create-live_schedule.dto';

export class UpdateLiveScheduleDto extends PartialType(CreateLiveScheduleDto) {}
