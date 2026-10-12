export declare class UpdateAssignmentSubmissionDto {
    answer?: string;
    fileUrl?: string;
    status?: 'submitted' | 'reviewed' | 'resubmitted';
    marks?: number;
    feedback?: string;
}
