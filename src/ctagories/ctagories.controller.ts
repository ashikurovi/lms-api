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
import { CtagoriesService } from './ctagories.service';
import { CreateCourseCategoryDto } from './dto/create-ctagory.dto';
import { UpdateCourseCategoryDto } from './dto/update-ctagory.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('course-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CtagoriesController {
  constructor(private readonly ctagoriesService: CtagoriesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createCourseCategoryDto: CreateCourseCategoryDto) {
    const data = await this.ctagoriesService.create(createCourseCategoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Course category created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('parent_id') parentId?: string,
  ) {
    const data = await this.ctagoriesService.findAll(page, limit, search, parentId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course categories retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ctagoriesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course category retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateCourseCategoryDto: UpdateCourseCategoryDto,
  ) {
    const data = await this.ctagoriesService.update(id, updateCourseCategoryDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course category updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.ctagoriesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Course category deleted successfully',
      data,
    };
  }
}
