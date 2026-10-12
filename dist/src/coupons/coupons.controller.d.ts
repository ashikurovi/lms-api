import { HttpStatus } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(createCouponDto: CreateCouponDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/coupon.entity").Coupon;
    }>;
    validateCoupon(code: string, courseId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/coupon.entity").Coupon;
    }>;
    findAll(page?: string, limit?: string, search?: string, courseId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/coupon.entity").Coupon[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/coupon.entity").Coupon;
    }>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/coupon.entity").Coupon & {
            endDate: Date;
            startDate: Date;
            code?: string;
            courseId?: string;
            discountType?: import("./entities/coupon.entity").DiscountType;
            discountValue?: number;
            usageLimit?: number;
            isActive?: boolean;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/coupon.entity").Coupon;
    }>;
}
