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

  private async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const cleanBase = (baseSlug || 'lesson')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'lesson';

    let candidate = cleanBase;
    let counter = 1;

    while (true) {
      const existing = await this.lessonRepository.findOne({
        where: { slug: candidate },
        select: { id: true, slug: true },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        return candidate;
      }

      candidate = `${cleanBase}-${counter}`;
      counter++;
    }
  }

  async create(createLessonDto: CreateLessonDto) {
    const rawSlug =
      createLessonDto.slug ||
      createLessonDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const slug = await this.generateUniqueSlug(rawSlug);

    const lesson = this.lessonRepository.create({
      ...createLessonDto,
      slug,
    });

    try {
      return await this.lessonRepository.save(lesson);
    } catch (err: any) {
      if (
        err?.code === '23505' ||
        err?.detail?.includes('slug') ||
        err?.message?.toLowerCase().includes('slug') ||
        err?.message?.toLowerCase().includes('unique')
      ) {
        lesson.slug = `${slug}-${Date.now().toString().slice(-4)}`;
        return await this.lessonRepository.save(lesson);
      }
      throw err;
    }
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

    if (updatedSlug !== lesson.slug) {
      updatedSlug = await this.generateUniqueSlug(updatedSlug, lesson.id);
    }

    const updatedLesson = Object.assign(lesson, updateLessonDto, {
      slug: updatedSlug,
    });

    try {
      return await this.lessonRepository.save(updatedLesson);
    } catch (err: any) {
      if (
        err?.code === '23505' ||
        err?.detail?.includes('slug') ||
        err?.message?.toLowerCase().includes('slug') ||
        err?.message?.toLowerCase().includes('unique')
      ) {
        updatedLesson.slug = `${updatedSlug}-${Date.now().toString().slice(-4)}`;
        return await this.lessonRepository.save(updatedLesson);
      }
      throw err;
    }
  }

  async remove(id: string) {
    const lesson = await this.findOne(id);
    return await this.lessonRepository.softRemove(lesson);
  }
}
