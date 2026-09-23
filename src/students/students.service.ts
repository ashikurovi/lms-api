import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private usersService: UsersService,
  ) {}

  async checkStudent(query: { phone?: string; roll?: string; registrationNumber?: string }) {
    const { phone, roll, registrationNumber } = query;
    if (!phone && !roll && !registrationNumber) {
      return { exists: false, message: 'Please provide phone, roll, or registration number to verify.' };
    }

    let student: Student | null = null;
    const whereConditions: any[] = [];

    if (phone) whereConditions.push({ phone });
    if (roll) whereConditions.push({ roll });
    if (registrationNumber) whereConditions.push({ registrationNumber });

    if (whereConditions.length > 0) {
      student = await this.studentRepository.findOne({
        where: whereConditions,
        relations: { user: true },
      });
    }

    let user: User | null = null;
    if (phone) {
      user = await this.usersService.findByPhone(phone);
    }

    const exists = !!(student || user);
    return {
      exists,
      student,
      userExists: !!user,
      message: exists ? 'Record found in database.' : 'Record not found in database.',
    };
  }

  async registerStudent(registerDto: any) {
    const { email, phone, name, password, roll, registrationNumber, institute, department, technology, semester, session, shift } = registerDto;

    if (!email || !name) {
      throw new BadRequestException('Email and Name are required for registration.');
    }

    // Check if user already exists
    let user = await this.usersService.findByEmail(email);
    if (!user && phone) {
      user = await this.usersService.findByPhone(phone);
    }

    if (!user) {
      const rawPassword = password || 'Password123!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);

      user = await this.usersService.create({
        name,
        email,
        phone: phone || '',
        password: hashedPassword,
        role: UserRole.STUDENT,
      });
    }

    // Check if student profile already exists
    let student = await this.studentRepository.findOne({ where: { email } });
    if (!student && phone) {
      student = await this.studentRepository.findOne({ where: { phone } });
    }

    if (!student) {
      student = this.studentRepository.create({
        name,
        email,
        phone,
        roll,
        registrationNumber,
        institute,
        department,
        technology,
        semester: semester ? Number(semester) : undefined,
        session,
        shift,
        user,
      });
    } else {
      Object.assign(student, {
        name,
        roll: roll || student.roll,
        registrationNumber: registrationNumber || student.registrationNumber,
        institute: institute || student.institute,
        department: department || student.department,
        technology: technology || student.technology,
        semester: semester ? Number(semester) : student.semester,
        session: session || student.session,
        shift: shift || student.shift,
        user,
      });
    }

    const savedStudent = await this.studentRepository.save(student);
    return { student: savedStudent, user };
  }

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

