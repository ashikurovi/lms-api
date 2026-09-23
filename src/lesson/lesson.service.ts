import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const slug =
      createLessonDto.slug ||
      createLessonDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      slug,
    });
    return await this.lessonRepository.save(lesson);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    moduleId?: string,
    status?: string,
    type?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }
    if (moduleId) {
      where.module_id = moduleId;
    }
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    const [items, total] = await this.lessonRepository.findAndCount({
      where,
      relations: { module: true },
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
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: { module: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.findOne(id);

    let updatedSlug = lesson.slug;
    if (updateLessonDto.slug) {
      updatedSlug = updateLessonDto.slug;
    } else if (updateLessonDto.title) {
      updatedSlug = updateLessonDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const updatedLesson = Object.assign(lesson, updateLessonDto, {
      slug: updatedSlug,
    });
    return await this.lessonRepository.save(updatedLesson);
  }

  async remove(id: string) {
    const lesson = await this.findOne(id);
    return await this.lessonRepository.softRemove(lesson);
  }
}
