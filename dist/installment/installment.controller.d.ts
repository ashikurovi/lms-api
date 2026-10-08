import { HttpStatus } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';
export declare class InstallmentController {
    private readonly installmentService;
    constructor(installmentService: InstallmentService);
    create(createInstallmentDto: CreateInstallmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/installment.entity").Installment;
    }>;
    findAll(page?: string, limit?: string, enrollmentId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/installment.entity").Installment[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/installment.entity").Installment;
    }>;
    update(id: string, updateInstallmentDto: UpdateInstallmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/installment.entity").Installment;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/installment.entity").Installment;
    }>;
}
