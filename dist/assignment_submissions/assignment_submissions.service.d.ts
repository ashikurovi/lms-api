import { Repository, DataSource } from 'typeorm';
import { CreateAssignmentSubmissionDto } from './dto/create-assignment_submission.dto';
import { UpdateAssignmentSubmissionDto } from './dto/update-assignment_submission.dto';
import { AssignmentSubmission } from './entities/assignment_submission.entity';
export declare class AssignmentSubmissionsService {
    private submissionRepository;
    private dataSource;
    constructor(submissionRepository: Repository<AssignmentSubmission>, dataSource: DataSource);
    create(createSubmissionDto: CreateAssignmentSubmissionDto, userId?: string): Promise<AssignmentSubmission>;
    findAll(pageStr?: string, limitStr?: string, assignmentId?: string, studentId?: string, status?: string, user?: any): Promise<{
        items: AssignmentSubmission[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<AssignmentSubmission>;
    update(id: string, updateSubmissionDto: UpdateAssignmentSubmissionDto, reviewerId?: string): Promise<AssignmentSubmission & {
        reviewedBy?: string | undefined;
        reviewedAt?: Date | undefined;
        answer?: string;
        fileUrl?: string;
        status?: "submitted" | "reviewed" | "resubmitted";
        marks?: number;
        feedback?: string;
    }>;
    remove(id: string): Promise<AssignmentSubmission>;
}
