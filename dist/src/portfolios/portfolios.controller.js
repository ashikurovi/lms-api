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
exports.PortfoliosController = void 0;
const common_1 = require("@nestjs/common");
const portfolios_service_1 = require("./portfolios.service");
const create_portfolio_dto_1 = require("./dto/create-portfolio.dto");
const update_portfolio_dto_1 = require("./dto/update-portfolio.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let PortfoliosController = class PortfoliosController {
    constructor(portfoliosService) {
        this.portfoliosService = portfoliosService;
    }
    async create(createPortfolioDto) {
        const data = await this.portfoliosService.create(createPortfolioDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Portfolio item created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.portfoliosService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Portfolios retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.portfoliosService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Portfolio retrieved successfully',
            data,
        };
    }
    async update(id, updatePortfolioDto) {
        const data = await this.portfoliosService.update(id, updatePortfolioDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Portfolio updated successfully',
            data,
        };
    }
    async remove(id) {
        const data = await this.portfoliosService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Portfolio deleted successfully',
            data,
        };
    }
};
exports.PortfoliosController = PortfoliosController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_portfolio_dto_1.CreatePortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "findOne", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_portfolio_dto_1.UpdatePortfolioDto]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PortfoliosController.prototype, "remove", null);
exports.PortfoliosController = PortfoliosController = __decorate([
    (0, common_1.Controller)('portfolios'),
    __metadata("design:paramtypes", [portfolios_service_1.PortfoliosService])
], PortfoliosController);
//# sourceMappingURL=portfolios.controller.js.map