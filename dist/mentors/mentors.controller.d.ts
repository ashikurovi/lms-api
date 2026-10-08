import { HttpStatus } from '@nestjs/common';
import { MentorsService } from './mentors.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
export declare class MentorsController {
    private readonly mentorsService;
    constructor(mentorsService: MentorsService);
    create(createMentorDto: CreateMentorDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/mentor.entity").Mentor;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/mentor.entity").Mentor[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/mentor.entity").Mentor;
    }>;
    update(id: string, updateMentorDto: UpdateMentorDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/mentor.entity").Mentor & UpdateMentorDto;
    }>;
    ban(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/mentor.entity").Mentor;
    }>;
    unban(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/mentor.entity").Mentor;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/mentor.entity").Mentor;
    }>;
}
