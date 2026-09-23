import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType: DiscountType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  discountValue: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  usageLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
