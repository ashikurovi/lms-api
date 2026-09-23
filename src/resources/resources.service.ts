import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, ILike } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: CreateResourceDto, mentorId?: string) {
    const resourceData: DeepPartial<Resource> = {
      ...createResourceDto,
      mentorId,
    };

    const resource = this.resourceRepository.create(resourceData);
    return await this.resourceRepository.save(resource);
  }

  async findAll(pageStr?: string, limitStr?: string, search?: string, batchId?: string) {
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

    const [items, total] = await this.resourceRepository.findAndCount({
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
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: { batch: true, mentor: true },
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return resource;
  }

  async update(id: string, updateResourceDto: UpdateResourceDto) {
    const resource = await this.findOne(id);
    const updatedResource = Object.assign(resource, updateResourceDto);
    return await this.resourceRepository.save(updatedResource);
  }

  async remove(id: string) {
    const resource = await this.findOne(id);
    return await this.resourceRepository.remove(resource);
  }
}
