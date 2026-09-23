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
import { AssignmentSubmissionsService } from './assignment_submissions.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment_submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment_submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('assignment-submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssignmentSubmissionsController {
  constructor(private readonly submissionsService: AssignmentSubmissionsService) {}

  @Post()
  async create(@Body() createSubmissionDto: CreateAssignmentSubmissionDto, @Req() req: any) {
    // If user is a student, ensure they only submit for themselves
    if (!createSubmissionDto.studentId && req.user?.id) {
      createSubmissionDto.studentId = req.user.id;
    }
    
    const data = await this.submissionsService.create(createSubmissionDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Assignment submitted successfully',
      data,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('assignmentId') assignmentId?: string,
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.submissionsService.findAll(
      page,
      limit,
      assignmentId,
      studentId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment submissions retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.submissionsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment submission retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateAssignmentSubmissionDto,
    @Req() req: any
  ) {
    const reviewerId = req.user?.id;
    const data = await this.submissionsService.update(id, updateSubmissionDto, reviewerId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment submission updated successfully',
      data,
    };
  }

  @Patch(':id/review')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER, UserRole.MENTOR)
  async reviewSubmission(
    @Param('id') id: string,
    @Body() reviewDto: ReviewSubmissionDto,
    @Req() req: any
  ) {
    const reviewerId = req.user?.id;
    const data = await this.submissionsService.update(id, {
      ...reviewDto,
      status: 'reviewed',
    }, reviewerId);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment successfully reviewed',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.submissionsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Assignment submission deleted successfully',
      data,
    };
  }
}
