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
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('modules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createModuleDto: CreateModuleDto) {
    const data = await this.moduleService.create(createModuleDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Module created successfully',
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
  ) {
    const data = await this.moduleService.findAll(
      page,
      limit,
      search,
      courseId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Modules retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.moduleService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Module retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    const data = await this.moduleService.update(id, updateModuleDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Module updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.moduleService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Module deleted successfully',
      data,
    };
  }
}
