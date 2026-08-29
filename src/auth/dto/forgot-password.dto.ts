import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 15, { message: 'Phone number must be between 10 and 15 characters' })
  phone: string;
}
