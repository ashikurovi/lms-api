import { Batch } from '../../batch/entities/batch.entity';
export declare enum DiscountType {
    PERCENTAGE = "percentage",
    FIXED = "fixed"
}
export declare class Coupon {
    id: string;
    code: string;
    batchId: string;
    batch: Batch;
    discountType: DiscountType;
    discountValue: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
