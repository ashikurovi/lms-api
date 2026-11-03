import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { Walkthrough } from './entities/walkthrough.entity';

@Injectable()
export class WalkthroughsService {
  constructor(
    @InjectRepository(Walkthrough)
    private walkthroughRepository: Repository<Walkthrough>,
  ) {}

  async create(createWalkthroughDto: CreateWalkthroughDto) {
    const item = this.walkthroughRepository.create(createWalkthroughDto);
    return await this.walkthroughRepository.save(item);
  }

  async findAll() {
    return await this.walkthroughRepository.find({
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const item = await this.walkthroughRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Walkthrough with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateWalkthroughDto: UpdateWalkthroughDto) {
    const item = await this.findOne(id);
    const updated = Object.assign(item, updateWalkthroughDto);
    return await this.walkthroughRepository.save(updated);
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    return await this.walkthroughRepository.remove(item);
  }
}

