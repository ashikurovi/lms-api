import { CourseModule } from '../../module/entities/module.entity';
export declare enum LessonType {
    VIDEO = "video",
    TEXT = "text",
    PDF = "pdf",
    IMAGE = "image",
    QUIZ = "quiz",
    ASSIGNMENT = "assignment"
}
export declare enum LessonStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Lesson {
    id: string;
    module_id: string;
    module: CourseModule;
    title: string;
    slug: string;
    description: string;
    type: LessonType;
    video_url: string;
    pdf_url: string;
    image_url: string;
    content: string;
    duration: number;
    order: number;
    is_preview: boolean;
    status: LessonStatus;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
