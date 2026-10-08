import { CourseLevel, DurationUnit, CourseStatus, CourseVisibility } from '../entities/course.entity';
export declare class CreateCourseDto {
    title: string;
    slug?: string;
    category_id?: string;
    course_code?: string;
    short_description?: string;
    description?: string;
    thumbnail?: string;
    intro_video_url?: string;
    level?: CourseLevel;
    language?: string;
    duration?: number;
    duration_unit?: DurationUnit;
    status?: CourseStatus;
    visibility?: CourseVisibility;
    published_at?: string;
    mentor_ids?: string[];
}
