import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DeepPartial } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const { dueAt, ...rest } = createAssignmentDto;

    const assignmentData: DeepPartial<Assignment> = {
      ...rest,
      dueAt: dueAt ? new Date(dueAt) : undefined,
    };

    const assignment = this.assignmentRepository.create(assignmentData);
    return await this.assignmentRepository.save(assignment);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    batchId?: string,
    mentorId?: string,
    status?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }
    if (batchId) {
      where.batchId = batchId;
    }
    if (mentorId) {
      where.mentorId = mentorId;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.assignmentRepository.findAndCount({
      where,
      relations: { batch: true, mentor: true },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
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
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: { batch: true, mentor: true },
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    const assignment = await this.findOne(id);

    const updatedAssignment = Object.assign(assignment, {
      ...updateAssignmentDto,
      ...(updateAssignmentDto.dueAt !== undefined && {
        dueAt: updateAssignmentDto.dueAt
          ? new Date(updateAssignmentDto.dueAt)
          : null,
      }),
    });

    return await this.assignmentRepository.save(updatedAssignment);
  }

  async remove(id: string) {
    const assignment = await this.findOne(id);
    return await this.assignmentRepository.remove(assignment);
  }
}
