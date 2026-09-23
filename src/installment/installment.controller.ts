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
import { InstallmentService } from './installment.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('installments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstallmentController {
  constructor(private readonly installmentService: InstallmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createInstallmentDto: CreateInstallmentDto) {
    const data = await this.installmentService.create(createInstallmentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Installment created successfully',
      data,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('enrollment_id') enrollmentId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.installmentService.findAll(
      page,
      limit,
      enrollmentId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Installments retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findOne(@Param('id') id: string) {
    const data = await this.installmentService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Installment retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateInstallmentDto: UpdateInstallmentDto,
  ) {
    const data = await this.installmentService.update(
      id,
      updateInstallmentDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Installment updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.installmentService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Installment cancelled successfully',
      data,
    };
  }
}
