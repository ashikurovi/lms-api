import { CourseCategory } from '../../ctagories/entities/ctagory.entity';
import { Mentor } from '../../mentors/entities/mentor.entity';
import { CourseModule } from '../../module/entities/module.entity';
import { Batch } from '../../batch/entities/batch.entity';
export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare enum DurationUnit {
    HOURS = "hours",
    DAYS = "days",
    WEEKS = "weeks",
    MONTHS = "months"
}
export declare enum CourseStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare enum CourseVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    UNLISTED = "unlisted"
}
export declare class Course {
    id: string;
    category_id: string;
    category: CourseCategory;
    title: string;
    slug: string;
    course_code: string;
    short_description: string;
    description: string;
    thumbnail: string;
    intro_video_url: string;
    level: CourseLevel;
    language: string;
    duration: number;
    duration_unit: DurationUnit;
    status: CourseStatus;
    visibility: CourseVisibility;
    mentors: Mentor[];
    modules: CourseModule[];
    batches: Batch[];
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
