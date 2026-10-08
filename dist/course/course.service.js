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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const course_entity_1 = require("./entities/course.entity");
const mentor_entity_1 = require("../mentors/entities/mentor.entity");
let CourseService = class CourseService {
    courseRepository;
    mentorRepository;
    constructor(courseRepository, mentorRepository) {
        this.courseRepository = courseRepository;
        this.mentorRepository = mentorRepository;
    }
    async create(createCourseDto) {
        const { mentor_ids, ...rest } = createCourseDto;
        const slug = rest.slug ||
            rest.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        const course = this.courseRepository.create({
            ...rest,
            slug,
            published_at: rest.status === course_entity_1.CourseStatus.PUBLISHED
                ? new Date()
                : rest.published_at
                    ? new Date(rest.published_at)
                    : null,
        });
        if (mentor_ids?.length) {
            course.mentors = await this.mentorRepository.findBy({ id: (0, typeorm_2.In)(mentor_ids) });
        }
        return await this.courseRepository.save(course);
    }
    async findAll(pageStr, limitStr, search, categoryId, status, level) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.title = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (categoryId) {
            where.category_id = categoryId;
        }
        if (status) {
            where.status = status;
        }
        if (level) {
            where.level = level;
        }
        const [items, total] = await this.courseRepository.findAndCount({
            where,
            relations: { category: true },
            skip,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(identifier) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
        const whereClause = isUuid ? { id: identifier } : { slug: identifier };
        const course = await this.courseRepository.findOne({
            where: whereClause,
            relations: { category: true, mentors: true, batches: true },
        });
        if (!course) {
            throw new common_1.NotFoundException(`Course with identifier ${identifier} not found`);
        }
        return course;
    }
    async update(id, updateCourseDto) {
        const course = await this.findOne(id);
        const { mentor_ids, ...rest } = updateCourseDto;
        let updatedSlug = course.slug;
        if (rest.slug) {
            updatedSlug = rest.slug;
        }
        else if (rest.title) {
            updatedSlug = rest.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }
        let publishedAt = course.published_at;
        if (rest.status === course_entity_1.CourseStatus.PUBLISHED &&
            course.status !== course_entity_1.CourseStatus.PUBLISHED) {
            publishedAt = new Date();
        }
        if (mentor_ids !== undefined) {
            course.mentors = mentor_ids.length
                ? await this.mentorRepository.findBy({ id: (0, typeorm_2.In)(mentor_ids) })
                : [];
        }
        const updatedCourse = Object.assign(course, rest, {
            slug: updatedSlug,
            published_at: rest.published_at
                ? new Date(rest.published_at)
                : publishedAt,
        });
        return await this.courseRepository.save(updatedCourse);
    }
    async remove(id) {
        const course = await this.findOne(id);
        return await this.courseRepository.softRemove(course);
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(1, (0, typeorm_1.InjectRepository)(mentor_entity_1.Mentor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CourseService);
//# sourceMappingURL=course.service.js.map