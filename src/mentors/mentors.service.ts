import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Mentor } from './entities/mentor.entity';
import { UserRole } from '../users/entities/user.entity';

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

    // 1. Remove references from course_mentors join table
    try {
      await this.mentorRepository.query(
        `DELETE FROM "course_mentors" WHERE "mentor_id" = $1`,
        [id],
      );
    } catch (err) {
      console.warn('Error clearing course_mentors:', err);
    }

    // 2. Clear mentorId from assignments
    try {
      await this.mentorRepository.query(
        `ALTER TABLE "assignments" ALTER COLUMN "mentorId" DROP NOT NULL`,
      );
    } catch {}

    try {
      await this.mentorRepository.query(
        `UPDATE "assignments" SET "mentorId" = NULL WHERE "mentorId" = $1`,
        [id],
      );
    } catch (err) {
      console.warn('Error clearing assignments mentorId:', err);
    }

    // 3. Clear mentorId from live_schedules & resources if linked to user
    if (mentor.user?.id) {
      try {
        await this.mentorRepository.query(
          `UPDATE "live_schedules" SET "mentorId" = NULL WHERE "mentorId" = $1`,
          [mentor.user.id],
        );
      } catch {}

      try {
        await this.mentorRepository.query(
          `UPDATE "resources" SET "mentorId" = NULL WHERE "mentorId" = $1`,
          [mentor.user.id],
        );
      } catch {}
    }

    // 4. Remove the mentor record
    const result = await this.mentorRepository.remove(mentor);

    // 5. Update associated user role to student so they no longer hold trainer privileges
    if (mentor.user) {
      try {
        if (mentor.user.role === UserRole.MENTOR) {
          mentor.user.role = UserRole.STUDENT;
          await this.mentorRepository.manager.save(mentor.user);
        }
      } catch (err) {
        console.warn('Error updating user role:', err);
      }
    }

    return result;
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
