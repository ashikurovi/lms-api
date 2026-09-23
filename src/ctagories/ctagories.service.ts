import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, IsNull } from 'typeorm';
import { CreateCourseCategoryDto } from './dto/create-ctagory.dto';
import { UpdateCourseCategoryDto } from './dto/update-ctagory.dto';
import { CourseCategory } from './entities/ctagory.entity';

@Injectable()
export class CtagoriesService {
  constructor(
    @InjectRepository(CourseCategory)
    private courseCategoryRepository: Repository<CourseCategory>,
  ) {}

  async create(createCourseCategoryDto: CreateCourseCategoryDto) {
    const slug =
      createCourseCategoryDto.slug ||
      createCourseCategoryDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (createCourseCategoryDto.parent_id) {
      const parent = await this.courseCategoryRepository.findOne({
        where: { id: createCourseCategoryDto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${createCourseCategoryDto.parent_id} not found`,
        );
      }
    }

    const category = this.courseCategoryRepository.create({
      ...createCourseCategoryDto,
      slug,
    });
    return await this.courseCategoryRepository.save(category);
  }

  async findAll(pageStr?: string, limitStr?: string, search?: string, parentId?: string) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    if (parentId) {
      where.parent_id = parentId;
    } else if (parentId === null || parentId === 'null') {
      where.parent_id = IsNull();
    }

    const [items, total] = await this.courseCategoryRepository.findAndCount({
      where,
      relations: { children: true, parent: true },
      skip,
      take: limit,
      order: { sort_order: 'ASC', name: 'ASC' },
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
    const category = await this.courseCategoryRepository.findOne({
      where: { id },
      relations: { children: true, parent: true },
    });
    if (!category) {
      throw new NotFoundException(`Course category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCourseCategoryDto: UpdateCourseCategoryDto) {
    const category = await this.findOne(id);

    let updatedSlug = category.slug;
    if (updateCourseCategoryDto.slug) {
      updatedSlug = updateCourseCategoryDto.slug;
    } else if (updateCourseCategoryDto.name) {
      updatedSlug = updateCourseCategoryDto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (updateCourseCategoryDto.parent_id) {
      if (updateCourseCategoryDto.parent_id === id) {
        throw new NotFoundException('A category cannot be its own parent');
      }
      const parent = await this.courseCategoryRepository.findOne({
        where: { id: updateCourseCategoryDto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${updateCourseCategoryDto.parent_id} not found`,
        );
      }
    }

    const updatedCategory = Object.assign(category, updateCourseCategoryDto, {
      slug: updatedSlug,
    });
    return await this.courseCategoryRepository.save(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return await this.courseCategoryRepository.softRemove(category);
  }
}
