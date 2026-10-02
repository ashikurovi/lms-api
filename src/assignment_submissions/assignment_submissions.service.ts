import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, DataSource } from 'typeorm';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment_submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment_submission.dto';
import { AssignmentSubmission } from './entities/assignment_submission.entity';

@Injectable()
export class AssignmentSubmissionsService {
  constructor(
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    private dataSource: DataSource,
  ) {}

  async create(createSubmissionDto: CreateAssignmentSubmissionDto, userId?: string) {
    if (!createSubmissionDto.studentId && userId) {
      createSubmissionDto.studentId = userId;
    }

    if (!createSubmissionDto.studentId) {
      throw new BadRequestException('studentId is required');
    }

    const submissionData: DeepPartial<AssignmentSubmission> = {
      ...createSubmissionDto,
      submittedAt: new Date(), // Automatically set submittedAt
    };

    const submission = this.submissionRepository.create(submissionData);
    return await this.submissionRepository.save(submission);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    assignmentId?: string,
    studentId?: string,
    status?: string,
    userId?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    let resolvedStudentId = studentId;

    if (!resolvedStudentId && userId) {
      resolvedStudentId = userId;
    }

    const where: any = {};

    if (assignmentId) {
      where.assignmentId = assignmentId;
    }
    if (resolvedStudentId) {
      where.studentId = resolvedStudentId;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.submissionRepository.findAndCount({
      where,
      relations: { assignment: true, student: true },
      skip,
      take: limit,
      order: { submittedAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: { assignment: true, student: true },
    });
    if (!submission) {
      throw new NotFoundException(`Assignment submission with ID ${id} not found`);
    }
    return submission;
  }

  async update(id: string, updateSubmissionDto: UpdateAssignmentSubmissionDto, reviewerId?: string) {
    const submission = await this.findOne(id);

    // If marks or feedback are provided, automatically consider it reviewed
    if (
      (updateSubmissionDto.marks !== undefined || updateSubmissionDto.feedback !== undefined) &&
      !updateSubmissionDto.status
    ) {
      updateSubmissionDto.status = 'reviewed';
    }

    const updatedSubmission = Object.assign(submission, {
      ...updateSubmissionDto,
      ...(updateSubmissionDto.status === 'reviewed' && {
        reviewedAt: new Date(),
        ...(reviewerId && { reviewedBy: reviewerId }),
      }),
    });

    return await this.submissionRepository.save(updatedSubmission);
  }

  async remove(id: string) {
    const submission = await this.findOne(id);
    return await this.submissionRepository.remove(submission);
  }
}
