import { Student } from '../../students/entities/student.entity';
import { Batch } from '../../batch/entities/batch.entity';
import { Course } from '../../course/entities/course.entity';
export declare class Certificate {
    id: string;
    studentId: string;
    student: Student;
    batchId: string;
    batch: Batch;
    courseId: string;
    course: Course;
    certificateNumber: string;
    verificationCode: string;
    studentName: string;
    courseName: string;
    batchNumber: string;
    issueDate: Date;
    certificateUrl?: string;
    signature1Url?: string;
    signature2Url?: string;
    signature1Name?: string;
    signature1Designation?: string;
    signature2Name?: string;
    signature2Designation?: string;
    status: 'issued' | 'revoked';
    createdAt: Date;
    updatedAt: Date;
}
