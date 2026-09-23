import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateLiveScheduleDto {
  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsString()
  @IsOptional()
  mentorId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsEnum(['google_meet', 'zoom'])
  @IsNotEmpty()
  platform: 'google_meet' | 'zoom';

  @IsString()
  @IsNotEmpty()
  meetingUrl: string;

  @IsString()
  @IsOptional()
  meetingId?: string;

  @IsString()
  @IsOptional()
  meetingPassword?: string;

  @IsEnum(['scheduled', 'live', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';

  @IsString()
  @IsOptional()
  createdBy?: string;
}
