"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_1 = require("./entities/coupon.entity");
let CouponsService = class CouponsService {
    couponRepository;
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async create(createCouponDto) {
        const existing = await this.couponRepository.findOne({
            where: { code: createCouponDto.code },
        });
        if (existing) {
            throw new common_1.BadRequestException('Coupon code already exists');
        }
        const coupon = this.couponRepository.create({
            ...createCouponDto,
            startDate: createCouponDto.startDate ? new Date(createCouponDto.startDate) : undefined,
            endDate: createCouponDto.endDate ? new Date(createCouponDto.endDate) : undefined,
        });
        return await this.couponRepository.save(coupon);
    }
    async validateCoupon(code, courseId) {
        const coupon = await this.couponRepository.findOne({
            where: { code },
            relations: { batch: true },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Invalid coupon code');
        }
        if (!coupon.isActive) {
            throw new common_1.BadRequestException('Coupon is inactive');
        }
        if (courseId && coupon.batch && coupon.batch.course_id !== courseId) {
            throw new common_1.BadRequestException('Coupon is not valid for this course');
        }
        const now = new Date();
        if (coupon.startDate && now < coupon.startDate) {
            throw new common_1.BadRequestException('Coupon is not valid yet');
        }
        if (coupon.endDate && now > coupon.endDate) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            throw new common_1.BadRequestException('Coupon usage limit exceeded');
        }
        return coupon;
    }
    async incrementUsage(code) {
        const coupon = await this.couponRepository.findOne({ where: { code } });
        if (coupon) {
            coupon.usedCount += 1;
            await this.couponRepository.save(coupon);
        }
    }
    async findAll(pageStr, limitStr, search, courseId) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.code = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (courseId) {
            where.batch = { course_id: courseId };
        }
        const [items, total] = await this.couponRepository.findAndCount({
            where,
            relations: { batch: true },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const coupon = await this.couponRepository.findOne({
            where: { id },
            relations: { batch: true },
        });
        if (!coupon) {
            throw new common_1.NotFoundException(`Coupon with ID ${id} not found`);
        }
        return coupon;
    }
    async update(id, updateCouponDto) {
        const coupon = await this.findOne(id);
        const updatedCoupon = Object.assign(coupon, {
            ...updateCouponDto,
            ...(updateCouponDto.startDate !== undefined && {
                startDate: updateCouponDto.startDate ? new Date(updateCouponDto.startDate) : null,
            }),
            ...(updateCouponDto.endDate !== undefined && {
                endDate: updateCouponDto.endDate ? new Date(updateCouponDto.endDate) : null,
            }),
        });
        return await this.couponRepository.save(updatedCoupon);
    }
    async remove(id) {
        const coupon = await this.findOne(id);
        return await this.couponRepository.remove(coupon);
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map