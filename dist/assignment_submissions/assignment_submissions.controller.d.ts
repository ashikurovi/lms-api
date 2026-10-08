import { HttpStatus } from '@nestjs/common';
import { AssignmentSubmissionsService } from './assignment_submissions.service';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment_submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment_submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
export declare class AssignmentSubmissionsController {
    private readonly submissionsService;
    constructor(submissionsService: AssignmentSubmissionsService);
    create(createSubmissionDto: CreateAssignmentSubmissionDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment_submission.entity").AssignmentSubmission;
    }>;
    findAll(page?: string, limit?: string, assignmentId?: string, studentId?: string, status?: string, req?: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/assignment_submission.entity").AssignmentSubmission[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment_submission.entity").AssignmentSubmission;
    }>;
    update(id: string, updateSubmissionDto: UpdateAssignmentSubmissionDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment_submission.entity").AssignmentSubmission & {
            reviewedBy?: string | undefined;
            reviewedAt?: Date | undefined;
            answer?: string;
            fileUrl?: string;
            status?: "submitted" | "reviewed" | "resubmitted";
            marks?: number;
            feedback?: string;
        };
    }>;
    reviewSubmission(id: string, reviewDto: ReviewSubmissionDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment_submission.entity").AssignmentSubmission & {
            reviewedBy?: string | undefined;
            reviewedAt?: Date | undefined;
            answer?: string;
            fileUrl?: string;
            status?: "submitted" | "reviewed" | "resubmitted";
            marks?: number;
            feedback?: string;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment_submission.entity").AssignmentSubmission;
    }>;
}
