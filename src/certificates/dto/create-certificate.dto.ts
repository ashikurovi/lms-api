import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCertificateDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  batchId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;



  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsString()
  @IsOptional()
  certificateUrl?: string;

  @IsString()
  @IsOptional()
  signature1Url?: string;

  @IsString()
  @IsOptional()
  signature2Url?: string;

  @IsString()
  @IsOptional()
  signature1Name?: string;

  @IsString()
  @IsOptional()
  signature1Designation?: string;

  @IsString()
  @IsOptional()
  signature2Name?: string;

  @IsString()
  @IsOptional()
  signature2Designation?: string;

  @IsEnum(['issued', 'revoked'])
  @IsOptional()
  status?: 'issued' | 'revoked';
}

export class BulkCreateCertificateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCertificateDto)
  certificates: CreateCertificateDto[];
}
