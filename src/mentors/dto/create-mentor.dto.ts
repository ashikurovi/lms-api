import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateMentorDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsString()
    @IsOptional()
    profileImage?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    designation?: string;

    @IsArray()
    @IsOptional()
    expertise?: string[];

    @IsString()
    @IsOptional()
    subject?: string;

    @IsArray()
    @IsOptional()
    skills?: string[];

    @IsString()
    @IsOptional()
    experience?: string;

    @IsString()
    @IsOptional()
    facebook?: string;

    @IsString()
    @IsOptional()
    linkedin?: string;
}
