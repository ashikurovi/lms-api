import { HttpStatus } from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
export declare class BatchController {
    private readonly batchService;
    constructor(batchService: BatchService);
    create(createBatchDto: CreateBatchDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/batch.entity").Batch;
    }>;
    launch(createBatchDto: CreateBatchDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/batch.entity").Batch;
    }>;
    findAll(page?: string, limit?: string, search?: string, courseId?: string, status?: string, mode?: string, mentorId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/batch.entity").Batch[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/batch.entity").Batch;
    }>;
    update(id: string, updateBatchDto: UpdateBatchDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/batch.entity").Batch & {
            registration_end: Date;
            registration_start: Date;
            end_date: Date;
            start_date: Date;
            course_id?: string;
            name?: string;
            code?: string;
            capacity?: number;
            status?: import("./entities/batch.entity").BatchStatus;
            mode?: import("./entities/batch.entity").BatchMode;
            class_type?: import("./entities/batch.entity").ClassType;
            timezone?: string;
            price?: number;
            discount_price?: number;
            fb_group_link?: string;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/batch.entity").Batch;
    }>;
}
