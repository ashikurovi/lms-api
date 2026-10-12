import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseStatus } from './entities/course.entity';
import { Mentor } from '../mentors/entities/mentor.entity';
export declare class CourseService {
    private courseRepository;
    private mentorRepository;
    constructor(courseRepository: Repository<Course>, mentorRepository: Repository<Mentor>);
    create(createCourseDto: CreateCourseDto): Promise<Course>;
    findAll(pageStr?: string, limitStr?: string, search?: string, categoryId?: string, status?: string, level?: string): Promise<{
        items: Course[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(identifier: string): Promise<Course>;
    update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course & {
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
        status?: CourseStatus;
        visibility?: import("./entities/course.entity").CourseVisibility;
        published_at?: string;
    } & {
        slug: string;
        published_at: Date;
    }>;
    remove(id: string): Promise<Course>;
}
