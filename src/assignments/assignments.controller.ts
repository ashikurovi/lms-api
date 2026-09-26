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
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createAssignmentDto: CreateAssignmentDto, @Req() req: any) {
    const data = await this.assignmentsService.create(createAssignmentDto, req.user?.id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Assignment created successfully',
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
    const data = await this.assignmentsService.findAll(
      page,
      limit,
      search,
      batchId,
      mentorId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignments retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.assignmentsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    const data = await this.assignmentsService.update(id, updateAssignmentDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.assignmentsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment deleted successfully',
      data,
    };
  }
}
