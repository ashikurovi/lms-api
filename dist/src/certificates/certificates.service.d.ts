import { Repository } from 'typeorm';
import { CreateCertificateDto, BulkCreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';
import { Student } from '../students/entities/student.entity';
import { Batch } from '../batch/entities/batch.entity';
import { Course } from '../course/entities/course.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
export declare class CertificatesService {
    private certificateRepository;
    private studentRepository;
    private batchRepository;
    private courseRepository;
    private enrollmentRepository;
    constructor(certificateRepository: Repository<Certificate>, studentRepository: Repository<Student>, batchRepository: Repository<Batch>, courseRepository: Repository<Course>, enrollmentRepository: Repository<Enrollment>);
    create(createCertificateDto: CreateCertificateDto): Promise<Certificate>;
    createBulk(bulkDto: BulkCreateCertificateDto): Promise<Certificate[]>;
    findAll(pageStr?: string, limitStr?: string, search?: string, batchId?: string, courseId?: string, studentId?: string, status?: string): Promise<{
        items: Certificate[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Certificate>;
    update(id: string, updateCertificateDto: UpdateCertificateDto): Promise<Certificate & {
        issueDate: Date;
        studentId?: string;
        batchId?: string;
        courseId?: string;
        studentName?: string;
        courseName?: string;
        batchNumber?: string;
        certificateUrl?: string;
        signature1Url?: string;
        signature2Url?: string;
        signature1Name?: string;
        signature1Designation?: string;
        signature2Name?: string;
        signature2Designation?: string;
        status?: "issued" | "revoked";
    }>;
    remove(id: string): Promise<Certificate>;
}
