import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export interface SslcommerzInitResponse {
  status: string;
  faession: string; // session key
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

@Injectable()
export class SslcommerzService {
  private readonly logger = new Logger(SslcommerzService.name);
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isSandbox: boolean;
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
  ) {
    this.storeId =
      this.configService.get<string>('SSLCOMMERZ_STORE_ID') || 'creat6ab386e0a62ad';
    this.storePassword =
      this.configService.get<string>('SSLCOMMERZ_STORE_PASSWORD') || 'creat6ab386e0a62ad@ssl';
    this.isSandbox =
      this.configService.get<string>('SSLCOMMERZ_IS_SANDBOX') === 'true';
    this.baseUrl = this.isSandbox
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com';
  }

  async initSession(params: {
    total_amount: number;
    tran_id: string;
    cus_name: string;
    cus_email: string;
    cus_phone: string;
    product_name: string;
    product_category: string;
  }): Promise<SslcommerzInitResponse> {
    const successUrl =
      this.configService.get<string>('SSLCOMMERZ_SUCCESS_URL') || 'http://localhost:3000/payment/success';
    const failUrl =
      this.configService.get<string>('SSLCOMMERZ_FAIL_URL') || 'http://localhost:3000/payment/fail';
    const cancelUrl =
      this.configService.get<string>('SSLCOMMERZ_CANCEL_URL') || 'http://localhost:3000/payment/cancel';
    const ipnUrl =
      this.configService.get<string>('SSLCOMMERZ_IPN_URL') || '';

    const formData = new URLSearchParams({
      store_id: this.storeId,
      store_passwd: this.storePassword,
      total_amount: params.total_amount.toString(),
      currency: 'BDT',
      tran_id: params.tran_id,
      success_url: successUrl,
      fail_url: failUrl,
      cancel_url: cancelUrl,
      ipn_url: ipnUrl,
      shipping_method: 'NO',
      product_name: params.product_name,
      product_category: params.product_category,
      product_profile: 'non-physical-goods',
      cus_name: params.cus_name,
      cus_email: params.cus_email,
      cus_phone: params.cus_phone || 'N/A',
      cus_add1: 'N/A',
      cus_city: 'N/A',
      cus_country: 'Bangladesh',
    });

    try {
      const response = await fetch(`${this.baseUrl}/gwprocess/v4/api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as SslcommerzInitResponse;
    } catch (error) {
      this.logger.error('SSLCOMMERZ init session failed', error);
      throw error;
    }
  }

  async validateTransaction(
    valId: string,
  ): Promise<SslcommerzValidationResponse> {
    try {
      const url = new URL(`${this.baseUrl}/validator/api/validationserverAPI.php`);
      url.searchParams.append('val_id', valId);
      url.searchParams.append('store_id', this.storeId);
      url.searchParams.append('store_passwd', this.storePassword);
      url.searchParams.append('format', 'json');

      const response = await fetch(url.toString(), {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as SslcommerzValidationResponse;
    } catch (error) {
      this.logger.error('SSLCOMMERZ validation failed', error);
      throw error;
    }
  }

  getEnvironment(): 'SANDBOX' | 'LIVE' {
    return this.isSandbox ? 'SANDBOX' : 'LIVE';
  }
}
