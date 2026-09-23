import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  IsUUID,
  IsBoolean,
  Min,
} from 'class-validator';
import { LessonType, LessonStatus } from '../entities/lesson.entity';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsUUID()
  module_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(LessonType)
  type?: LessonType;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsString()
  pdf_url?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  is_preview?: boolean;

  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;
}
