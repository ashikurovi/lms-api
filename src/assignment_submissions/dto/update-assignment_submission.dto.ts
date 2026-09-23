import { IsOptional, IsEnum, IsNumber, Min, IsString } from 'class-validator';

export class UpdateAssignmentSubmissionDto {
  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsEnum(['submitted', 'reviewed', 'resubmitted'])
  @IsOptional()
  status?: 'submitted' | 'reviewed' | 'resubmitted';

  @IsNumber()
  @Min(0)
  @IsOptional()
  marks?: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
