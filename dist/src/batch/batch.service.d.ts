import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch } from './entities/batch.entity';
export declare class BatchService implements OnModuleInit {
    private batchRepository;
    constructor(batchRepository: Repository<Batch>);
    onModuleInit(): Promise<void>;
    private safelySaveBatch;
    private generateUniqueCode;
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
    update(id: string, updateBatchDto: UpdateBatchDto): Promise<Batch>;
    remove(id: string): Promise<Batch>;
}
