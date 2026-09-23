import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createCouponDto: CreateCouponDto) {
    const data = await this.couponsService.create(createCouponDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Coupon created successfully',
      data,
    };
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateCoupon(
    @Body('code') code: string,
    @Body('courseId') courseId?: string,
  ) {
    const data = await this.couponsService.validateCoupon(code, courseId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon is valid',
      data,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('courseId') courseId?: string,
  ) {
    const data = await this.couponsService.findAll(page, limit, search, courseId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupons retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findOne(@Param('id') id: string) {
    const data = await this.couponsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    const data = await this.couponsService.update(id, updateCouponDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon updated successfully',
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.couponsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Coupon deleted successfully',
      data,
    };
  }
}
