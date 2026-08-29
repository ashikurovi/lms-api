import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 15, { message: 'Phone number must be between 10 and 15 characters' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  otpCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
