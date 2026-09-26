import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateAssignmentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;
}
