import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsString()
  @IsOptional()
  mentorId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalMarks?: number;

  @IsDateString()
  @IsOptional()
  dueAt?: string;

  @IsEnum(['draft', 'published', 'closed'])
  @IsOptional()
  status?: 'draft' | 'published' | 'closed';
}
