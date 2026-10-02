import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsUUID,
  IsDateString,
  Min,
  IsNumber,
} from 'class-validator';
import { BatchStatus, BatchMode, ClassType } from '../entities/batch.entity';

export class CreateBatchDto {
  @IsNotEmpty()
  @IsUUID()
  course_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsDateString()
  registration_start?: string;

  @IsOptional()
  @IsDateString()
  registration_end?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;

  @IsOptional()
  @IsEnum(BatchMode)
  mode?: BatchMode;

  @IsOptional()
  @IsEnum(ClassType)
  class_type?: ClassType;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_price?: number;

  @IsOptional()
  @IsString()
  fb_group_link?: string;
}
