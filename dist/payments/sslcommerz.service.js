"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SslcommerzService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SslcommerzService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let SslcommerzService = SslcommerzService_1 = class SslcommerzService {
    configService;
    httpService;
    logger = new common_1.Logger(SslcommerzService_1.name);
    storeId;
    storePassword;
    isSandbox;
    baseUrl;
    constructor(configService, httpService) {
        this.configService = configService;
        this.httpService = httpService;
        this.storeId =
            this.configService.get('SSLCOMMERZ_STORE_ID') || 'creat6ab386e0a62ad';
        this.storePassword =
            this.configService.get('SSLCOMMERZ_STORE_PASSWORD') || 'creat6ab386e0a62ad@ssl';
        this.isSandbox =
            this.configService.get('SSLCOMMERZ_IS_SANDBOX') === 'true';
        this.baseUrl = this.isSandbox
            ? 'https://sandbox.sslcommerz.com'
            : 'https://securepay.sslcommerz.com';
    }
    async initSession(params) {
        const successUrl = this.configService.get('SSLCOMMERZ_SUCCESS_URL') || 'http://localhost:3000/payment/success';
        const failUrl = this.configService.get('SSLCOMMERZ_FAIL_URL') || 'http://localhost:3000/payment/fail';
        const cancelUrl = this.configService.get('SSLCOMMERZ_CANCEL_URL') || 'http://localhost:3000/payment/cancel';
        const ipnUrl = this.configService.get('SSLCOMMERZ_IPN_URL') || '';
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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.baseUrl}/gwprocess/v4/api.php`, formData.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error('SSLCOMMERZ init session failed', error);
            throw error;
        }
    }
    async validateTransaction(valId) {
        try {
            const url = `${this.baseUrl}/validator/api/validationserverAPI.php`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                params: {
                    val_id: valId,
                    store_id: this.storeId,
                    store_passwd: this.storePassword,
                    format: 'json',
                },
            }));
            return response.data;
        }
        catch (error) {
            this.logger.error('SSLCOMMERZ validation failed', error);
            throw error;
        }
    }
    getEnvironment() {
        return this.isSandbox ? 'SANDBOX' : 'LIVE';
    }
};
exports.SslcommerzService = SslcommerzService;
exports.SslcommerzService = SslcommerzService = SslcommerzService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        axios_1.HttpService])
], SslcommerzService);
//# sourceMappingURL=sslcommerz.service.js.map