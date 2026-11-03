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
exports.WalkthroughsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const walkthrough_entity_1 = require("./entities/walkthrough.entity");
let WalkthroughsService = class WalkthroughsService {
    constructor(walkthroughRepository) {
        this.walkthroughRepository = walkthroughRepository;
    }
    async create(createWalkthroughDto) {
        const item = this.walkthroughRepository.create(createWalkthroughDto);
        return await this.walkthroughRepository.save(item);
    }
    async findAll() {
        return await this.walkthroughRepository.find({
            order: {
                order: 'ASC',
                createdAt: 'DESC',
            },
        });
    }
    async findOne(id) {
        const item = await this.walkthroughRepository.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException(`Walkthrough with ID ${id} not found`);
        }
        return item;
    }
    async update(id, updateWalkthroughDto) {
        const item = await this.findOne(id);
        const updated = Object.assign(item, updateWalkthroughDto);
        return await this.walkthroughRepository.save(updated);
    }
    async remove(id) {
        const item = await this.findOne(id);
        return await this.walkthroughRepository.remove(item);
    }
};
exports.WalkthroughsService = WalkthroughsService;
exports.WalkthroughsService = WalkthroughsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(walkthrough_entity_1.Walkthrough)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WalkthroughsService);
//# sourceMappingURL=walkthroughs.service.js.map