import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ReviewSubmissionDto {
  @IsNumber()
  @Min(0)
  marks: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
