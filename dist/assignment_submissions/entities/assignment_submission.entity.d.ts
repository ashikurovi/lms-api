import { Assignment } from '../../assignments/entities/assignment.entity';
import { User } from '../../users/entities/user.entity';
export declare class AssignmentSubmission {
    id: string;
    assignmentId: string;
    assignment: Assignment;
    studentId: string;
    student: User;
    answer?: string;
    fileUrl?: string;
    submittedAt: Date;
    status: 'submitted' | 'reviewed' | 'resubmitted';
    marks?: number;
    feedback?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
}
