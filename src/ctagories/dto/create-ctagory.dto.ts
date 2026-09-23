import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCourseCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
