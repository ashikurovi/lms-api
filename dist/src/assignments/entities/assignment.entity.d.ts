import { Batch } from '../../batch/entities/batch.entity';
import { Mentor } from '../../mentors/entities/mentor.entity';
export declare class Assignment {
    id: string;
    batchId: string;
    batch: Batch;
    mentorId: string;
    mentor: Mentor;
    title: string;
    description: string;
    attachmentUrl?: string;
    totalMarks: number;
    dueAt?: Date;
    status: 'draft' | 'published' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}
