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
            registration_end?: string | Date | null | undefined;
            registration_start?: string | Date | null | undefined;
            end_date?: string | Date | undefined;
            start_date?: string | Date | undefined;
            course_id?: string | undefined;
            name?: string | undefined;
            code?: string | undefined;
            capacity?: number | undefined;
            status?: import("./entities/batch.entity").BatchStatus | undefined;
            mode?: import("./entities/batch.entity").BatchMode | undefined;
            class_type?: import("./entities/batch.entity").ClassType | undefined;
            timezone?: string | undefined;
            price?: number | undefined;
            discount_price?: number | undefined;
            fb_group_link?: string | undefined;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/batch.entity").Batch;
    }>;
}
