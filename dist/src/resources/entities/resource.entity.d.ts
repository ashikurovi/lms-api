import { Batch } from '../../batch/entities/batch.entity';
import { User } from '../../users/entities/user.entity';
export declare class Resource {
    id: string;
    batchId: string;
    batch: Batch;
    mentorId?: string;
    mentor?: User;
    title: string;
    url?: string;
    pdf?: string;
    link?: string;
    image?: string;
    sizeMb?: number;
    createdAt: Date;
    updatedAt: Date;
}
