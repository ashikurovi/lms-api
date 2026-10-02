import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUUID,
  IsDateString,
  IsArray,
  Min,
} from 'class-validator';
import {
  CourseLevel,
  DurationUnit,
  CourseStatus,
  CourseVisibility,
} from '../entities/course.entity';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  course_code?: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  intro_video_url?: string;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsEnum(DurationUnit)
  duration_unit?: DurationUnit;


  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsEnum(CourseVisibility)
  visibility?: CourseVisibility;

  @IsOptional()
  @IsDateString()
  published_at?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mentor_ids?: string[];
}
