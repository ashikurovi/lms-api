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
let SslcommerzService = SslcommerzService_1 = class SslcommerzService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SslcommerzService_1.name);
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
            return (await response.json());
        }
        catch (error) {
            this.logger.error('SSLCOMMERZ init session failed', error);
            throw error;
        }
    }
    async validateTransaction(valId) {
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
            return (await response.json());
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
    __metadata("design:paramtypes", [config_1.ConfigService])
], SslcommerzService);
//# sourceMappingURL=sslcommerz.service.js.map