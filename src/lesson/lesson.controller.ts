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
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createLessonDto: CreateLessonDto) {
    const data = await this.lessonService.create(createLessonDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Lesson created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('module_id') moduleId?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    const data = await this.lessonService.findAll(
      page,
      limit,
      search,
      moduleId,
      status,
      type,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Lessons retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.lessonService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lesson retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const data = await this.lessonService.update(id, updateLessonDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lesson updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.lessonService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lesson deleted successfully',
      data,
    };
  }
}
