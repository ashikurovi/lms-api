import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, ILike } from 'typeorm';
import { randomBytes } from 'crypto';
import { CreateCertificateDto, BulkCreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';
import { Student } from '../students/entities/student.entity';
import { Batch } from '../batch/entities/batch.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto) {
    let { issueDate, studentName, courseName, batchNumber, studentId, courseId, batchId, ...rest } = createCertificateDto;

    if (!studentName) {
      const student = await this.studentRepository.findOne({ where: { id: studentId } });
      if (!student) throw new NotFoundException('Student not found');
      studentName = student.name;
    }

    if (!courseName) {
      const course = await this.courseRepository.findOne({ where: { id: courseId } });
      if (!course) throw new NotFoundException('Course not found');
      courseName = course.title;
    }

    if (!batchNumber) {
      const batch = await this.batchRepository.findOne({ where: { id: batchId } });
      if (!batch) throw new NotFoundException('Batch not found');
      batchNumber = batch.name;
    }

    const certData: DeepPartial<Certificate> = {
      ...rest,
      studentId,
      courseId,
      batchId,
      studentName,
      courseName,
      batchNumber,
      issueDate: new Date(issueDate),
      certificateNumber: `CERT-${randomBytes(4).toString('hex').toUpperCase()}`,
      verificationCode: randomBytes(8).toString('hex').toUpperCase(),
    };

    const certificate = this.certificateRepository.create(certData);
    return await this.certificateRepository.save(certificate);
  }

  async createBulk(bulkDto: BulkCreateCertificateDto) {
    const { 
      batchId, 
      courseId: providedCourseId, 
      issueDate,
      signature1Url,
      signature2Url,
      signature1Name,
      signature1Designation,
      signature2Name,
      signature2Designation
    } = bulkDto;
    const finalIssueDate = issueDate ? new Date(issueDate) : new Date();

    const batch = await this.batchRepository.findOne({ where: { id: batchId }, relations: { course: true } });
    if (!batch) throw new NotFoundException('Batch not found');

    let course;
    if (providedCourseId) {
      course = await this.courseRepository.findOne({ where: { id: providedCourseId } });
    } else {
      course = batch.course || await this.courseRepository.findOne({ where: { id: batch.course_id } });
    }
    if (!course) throw new NotFoundException('Course not found for this batch');

    const enrollments = await this.enrollmentRepository.find({
      where: { batch_id: batchId, status: 'ACTIVE' as any }, // adjust status if needed
      relations: { student: true },
    });

    if (enrollments.length === 0) {
      throw new NotFoundException('No active enrollments found for this batch');
    }

    const certsData: DeepPartial<Certificate>[] = [];
    for (const enrollment of enrollments) {
      certsData.push({
        studentId: enrollment.student_id,
        courseId: course.id,
        batchId: batch.id,
        studentName: enrollment.student?.name || 'Unknown Student',
        courseName: course.title,
        batchNumber: batch.name,
        issueDate: finalIssueDate,
        signature1Url,
        signature2Url,
        signature1Name,
        signature1Designation,
        signature2Name,
        signature2Designation,
        certificateNumber: `CERT-${randomBytes(4).toString('hex').toUpperCase()}`,
        verificationCode: randomBytes(8).toString('hex').toUpperCase(),
      });
    }

    const certificates = this.certificateRepository.create(certsData);
    return await this.certificateRepository.save(certificates);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    search?: string,
    batchId?: string,
    courseId?: string,
    studentId?: string,
    status?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.studentName = ILike(`%${search}%`);
    }
    if (batchId) {
      where.batchId = batchId;
    }
    if (courseId) {
      where.courseId = courseId;
    }
    if (studentId) {
      where.studentId = studentId;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.certificateRepository.findAndCount({
      where,
      relations: { student: true, batch: true, course: true },
      skip,
      take: limit,
      order: { issueDate: 'DESC' },
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
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: { student: true, batch: true, course: true },
    });
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }
    return certificate;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    const certificate = await this.findOne(id);
    const updatedCertificate = Object.assign(certificate, {
      ...updateCertificateDto,
      ...(updateCertificateDto.issueDate !== undefined && {
        issueDate: updateCertificateDto.issueDate
          ? new Date(updateCertificateDto.issueDate)
          : null,
      }),
    });
    return await this.certificateRepository.save(updatedCertificate);
  }

  async remove(id: string) {
    const certificate = await this.findOne(id);
    return await this.certificateRepository.remove(certificate);
  }
}
