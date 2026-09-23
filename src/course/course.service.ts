import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseStatus } from './entities/course.entity';
import { Mentor } from '../mentors/entities/mentor.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Mentor)
    private mentorRepository: Repository<Mentor>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const { mentor_ids, ...rest } = createCourseDto;

    const slug =
      rest.slug ||
      rest.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const course = this.courseRepository.create({
      ...rest,
      slug,
      published_at:
        rest.status === CourseStatus.PUBLISHED
          ? new Date()
          : rest.published_at
            ? new Date(rest.published_at)
            : null,
    });

    if (mentor_ids?.length) {
      course.mentors = await this.mentorRepository.findBy({ id: In(mentor_ids) });
    }

    return await this.courseRepository.save(course);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    categoryId?: string,
    status?: string,
    level?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.title = ILike(`%${search}%`);
    }
    if (categoryId) {
      where.category_id = categoryId;
    }
    if (status) {
      where.status = status;
    }
    if (level) {
      where.level = level;
    }

    const [items, total] = await this.courseRepository.findAndCount({
      where,
      relations: { category: true, mentors: true },
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

  async findOne(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { category: true, mentors: true },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    const { mentor_ids, ...rest } = updateCourseDto;

    let updatedSlug = course.slug;
    if (rest.slug) {
      updatedSlug = rest.slug;
    } else if (rest.title) {
      updatedSlug = rest.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Auto-set published_at when status changes to published
    let publishedAt = course.published_at;
    if (
      rest.status === CourseStatus.PUBLISHED &&
      course.status !== CourseStatus.PUBLISHED
    ) {
      publishedAt = new Date();
    }

    if (mentor_ids !== undefined) {
      course.mentors = mentor_ids.length
        ? await this.mentorRepository.findBy({ id: In(mentor_ids) })
        : [];
    }

    const updatedCourse = Object.assign(course, rest, {
      slug: updatedSlug,
      published_at: rest.published_at
        ? new Date(rest.published_at)
        : publishedAt,
    });
    return await this.courseRepository.save(updatedCourse);
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    return await this.courseRepository.softRemove(course);
  }
}
