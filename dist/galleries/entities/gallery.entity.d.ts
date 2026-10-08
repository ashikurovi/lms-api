import { Batch } from '../../batch/entities/batch.entity';
export declare class Gallery {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    batch: Batch;
    createdAt: Date;
    updatedAt: Date;
}
