import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Installment } from '../../installment/entities/installment.entity';
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentGateway {
    SSLCOMMERZ = "SSLCOMMERZ",
    MANUAL = "MANUAL"
}
export declare enum PaymentEnvironment {
    SANDBOX = "SANDBOX",
    LIVE = "LIVE"
}
export declare class Payment {
    id: string;
    enrollment_id: string;
    enrollment: Enrollment;
    installment_id: string;
    installment: Installment;
    amount: number;
    gateway: PaymentGateway;
    environment: PaymentEnvironment;
    transaction_id: string | null;
    status: PaymentStatus;
    paid_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
