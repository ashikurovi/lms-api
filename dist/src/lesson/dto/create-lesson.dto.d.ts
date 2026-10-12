import { LessonType, LessonStatus } from '../entities/lesson.entity';
export declare class CreateLessonDto {
    module_id: string;
    title: string;
    slug?: string;
    description?: string;
    type?: LessonType;
    video_url?: string;
    pdf_url?: string;
    image_url?: string;
    content?: string;
    duration?: number;
    order?: number;
    is_preview?: boolean;
    status?: LessonStatus;
}
