import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare enum InstallmentStatus {
    PENDING = "PENDING",
    DUE = "DUE",
    PARTIAL = "PARTIAL",
    PAID = "PAID",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED"
}
export declare class Installment {
    id: string;
    enrollment_id: string;
    enrollment: Enrollment;
    installment_number: number;
    amount: number;
    paid_amount: number;
    due_amount: number;
    due_date: Date;
    status: InstallmentStatus;
    payments: Payment[];
    created_at: Date;
    updated_at: Date;
}
