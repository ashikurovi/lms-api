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
        registration_end?: string | Date | null | undefined;
        registration_start?: string | Date | null | undefined;
        end_date?: string | Date | undefined;
        start_date?: string | Date | undefined;
        course_id?: string | undefined;
        name?: string | undefined;
        code?: string | undefined;
        capacity?: number | undefined;
        status?: BatchStatus | undefined;
        mode?: import("./entities/batch.entity").BatchMode | undefined;
        class_type?: import("./entities/batch.entity").ClassType | undefined;
        timezone?: string | undefined;
        price?: number | undefined;
        discount_price?: number | undefined;
        fb_group_link?: string | undefined;
    }>;
    remove(id: string): Promise<Batch>;
}
