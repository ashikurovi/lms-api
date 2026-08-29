import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
}
