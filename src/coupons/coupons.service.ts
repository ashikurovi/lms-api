import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const existing = await this.couponRepository.findOne({
      where: { code: createCouponDto.code },
    });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = this.couponRepository.create({
      ...createCouponDto,
      startDate: createCouponDto.startDate ? new Date(createCouponDto.startDate) : undefined,
      endDate: createCouponDto.endDate ? new Date(createCouponDto.endDate) : undefined,
    });
    return await this.couponRepository.save(coupon);
  }

  async validateCoupon(code: string, courseId?: string) {
    const coupon = await this.couponRepository.findOne({
      where: { code },
      relations: { batch: true },
    });

    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }

    if (courseId && coupon.batch && coupon.batch.course_id !== courseId) {
      throw new BadRequestException('Coupon is not valid for this course');
    }

    const now = new Date();
    if (coupon.startDate && now < coupon.startDate) {
      throw new BadRequestException('Coupon is not valid yet');
    }

    if (coupon.endDate && now > coupon.endDate) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit exceeded');
    }

    return coupon;
  }

  async incrementUsage(code: string) {
    const coupon = await this.couponRepository.findOne({ where: { code } });
    if (coupon) {
      coupon.usedCount += 1;
      await this.couponRepository.save(coupon);
    }
  }

  async findAll(pageStr?: string, limitStr?: string, search?: string, courseId?: string) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.code = ILike(`%${search}%`);
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

  async findOne(id: string) {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: { batch: true },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }
    return coupon;
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
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

  async remove(id: string) {
    const coupon = await this.findOne(id);
    return await this.couponRepository.remove(coupon);
  }
}
