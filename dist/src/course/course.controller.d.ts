import { HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    create(createCourseDto: CreateCourseDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/course.entity").Course;
    }>;
    findAll(page?: string, limit?: string, search?: string, categoryId?: string, status?: string, level?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/course.entity").Course[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/course.entity").Course;
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/course.entity").Course & {
            title?: string;
            slug?: string;
            category_id?: string;
            course_code?: string;
            short_description?: string;
            description?: string;
            thumbnail?: string;
            intro_video_url?: string;
            level?: import("./entities/course.entity").CourseLevel;
            language?: string;
            duration?: number;
            duration_unit?: import("./entities/course.entity").DurationUnit;
            status?: import("./entities/course.entity").CourseStatus;
            visibility?: import("./entities/course.entity").CourseVisibility;
            published_at?: string;
        } & {
            slug: string;
            published_at: Date;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/course.entity").Course;
    }>;
}
