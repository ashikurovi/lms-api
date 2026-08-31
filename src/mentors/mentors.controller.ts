import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { MentorsService } from './mentors.service';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('mentors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createMentorDto: CreateMentorDto) {
    const data = await this.mentorsService.create(createMentorDto);
    return { statusCode: HttpStatus.CREATED, message: 'Mentor created successfully', data };
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.mentorsService.findAll(page, limit, search);
    return { statusCode: HttpStatus.OK, message: 'Mentors retrieved successfully', data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.mentorsService.findOne(id);
    return { statusCode: HttpStatus.OK, message: 'Mentor retrieved successfully', data };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(@Param('id') id: string, @Body() updateMentorDto: UpdateMentorDto) {
    const data = await this.mentorsService.update(id, updateMentorDto);
    return { statusCode: HttpStatus.OK, message: 'Mentor updated successfully', data };
  }

  @Patch(':id/ban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async ban(@Param('id') id: string) {
    const data = await this.mentorsService.ban(id);
    return { statusCode: HttpStatus.OK, message: 'Mentor banned successfully', data };
  }

  @Patch(':id/unban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async unban(@Param('id') id: string) {
    const data = await this.mentorsService.unban(id);
    return { statusCode: HttpStatus.OK, message: 'Mentor unbanned successfully', data };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.mentorsService.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Mentor deleted successfully', data };
  }
}
