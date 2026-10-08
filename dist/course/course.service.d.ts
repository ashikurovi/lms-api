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
        status?: CourseStatus | undefined;
        visibility?: import("./entities/course.entity").CourseVisibility | undefined;
        published_at?: string | undefined;
    } & {
        slug: string;
        published_at: Date | null;
    }>;
    remove(id: string): Promise<Course>;
}
