import { HttpStatus } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { CreateManualEnrollmentDto } from './dto/create-manual-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
export declare class EnrollmentController {
    private readonly enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    create(createEnrollmentDto: CreateEnrollmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment | null;
    }>;
    createManual(dto: CreateManualEnrollmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment | null;
    }>;
    findAll(page?: string, limit?: string, studentId?: string, batchId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/enrollment.entity").Enrollment[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMyEnrollments(req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment[];
    }>;
    markLessonCompleted(lessonId: string, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("../lesson/entities/lesson-progress.entity").LessonProgress;
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment;
    }>;
    findAllByStudent(studentId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment[];
    }>;
    findByStudentAndBatch(studentId: string, batchId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment;
    }>;
    update(id: string, updateEnrollmentDto: UpdateEnrollmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/enrollment.entity").Enrollment;
    }>;
}
