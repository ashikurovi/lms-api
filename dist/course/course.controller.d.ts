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
            title?: string | undefined;
            slug?: string | undefined;
            category_id?: string | undefined;
            course_code?: string | undefined;
            short_description?: string | undefined;
            description?: string | undefined;
            thumbnail?: string | undefined;
            intro_video_url?: string | undefined;
            level?: import("./entities/course.entity").CourseLevel | undefined;
            language?: string | undefined;
            duration?: number | undefined;
            duration_unit?: import("./entities/course.entity").DurationUnit | undefined;
            status?: import("./entities/course.entity").CourseStatus | undefined;
            visibility?: import("./entities/course.entity").CourseVisibility | undefined;
            published_at?: string | undefined;
        } & {
            slug: string;
            published_at: Date | null;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/course.entity").Course;
    }>;
}
