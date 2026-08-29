import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @IsOptional()
  @IsString()
  device?: string;
}
