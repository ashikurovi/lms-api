import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DeepPartial } from 'typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Batch, BatchStatus } from './entities/batch.entity';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
  ) {}

  async create(createBatchDto: CreateBatchDto) {
    const {
      start_date,
      end_date,
      registration_start,
      registration_end,
      ...rest
    } = createBatchDto;

    const batchData: DeepPartial<Batch> = {
      ...rest,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      registration_start: registration_start
        ? new Date(registration_start)
        : undefined,
      registration_end: registration_end
        ? new Date(registration_end)
        : undefined,
    };

    const batch = this.batchRepository.create(batchData);
    return await this.batchRepository.save(batch);
  }

  async launch(createBatchDto: CreateBatchDto) {
    const {
      start_date,
      end_date,
      registration_start,
      registration_end,
      ...rest
    } = createBatchDto;

    const batchData: DeepPartial<Batch> = {
      ...rest,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      registration_start: registration_start
        ? new Date(registration_start)
        : undefined,
      registration_end: registration_end
        ? new Date(registration_end)
        : undefined,
    };

    // Close previous batches for the same course
    if (batchData.course_id) {
      await this.batchRepository
        .createQueryBuilder()
        .update(Batch)
        .set({ status: BatchStatus.ONGOING })
        .where('course_id = :courseId', { courseId: batchData.course_id })
        .andWhere('status IN (:...statuses)', {
          statuses: [BatchStatus.UPCOMING, BatchStatus.OPEN],
        })
        .execute();
    }

    const batch = this.batchRepository.create(batchData);
    return await this.batchRepository.save(batch);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    courseId?: string,
    status?: string,
    mode?: string,
    mentorId?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }
    if (courseId) {
      where.course_id = courseId;
    }
    if (status) {
      where.status = status;
    }
    if (mode) {
      where.mode = mode;
    }
    if (mentorId) {
      where.course = {
        mentors: {
          user: { id: mentorId },
        },
      };
    }

    const [items, total] = await this.batchRepository.findAndCount({
      where,
      relations: { course: true },
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(idOrCodeOrSlug: string) {
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrCodeOrSlug);
    
    let whereCondition: any;
    if (isUuid) {
      whereCondition = { id: idOrCodeOrSlug };
    } else {
      whereCondition = [
        { code: idOrCodeOrSlug },
        { course: { slug: idOrCodeOrSlug } }
      ];
    }

    const batch = await this.batchRepository.findOne({
      where: whereCondition,
      relations: { 
        course: {
          mentors: {
            user: true
          },
          modules: {
            lessons: true
          }
        } 
      },
    });
    if (!batch) {
      throw new NotFoundException(`Batch with identifier ${idOrCodeOrSlug} not found`);
    }
    return batch;
  }

  async update(id: string, updateBatchDto: UpdateBatchDto) {
    const batch = await this.findOne(id);

    const updatedBatch = Object.assign(batch, {
      ...updateBatchDto,
      ...(updateBatchDto.start_date && {
        start_date: new Date(updateBatchDto.start_date),
      }),
      ...(updateBatchDto.end_date && {
        end_date: new Date(updateBatchDto.end_date),
      }),
      ...(updateBatchDto.registration_start !== undefined && {
        registration_start: updateBatchDto.registration_start
          ? new Date(updateBatchDto.registration_start)
          : null,
      }),
      ...(updateBatchDto.registration_end !== undefined && {
        registration_end: updateBatchDto.registration_end
          ? new Date(updateBatchDto.registration_end)
          : null,
      }),
    });

    // CRITICAL FIX: If course_id is being updated, we must remove the eagerly loaded `course` object.
    // Otherwise, TypeORM will prioritize the old `batch.course` object over the new `course_id` value.
    if (updateBatchDto.course_id) {
      updatedBatch.course = { id: updateBatchDto.course_id } as any;
    }

    return await this.batchRepository.save(updatedBatch);
  }

  async remove(id: string) {
    const batch = await this.findOne(id);
    return await this.batchRepository.softRemove(batch);
  }
}
