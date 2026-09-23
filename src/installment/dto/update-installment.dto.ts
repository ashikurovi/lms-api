import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { InstallmentStatus } from '../entities/installment.entity';

export class UpdateInstallmentDto {
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsEnum(InstallmentStatus)
  status?: InstallmentStatus;
}
