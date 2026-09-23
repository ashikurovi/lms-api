import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  installment_id: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Type(() => Number)
  amount: number;
}
