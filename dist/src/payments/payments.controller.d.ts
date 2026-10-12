import { HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly configService;
    constructor(paymentsService: PaymentsService, configService: ConfigService);
    initiatePayment(createPaymentDto: CreatePaymentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            payment_id: string;
            transaction_id: string;
            gateway_url: string;
            sessionkey: string;
        };
    }>;
    handleIPN(ipnData: any): Promise<{
        message: string;
    }>;
    handleSuccess(body: any, res: Response): Promise<void>;
    handleFail(body: any, res: Response): Promise<void>;
    handleCancel(body: any, res: Response): Promise<void>;
    findAll(page?: string, limit?: string, enrollmentId?: string, installmentId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/payment.entity").Payment[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/payment.entity").Payment;
    }>;
}
