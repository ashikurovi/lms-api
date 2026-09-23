import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  student_id: string;

  @IsNotEmpty()
  @IsUUID()
  batch_id: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  total_amount: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  discount_amount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  installment_count?: number;

  @IsOptional()
  @IsArray()
  @IsDateString({}, { each: true })
  installment_due_dates?: string[];
}
