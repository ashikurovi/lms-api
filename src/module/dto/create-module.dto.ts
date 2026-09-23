import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';
import { ModuleStatus } from '../entities/module.entity';

export class CreateModuleDto {
  @IsNotEmpty()
  @IsUUID()
  course_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;
}
