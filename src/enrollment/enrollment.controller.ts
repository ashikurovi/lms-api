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
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateManualEnrollmentDto } from './dto/create-manual-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    const data = await this.enrollmentService.create(createEnrollmentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Enrollment created successfully',
      data,
    };
  }

  @Post('manual')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async createManual(@Body() dto: CreateManualEnrollmentDto) {
    const data = await this.enrollmentService.createManual(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Manual enrollment completed successfully',
      data,
    };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('student_id') studentId?: string,
    @Query('batch_id') batchId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.enrollmentService.findAll(
      page,
      limit,
      studentId,
      batchId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Enrollments retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findOne(@Param('id') id: string) {
    const data = await this.enrollmentService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Enrollment retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    const data = await this.enrollmentService.update(id, updateEnrollmentDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Enrollment updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.enrollmentService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Enrollment cancelled successfully',
      data,
    };
  }
}
