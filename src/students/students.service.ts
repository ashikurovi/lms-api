import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(student);
  }

  async findAll(pageStr?: string, limitStr?: string, search?: string) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where = search ? { name: ILike(`%${search}%`) } : {};

    const [items, total] = await this.studentRepository.findAndCount({
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
    const student = await this.studentRepository.findOne({ where: { id }, relations: { user: true } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id);
    const updatedStudent = Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(updatedStudent);
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    return await this.studentRepository.remove(student);
  }

  async ban(id: string) {
    const student = await this.findOne(id);
    if (student.user) {
      student.user.isBanned = true;
      student.user.bannedAt = new Date();
      await this.studentRepository.manager.save(student.user);
    }
    return student;
  }

  async unban(id: string) {
    const student = await this.findOne(id);
    if (student.user) {
      student.user.isBanned = false;
      student.user.bannedAt = null;
      await this.studentRepository.manager.save(student.user);
    }
    return student;
  }
}
