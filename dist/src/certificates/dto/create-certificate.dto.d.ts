export declare class CreateCertificateDto {
    studentId: string;
    batchId: string;
    courseId: string;
    studentName?: string;
    courseName?: string;
    batchNumber?: string;
    issueDate: string;
    certificateUrl?: string;
    signature1Url?: string;
    signature2Url?: string;
    signature1Name?: string;
    signature1Designation?: string;
    signature2Name?: string;
    signature2Designation?: string;
    status?: 'issued' | 'revoked';
}
export declare class BulkCreateCertificateDto {
    batchId: string;
    courseId?: string;
    issueDate?: string;
    signature1Url?: string;
    signature2Url?: string;
    signature1Name?: string;
    signature1Designation?: string;
    signature2Name?: string;
    signature2Designation?: string;
}
