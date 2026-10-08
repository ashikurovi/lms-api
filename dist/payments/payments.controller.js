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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const config_1 = require("@nestjs/config");
let PaymentsController = class PaymentsController {
    paymentsService;
    configService;
    constructor(paymentsService, configService) {
        this.paymentsService = paymentsService;
        this.configService = configService;
    }
    async initiatePayment(createPaymentDto) {
        const data = await this.paymentsService.initiatePayment(createPaymentDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Payment initiated successfully',
            data,
        };
    }
    async handleIPN(ipnData) {
        const data = await this.paymentsService.handleIPN(ipnData);
        return data;
    }
    async handleSuccess(body, res) {
        const result = await this.paymentsService.handleSuccess(body);
        const successUrl = this.configService.get('SSLCOMMERZ_SUCCESS_URL') ||
            'http://localhost:3000/payment/success';
        return res.redirect(`${successUrl}?tran_id=${result.transaction_id}&status=${result.status}`);
    }
    async handleFail(body, res) {
        const result = await this.paymentsService.handleFail(body);
        const failUrl = this.configService.get('SSLCOMMERZ_FAIL_URL') ||
            'http://localhost:3000/payment/fail';
        return res.redirect(`${failUrl}?tran_id=${result.transaction_id}`);
    }
    async handleCancel(body, res) {
        const result = await this.paymentsService.handleCancel(body);
        const cancelUrl = this.configService.get('SSLCOMMERZ_CANCEL_URL') ||
            'http://localhost:3000/payment/cancel';
        return res.redirect(`${cancelUrl}?tran_id=${result.transaction_id}`);
    }
    async findAll(page, limit, enrollmentId, installmentId, status) {
        const data = await this.paymentsService.findAll(page, limit, enrollmentId, installmentId, status);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Payments retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.paymentsService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Payment retrieved successfully',
            data,
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('initiate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('ipn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleIPN", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('success'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleSuccess", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('fail'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleFail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('cancel'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleCancel", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('enrollment_id')),
    __param(3, (0, common_1.Query)('installment_id')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "findOne", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        config_1.ConfigService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map