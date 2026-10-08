import { Repository, DataSource } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { Installment } from '../installment/entities/installment.entity';
import { Enrollment } from '../enrollment/entities/enrollment.entity';
import { SslcommerzService } from './sslcommerz.service';
export declare class PaymentsService {
    private paymentRepository;
    private installmentRepository;
    private enrollmentRepository;
    private sslcommerzService;
    private dataSource;
    private readonly logger;
    constructor(paymentRepository: Repository<Payment>, installmentRepository: Repository<Installment>, enrollmentRepository: Repository<Enrollment>, sslcommerzService: SslcommerzService, dataSource: DataSource);
    initiatePayment(createPaymentDto: CreatePaymentDto): Promise<{
        payment_id: string;
        transaction_id: string;
        gateway_url: string;
        sessionkey: string;
    }>;
    handleIPN(ipnData: any): Promise<{
        message: string;
    }>;
    handleSuccess(queryData: any): Promise<{
        message: string;
        status: string;
        transaction_id?: undefined;
    } | {
        message: string;
        transaction_id: any;
        status: string;
    }>;
    handleFail(queryData: any): Promise<{
        message: string;
        transaction_id: any;
    }>;
    handleCancel(queryData: any): Promise<{
        message: string;
        transaction_id: any;
    }>;
    findAll(pageStr?: string, limitStr?: string, enrollmentId?: string, installmentId?: string, status?: string): Promise<{
        items: Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Payment>;
}
