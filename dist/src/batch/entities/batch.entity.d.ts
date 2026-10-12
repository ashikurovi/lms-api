import { Course } from '../../course/entities/course.entity';
export declare enum BatchStatus {
    UPCOMING = "upcoming",
    OPEN = "open",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum BatchMode {
    ONLINE = "online",
    OFFLINE = "offline",
    HYBRID = "hybrid"
}
export declare enum ClassType {
    LIVE = "live",
    RECORDED = "recorded",
    SELF_PACED = "self_paced"
}
export declare class Batch {
    id: string;
    course_id: string;
    course: Course;
    name: string;
    code: string;
    start_date: Date;
    end_date: Date;
    registration_start: Date;
    registration_end: Date;
    capacity: number;
    enrolled_count: number;
    status: BatchStatus;
    mode: BatchMode;
    class_type: ClassType;
    timezone: string;
    price: number;
    discount_price: number;
    fb_group_link: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
