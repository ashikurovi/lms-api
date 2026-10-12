export declare class CreateAssignmentDto {
    batchId: string;
    mentorId?: string;
    title: string;
    description: string;
    attachmentUrl?: string;
    totalMarks?: number;
    dueAt?: string;
    status?: 'draft' | 'published' | 'closed';
}
