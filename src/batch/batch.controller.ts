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
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('batches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createBatchDto: CreateBatchDto) {
    const data = await this.batchService.create(createBatchDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Batch created successfully',
      data,
    };
  }

  @Post('launch')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async launch(@Body() createBatchDto: CreateBatchDto) {
    const data = await this.batchService.launch(createBatchDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Batch launched successfully and previous batches turned off',
      data,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('course_id') courseId?: string,
    @Query('status') status?: string,
    @Query('mode') mode?: string,
    @Query('mentor_id') mentorId?: string,
  ) {
    const data = await this.batchService.findAll(
      page,
      limit,
      search,
      courseId,
      status,
      mode,
      mentorId,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Batches retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.batchService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Batch retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    const data = await this.batchService.update(id, updateBatchDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Batch updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.batchService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Batch deleted successfully',
      data,
    };
  }
}
