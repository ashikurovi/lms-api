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
exports.CtagoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ctagory_entity_1 = require("./entities/ctagory.entity");
let CtagoriesService = class CtagoriesService {
    courseCategoryRepository;
    constructor(courseCategoryRepository) {
        this.courseCategoryRepository = courseCategoryRepository;
    }
    async create(createCourseCategoryDto) {
        const slug = createCourseCategoryDto.slug ||
            createCourseCategoryDto.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        if (createCourseCategoryDto.parent_id) {
            const parent = await this.courseCategoryRepository.findOne({
                where: { id: createCourseCategoryDto.parent_id },
            });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category with ID ${createCourseCategoryDto.parent_id} not found`);
            }
        }
        const category = this.courseCategoryRepository.create({
            ...createCourseCategoryDto,
            slug,
        });
        return await this.courseCategoryRepository.save(category);
    }
    async findAll(pageStr, limitStr, search, parentId) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (parentId) {
            where.parent_id = parentId;
        }
        else if (parentId === null || parentId === 'null') {
            where.parent_id = (0, typeorm_2.IsNull)();
        }
        const [items, total] = await this.courseCategoryRepository.findAndCount({
            where,
            relations: { children: true, parent: true },
            skip,
            take: limit,
            order: { sort_order: 'ASC', name: 'ASC' },
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
        const category = await this.courseCategoryRepository.findOne({
            where: { id },
            relations: { children: true, parent: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Course category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updateCourseCategoryDto) {
        const category = await this.findOne(id);
        let updatedSlug = category.slug;
        if (updateCourseCategoryDto.slug) {
            updatedSlug = updateCourseCategoryDto.slug;
        }
        else if (updateCourseCategoryDto.name) {
            updatedSlug = updateCourseCategoryDto.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }
        if (updateCourseCategoryDto.parent_id) {
            if (updateCourseCategoryDto.parent_id === id) {
                throw new common_1.NotFoundException('A category cannot be its own parent');
            }
            const parent = await this.courseCategoryRepository.findOne({
                where: { id: updateCourseCategoryDto.parent_id },
            });
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category with ID ${updateCourseCategoryDto.parent_id} not found`);
            }
        }
        const updatedCategory = Object.assign(category, updateCourseCategoryDto, {
            slug: updatedSlug,
        });
        return await this.courseCategoryRepository.save(updatedCategory);
    }
    async remove(id) {
        const category = await this.findOne(id);
        return await this.courseCategoryRepository.softRemove(category);
    }
};
exports.CtagoriesService = CtagoriesService;
exports.CtagoriesService = CtagoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ctagory_entity_1.CourseCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CtagoriesService);
//# sourceMappingURL=ctagories.service.js.map