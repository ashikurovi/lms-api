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
        issueDate?: string | Date | null | undefined;
        studentId?: string | undefined;
        batchId?: string | undefined;
        courseId?: string | undefined;
        studentName?: string | undefined;
        courseName?: string | undefined;
        batchNumber?: string | undefined;
        certificateUrl?: string | undefined;
        signature1Url?: string | undefined;
        signature2Url?: string | undefined;
        signature1Name?: string | undefined;
        signature1Designation?: string | undefined;
        signature2Name?: string | undefined;
        signature2Designation?: string | undefined;
        status?: "issued" | "revoked" | undefined;
    }>;
    remove(id: string): Promise<Certificate>;
}
