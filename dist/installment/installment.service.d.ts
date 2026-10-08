import { Repository } from 'typeorm';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
import { Installment } from './entities/installment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
export declare class InstallmentService {
    private installmentRepository;
    private enrollmentRepository;
    constructor(installmentRepository: Repository<Installment>, enrollmentRepository: Repository<Enrollment>);
    create(createInstallmentDto: CreateInstallmentDto): Promise<Installment>;
    findAll(pageStr?: string, limitStr?: string, enrollmentId?: string, status?: string): Promise<{
        items: Installment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Installment>;
    update(id: string, updateInstallmentDto: UpdateInstallmentDto): Promise<Installment>;
    remove(id: string): Promise<Installment>;
}
