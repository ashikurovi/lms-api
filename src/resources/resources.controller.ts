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
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async create(@Body() createResourceDto: CreateResourceDto, @Req() req: any) {
    const mentorId = req.user?.id;
    const data = await this.resourcesService.create(createResourceDto, mentorId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Resource created successfully',
      data,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('batchId') batchId?: string,
  ) {
    const data = await this.resourcesService.findAll(page, limit, search, batchId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Resources retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.resourcesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Resource retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    const data = await this.resourcesService.update(id, updateResourceDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Resource updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async remove(@Param('id') id: string) {
    const data = await this.resourcesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Resource deleted successfully',
      data,
    };
  }
}
