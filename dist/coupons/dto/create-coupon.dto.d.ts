import { DiscountType } from '../entities/coupon.entity';
export declare class CreateCouponDto {
    code: string;
    courseId?: string;
    discountType: DiscountType;
    discountValue: number;
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
    isActive?: boolean;
}
