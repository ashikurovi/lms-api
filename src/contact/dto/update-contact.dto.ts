import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;
}
