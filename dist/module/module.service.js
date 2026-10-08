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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const module_entity_1 = require("./entities/module.entity");
let ModuleService = class ModuleService {
    moduleRepository;
    constructor(moduleRepository) {
        this.moduleRepository = moduleRepository;
    }
    async create(createModuleDto) {
        const mod = this.moduleRepository.create(createModuleDto);
        return await this.moduleRepository.save(mod);
    }
    async findAll(pageStr, limitStr, search, courseId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.title = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (courseId) {
            where.course_id = courseId;
        }
        if (status) {
            where.status = status;
        }
        const [items, total] = await this.moduleRepository.findAndCount({
            where,
            relations: { course: true },
            skip,
            take: limit,
            order: { order: 'ASC', created_at: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const mod = await this.moduleRepository.findOne({
            where: { id },
            relations: { course: true },
        });
        if (!mod) {
            throw new common_1.NotFoundException(`Module with ID ${id} not found`);
        }
        return mod;
    }
    async update(id, updateModuleDto) {
        const mod = await this.findOne(id);
        const updatedModule = Object.assign(mod, updateModuleDto);
        return await this.moduleRepository.save(updatedModule);
    }
    async remove(id) {
        const mod = await this.findOne(id);
        return await this.moduleRepository.softRemove(mod);
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.CourseModule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModuleService);
//# sourceMappingURL=module.service.js.map