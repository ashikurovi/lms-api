import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, ILike } from 'typeorm';
import { randomBytes } from 'crypto';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  async create(createCertificateDto: CreateCertificateDto) {
    const { issueDate, ...rest } = createCertificateDto;

    const certData: DeepPartial<Certificate> = {
      ...rest,
      issueDate: new Date(issueDate),
      certificateNumber: `CERT-${randomBytes(4).toString('hex').toUpperCase()}`,
      verificationCode: randomBytes(8).toString('hex').toUpperCase(),
    };

    const certificate = this.certificateRepository.create(certData);
    return await this.certificateRepository.save(certificate);
  }

  async createBulk(createCertificateDtos: CreateCertificateDto[]) {
    const certsData = createCertificateDtos.map((dto) => {
      const { issueDate, ...rest } = dto;
      return {
        ...rest,
        issueDate: new Date(issueDate),
        certificateNumber: `CERT-${randomBytes(4).toString('hex').toUpperCase()}`,
        verificationCode: randomBytes(8).toString('hex').toUpperCase(),
      };
    });

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
