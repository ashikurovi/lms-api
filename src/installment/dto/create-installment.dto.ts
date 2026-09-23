import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInstallmentDto {
  @IsNotEmpty()
  @IsUUID()
  enrollment_id: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  due_date: string;
}
