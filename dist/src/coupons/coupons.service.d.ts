import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
export declare class CouponsService {
    private couponRepository;
    constructor(couponRepository: Repository<Coupon>);
    create(createCouponDto: CreateCouponDto): Promise<Coupon>;
    validateCoupon(code: string, courseId?: string): Promise<Coupon>;
    incrementUsage(code: string): Promise<void>;
    findAll(pageStr?: string, limitStr?: string, search?: string, courseId?: string): Promise<{
        items: Coupon[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Coupon>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon & {
        endDate: Date;
        startDate: Date;
        code?: string;
        courseId?: string;
        discountType?: import("./entities/coupon.entity").DiscountType;
        discountValue?: number;
        usageLimit?: number;
        isActive?: boolean;
    }>;
    remove(id: string): Promise<Coupon>;
}
