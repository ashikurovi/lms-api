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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createCourseDto: CreateCourseDto) {
    const data = await this.courseService.create(createCourseDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Course created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('category_id') categoryId?: string,
    @Query('status') status?: string,
    @Query('level') level?: string,
  ) {
    const data = await this.courseService.findAll(
      page,
      limit,
      search,
      categoryId,
      status,
      level,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Courses retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.courseService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const data = await this.courseService.update(id, updateCourseDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.courseService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course deleted successfully',
      data,
    };
  }
}
