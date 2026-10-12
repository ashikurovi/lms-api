import { Course } from '../../course/entities/course.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';
export declare enum ModuleStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class CourseModule {
    id: string;
    course_id: string;
    course: Course;
    lessons: Lesson[];
    title: string;
    description: string;
    thumbnail: string;
    order: number;
    status: ModuleStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
