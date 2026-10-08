import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
export interface SslcommerzInitResponse {
    status: string;
    faession: string;
    GatewayPageURL: string;
    redirectGatewayURL: string;
    sessionkey: string;
}
export interface SslcommerzValidationResponse {
    status: string;
    tran_date: string;
    tran_id: string;
    val_id: string;
    amount: string;
    store_amount: string;
    card_type: string;
    card_no: string;
    bank_tran_id: string;
    currency: string;
    risk_level: string;
    risk_title: string;
}
export declare class SslcommerzService {
    private configService;
    private httpService;
    private readonly logger;
    private readonly storeId;
    private readonly storePassword;
    private readonly isSandbox;
    private readonly baseUrl;
    constructor(configService: ConfigService, httpService: HttpService);
    initSession(params: {
        total_amount: number;
        tran_id: string;
        cus_name: string;
        cus_email: string;
        cus_phone: string;
        product_name: string;
        product_category: string;
    }): Promise<SslcommerzInitResponse>;
    validateTransaction(valId: string): Promise<SslcommerzValidationResponse>;
    getEnvironment(): 'SANDBOX' | 'LIVE';
}
