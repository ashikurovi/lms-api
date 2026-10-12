import { Repository } from 'typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch, BatchStatus } from './entities/batch.entity';
export declare class BatchService {
    private batchRepository;
    constructor(batchRepository: Repository<Batch>);
    create(createBatchDto: CreateBatchDto): Promise<Batch>;
    launch(createBatchDto: CreateBatchDto): Promise<Batch>;
    findAll(pageStr?: string, limitStr?: string, search?: string, courseId?: string, status?: string, mode?: string, mentorId?: string): Promise<{
        items: Batch[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(idOrCodeOrSlug: string): Promise<Batch>;
    update(id: string, updateBatchDto: UpdateBatchDto): Promise<Batch & {
        registration_end: Date;
        registration_start: Date;
        end_date: Date;
        start_date: Date;
        course_id?: string;
        name?: string;
        code?: string;
        capacity?: number;
        status?: BatchStatus;
        mode?: import("./entities/batch.entity").BatchMode;
        class_type?: import("./entities/batch.entity").ClassType;
        timezone?: string;
        price?: number;
        discount_price?: number;
        fb_group_link?: string;
    }>;
    remove(id: string): Promise<Batch>;
}
