import { BatchStatus, BatchMode, ClassType } from '../entities/batch.entity';
export declare class CreateBatchDto {
    course_id: string;
    name: string;
    code: string;
    start_date: string;
    end_date: string;
    registration_start?: string;
    registration_end?: string;
    capacity?: number;
    status?: BatchStatus;
    mode?: BatchMode;
    class_type?: ClassType;
    timezone?: string;
    price?: number;
    discount_price?: number;
    fb_group_link?: string;
}
