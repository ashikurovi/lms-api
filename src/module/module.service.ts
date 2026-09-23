import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CourseModule } from './entities/module.entity';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(CourseModule)
    private moduleRepository: Repository<CourseModule>,
  ) {}

  async create(createModuleDto: CreateModuleDto) {
    const mod = this.moduleRepository.create(createModuleDto);
    return await this.moduleRepository.save(mod);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    courseId?: string,
    status?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }
    if (courseId) {
      where.course_id = courseId;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.moduleRepository.findAndCount({
      where,
      relations: { course: true },
      skip,
      take: limit,
      order: { order: 'ASC', created_at: 'DESC' },
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
    const mod = await this.moduleRepository.findOne({
      where: { id },
      relations: { course: true },
    });
    if (!mod) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return mod;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    const mod = await this.findOne(id);
    const updatedModule = Object.assign(mod, updateModuleDto);
    return await this.moduleRepository.save(updatedModule);
  }

  async remove(id: string) {
    const mod = await this.findOne(id);
    return await this.moduleRepository.softRemove(mod);
  }
}
