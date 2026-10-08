import { Student } from '../../students/entities/student.entity';
import { Batch } from '../../batch/entities/batch.entity';
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    student: Student;
    batch: Batch;
    createdAt: Date;
    updatedAt: Date;
}
