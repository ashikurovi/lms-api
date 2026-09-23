import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import { Installment, InstallmentStatus } from './entities/installment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class InstallmentService {
  constructor(
    @InjectRepository(Installment)
    private installmentRepository: Repository<Installment>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createInstallmentDto: CreateInstallmentDto) {
    const { enrollment_id, amount, due_date } = createInstallmentDto;

    // Verify enrollment exists
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollment_id },
      relations: { installments: true },
    });

    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollment_id} not found`,
      );
    }

    // Validate total installment amounts don't exceed payable
    const existingTotal = enrollment.installments.reduce(
      (sum, inst) => sum + Number(inst.amount),
      0,
    );

    if (existingTotal + amount > Number(enrollment.payable_amount)) {
      throw new BadRequestException(
        `Total installment amount (${existingTotal + amount}) would exceed payable amount (${enrollment.payable_amount})`,
      );
    }

    // Get next installment number
    const maxNumber = enrollment.installments.reduce(
      (max, inst) => Math.max(max, inst.installment_number),
      0,
    );

    const installment = this.installmentRepository.create({
      enrollment_id,
      installment_number: maxNumber + 1,
      amount,
      paid_amount: 0,
      due_amount: amount,
      due_date: new Date(due_date),
      status: InstallmentStatus.PENDING,
    });

    return await this.installmentRepository.save(installment);
  }

  async findAll(
    pageStr?: string,
    limitStr?: string,
    enrollmentId?: string,
    status?: string,
  ) {
    const page = parseInt(pageStr ?? '1', 10) || 1;
    const limit = parseInt(limitStr ?? '10', 10) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (enrollmentId) {
      where.enrollment_id = enrollmentId;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.installmentRepository.findAndCount({
      where,
      relations: { payments: true },
      skip,
      take: limit,
      order: { installment_number: 'ASC' },
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
    const installment = await this.installmentRepository.findOne({
      where: { id },
      relations: { payments: true, enrollment: true },
    });

    if (!installment) {
      throw new NotFoundException(`Installment with ID ${id} not found`);
    }

    return installment;
  }

  async update(id: string, updateInstallmentDto: UpdateInstallmentDto) {
    const installment = await this.findOne(id);

    if (updateInstallmentDto.due_date) {
      installment.due_date = new Date(updateInstallmentDto.due_date);
    }

    if (updateInstallmentDto.status) {
      installment.status = updateInstallmentDto.status;
    }

    return await this.installmentRepository.save(installment);
  }

  async remove(id: string) {
    const installment = await this.findOne(id);

    if (Number(installment.paid_amount) > 0) {
      throw new BadRequestException(
        'Cannot cancel an installment that has received payments',
      );
    }

    installment.status = InstallmentStatus.CANCELLED;
    return await this.installmentRepository.save(installment);
  }
}
