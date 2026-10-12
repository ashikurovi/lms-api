import { HttpStatus } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
export declare class LessonController {
    private readonly lessonService;
    constructor(lessonService: LessonService);
    create(createLessonDto: CreateLessonDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/lesson.entity").Lesson;
    }>;
    findAll(page?: string, limit?: string, search?: string, moduleId?: string, status?: string, type?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/lesson.entity").Lesson[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/lesson.entity").Lesson;
    }>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/lesson.entity").Lesson & UpdateLessonDto & {
            slug: string;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/lesson.entity").Lesson;
    }>;
}
