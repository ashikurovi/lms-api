import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorDto } from './create-mentor.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMentorDto extends PartialType(CreateMentorDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
