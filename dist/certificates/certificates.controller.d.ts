import { HttpStatus } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto, BulkCreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    create(createCertificateDto: CreateCertificateDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/certificate.entity").Certificate;
    }>;
    createBulk(bulkDto: BulkCreateCertificateDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/certificate.entity").Certificate[];
    }>;
    findAll(page?: string, limit?: string, search?: string, batchId?: string, courseId?: string, studentId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/certificate.entity").Certificate[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/certificate.entity").Certificate;
    }>;
    update(id: string, updateCertificateDto: UpdateCertificateDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/certificate.entity").Certificate & {
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
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/certificate.entity").Certificate;
    }>;
}
