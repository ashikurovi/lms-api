import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DeepPartial } from 'typeorm';
import { CreateLiveScheduleDto } from './dto/create-live_schedule.dto';
import { UpdateLiveScheduleDto } from './dto/update-live_schedule.dto';
import { LiveSchedule } from './entities/live_schedule.entity';

@Injectable()
export class LiveSchedulesService {
  constructor(
    @InjectRepository(LiveSchedule)
    private liveScheduleRepository: Repository<LiveSchedule>,
  ) {}

  async create(createLiveScheduleDto: CreateLiveScheduleDto) {
    const { startTime, endTime, ...rest } = createLiveScheduleDto;

    const scheduleData: DeepPartial<LiveSchedule> = {
      ...rest,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
    };

    const schedule = this.liveScheduleRepository.create(scheduleData);
    return await this.liveScheduleRepository.save(schedule);
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

    const [items, total] = await this.liveScheduleRepository.findAndCount({
      where,
      relations: { batch: true, mentor: true, creator: true },
      skip,
      take: limit,
      order: { startTime: 'ASC' },
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
    const schedule = await this.liveScheduleRepository.findOne({
      where: { id },
      relations: { batch: true, mentor: true, creator: true },
    });
    if (!schedule) {
      throw new NotFoundException(`Live schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: string, updateLiveScheduleDto: UpdateLiveScheduleDto) {
    const schedule = await this.findOne(id);

    const updatedSchedule = Object.assign(schedule, {
      ...updateLiveScheduleDto,
      ...(updateLiveScheduleDto.startTime && {
        startTime: new Date(updateLiveScheduleDto.startTime),
      }),
      ...(updateLiveScheduleDto.endTime !== undefined && {
        endTime: updateLiveScheduleDto.endTime
          ? new Date(updateLiveScheduleDto.endTime)
          : null,
      }),
    });

    return await this.liveScheduleRepository.save(updatedSchedule);
  }

  async remove(id: string) {
    const schedule = await this.findOne(id);
    return await this.liveScheduleRepository.remove(schedule);
  }
}
