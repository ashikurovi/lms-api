import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';

export class CreateAssignmentSubmissionDto {
  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;
}
