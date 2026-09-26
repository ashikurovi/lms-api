import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Mentor } from './entities/mentor.entity';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentor)
    private mentorRepository: Repository<Mentor>,
  ) {}

  async create(createMentorDto: CreateMentorDto) {
    const { userId, ...rest } = createMentorDto;
    const mentor = this.mentorRepository.create({
      ...rest,
      user: { id: userId },
    });
    return await this.mentorRepository.save(mentor);
  }

  async findAll(pageStr?: string, limitStr?: string, search?: string) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where = search ? { subject: ILike(`%${search}%`) } : {};

    const [items, total] = await this.mentorRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: { user: true },
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
    const mentor = await this.mentorRepository.findOne({ where: { id }, relations: { user: true } });
    if (!mentor) {
      throw new NotFoundException(`Mentor with ID ${id} not found`);
    }
    return mentor;
  }

  async update(id: string, updateMentorDto: UpdateMentorDto) {
    const mentor = await this.findOne(id);
    const updatedMentor = Object.assign(mentor, updateMentorDto);
    return await this.mentorRepository.save(updatedMentor);
  }

  async remove(id: string) {
    const mentor = await this.findOne(id);
    return await this.mentorRepository.remove(mentor);
  }

  async ban(id: string) {
    const mentor = await this.findOne(id);
    if (mentor.user) {
      mentor.user.isBanned = true;
      mentor.user.bannedAt = new Date();
      await this.mentorRepository.manager.save(mentor.user);
    }
    return mentor;
  }

  async unban(id: string) {
    const mentor = await this.findOne(id);
    if (mentor.user) {
      mentor.user.isBanned = false;
      mentor.user.bannedAt = null;
      await this.mentorRepository.manager.save(mentor.user);
    }
    return mentor;
  }
}
