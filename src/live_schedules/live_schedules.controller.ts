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
  Req,
} from '@nestjs/common';
import { LiveSchedulesService } from './live_schedules.service';
import { CreateLiveScheduleDto } from './dto/create-live_schedule.dto';
import { UpdateLiveScheduleDto } from './dto/update-live_schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('live-schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LiveSchedulesController {
  constructor(private readonly liveSchedulesService: LiveSchedulesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async create(@Body() createLiveScheduleDto: CreateLiveScheduleDto, @Req() req: any) {
    // Optionally set creator if not provided in the DTO
    if (!createLiveScheduleDto.createdBy && req.user?.id) {
      createLiveScheduleDto.createdBy = req.user.id;
    }
    // If the user is a mentor, enforce their own mentorId
    if (req.user?.role === UserRole.MENTOR) {
      createLiveScheduleDto.mentorId = req.user.id;
    }
    const data = await this.liveSchedulesService.create(createLiveScheduleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Live schedule created successfully',
      data,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('batchId') batchId?: string,
    @Query('mentorId') mentorId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.liveSchedulesService.findAll(
      page,
      limit,
      search,
      batchId,
      mentorId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Live schedules retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.liveSchedulesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Live schedule retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async update(
    @Param('id') id: string,
    @Body() updateLiveScheduleDto: UpdateLiveScheduleDto,
  ) {
    const data = await this.liveSchedulesService.update(id, updateLiveScheduleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Live schedule updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async remove(@Param('id') id: string) {
    const data = await this.liveSchedulesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Live schedule deleted successfully',
      data,
    };
  }
}
