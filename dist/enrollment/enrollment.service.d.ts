import { Repository, DataSource } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { CreateManualEnrollmentDto } from './dto/create-manual-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';
import { Installment } from '../installment/entities/installment.entity';
import { LessonProgress } from '../lesson/entities/lesson-progress.entity';
export declare class EnrollmentService {
    private enrollmentRepository;
    private installmentRepository;
    private lessonProgressRepository;
    private dataSource;
    constructor(enrollmentRepository: Repository<Enrollment>, installmentRepository: Repository<Installment>, lessonProgressRepository: Repository<LessonProgress>, dataSource: DataSource);
    markLessonCompleted(studentId: string, lessonId: string): Promise<LessonProgress>;
    create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment | null>;
    createManual(dto: CreateManualEnrollmentDto): Promise<Enrollment | null>;
    findAll(pageStr?: string, limitStr?: string, studentId?: string, batchId?: string, status?: string): Promise<{
        items: Enrollment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Enrollment>;
    findByStudentAndBatch(studentId: string, batchId: string): Promise<Enrollment>;
    findAllByStudent(studentId: string): Promise<Enrollment[]>;
    update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment>;
    remove(id: string): Promise<Enrollment>;
    getStudentIdByUserId(userId: string): Promise<string>;
}
