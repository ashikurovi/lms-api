import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsInt,
  IsBoolean,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsOptional()
  userId?: string;

  // Personal Information
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  // Academic Information
  @IsString()
  @IsOptional()
  institute?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  technology?: string;

  @IsInt()
  @IsOptional()
  semester?: number;

  @IsString()
  @IsOptional()
  shift?: string;

  @IsString()
  @IsOptional()
  session?: string;

  @IsString()
  @IsOptional()
  roll?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  // Address
  @IsString()
  @IsOptional()
  presentAddress?: string;

  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  division?: string;

  // Skills & Career
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interestedField?: string[];

  @IsUrl()
  @IsOptional()
  github?: string;

  @IsUrl()
  @IsOptional()
  linkedin?: string;

  @IsUrl()
  @IsOptional()
  portfolio?: string;

  // Polytechnic Related
  @IsBoolean()
  @IsOptional()
  industrialAttachment?: boolean;

  @IsString()
  @IsOptional()
  attachmentCompany?: string;

  @IsString()
  @IsOptional()
  attachmentStatus?: string;

  // Account
  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
