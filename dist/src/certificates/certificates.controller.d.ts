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
            issueDate: Date;
            studentId?: string;
            batchId?: string;
            courseId?: string;
            studentName?: string;
            courseName?: string;
            batchNumber?: string;
            certificateUrl?: string;
            signature1Url?: string;
            signature2Url?: string;
            signature1Name?: string;
            signature1Designation?: string;
            signature2Name?: string;
            signature2Designation?: string;
            status?: "issued" | "revoked";
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/certificate.entity").Certificate;
    }>;
}
