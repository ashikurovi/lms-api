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
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lesson_entity_1 = require("./entities/lesson.entity");
let LessonService = class LessonService {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
    }
    async generateUniqueSlug(baseSlug, excludeId) {
        const cleanBase = (baseSlug || 'lesson')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || 'lesson';
        let candidate = cleanBase;
        let counter = 1;
        while (true) {
            const existing = await this.lessonRepository.findOne({
                where: { slug: candidate },
                select: { id: true, slug: true },
            });
            if (!existing || (excludeId && existing.id === excludeId)) {
                return candidate;
            }
            candidate = `${cleanBase}-${counter}`;
            counter++;
        }
    }
    async create(createLessonDto) {
        const rawSlug = createLessonDto.slug ||
            createLessonDto.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        const slug = await this.generateUniqueSlug(rawSlug);
        const lesson = this.lessonRepository.create({
            ...createLessonDto,
            slug,
        });
        try {
            return await this.lessonRepository.save(lesson);
        }
        catch (err) {
            if (err?.code === '23505' ||
                err?.detail?.includes('slug') ||
                err?.message?.toLowerCase().includes('slug') ||
                err?.message?.toLowerCase().includes('unique')) {
                lesson.slug = `${slug}-${Date.now().toString().slice(-4)}`;
                return await this.lessonRepository.save(lesson);
            }
            throw err;
        }
    }
    async findAll(pageStr, limitStr, search, moduleId, status, type) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.title = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (moduleId) {
            where.module_id = moduleId;
        }
        if (status) {
            where.status = status;
        }
        if (type) {
            where.type = type;
        }
        const [items, total] = await this.lessonRepository.findAndCount({
            where,
            relations: { module: true },
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
        const lesson = await this.lessonRepository.findOne({
            where: { id },
            relations: { module: true },
        });
        if (!lesson) {
            throw new common_1.NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async update(id, updateLessonDto) {
        const lesson = await this.findOne(id);
        let updatedSlug = lesson.slug;
        if (updateLessonDto.slug) {
            updatedSlug = updateLessonDto.slug;
        }
        else if (updateLessonDto.title) {
            updatedSlug = updateLessonDto.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }
        if (updatedSlug !== lesson.slug) {
            updatedSlug = await this.generateUniqueSlug(updatedSlug, lesson.id);
        }
        const updatedLesson = Object.assign(lesson, updateLessonDto, {
            slug: updatedSlug,
        });
        try {
            return await this.lessonRepository.save(updatedLesson);
        }
        catch (err) {
            if (err?.code === '23505' ||
                err?.detail?.includes('slug') ||
                err?.message?.toLowerCase().includes('slug') ||
                err?.message?.toLowerCase().includes('unique')) {
                updatedLesson.slug = `${updatedSlug}-${Date.now().toString().slice(-4)}`;
                return await this.lessonRepository.save(updatedLesson);
            }
            throw err;
        }
    }
    async remove(id) {
        const lesson = await this.findOne(id);
        return await this.lessonRepository.softRemove(lesson);
    }
};
exports.LessonService = LessonService;
exports.LessonService = LessonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lesson_entity_1.Lesson)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LessonService);
//# sourceMappingURL=lesson.service.js.map