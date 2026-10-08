import { Student } from '../../students/entities/student.entity';
import { Batch } from '../../batch/entities/batch.entity';
import { Installment } from '../../installment/entities/installment.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { LessonProgress } from '../../lesson/entities/lesson-progress.entity';
export declare enum EnrollmentStatus {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    SUSPENDED = "SUSPENDED"
}
export declare class Enrollment {
    id: string;
    student_id: string;
    student: Student;
    batch_id: string;
    batch: Batch;
    total_amount: number;
    discount_amount: number;
    payable_amount: number;
    paid_amount: number;
    due_amount: number;
    status: EnrollmentStatus;
    enrolled_at: Date;
    installments: Installment[];
    payments: Payment[];
    lesson_progress: LessonProgress[];
    created_at: Date;
    updated_at: Date;
}
