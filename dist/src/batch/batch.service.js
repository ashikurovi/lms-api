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
exports.BatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const batch_entity_1 = require("./entities/batch.entity");
let BatchService = class BatchService {
    constructor(batchRepository) {
        this.batchRepository = batchRepository;
    }
    async onModuleInit() {
        try {
            await this.batchRepository.query(`ALTER TYPE batches_class_type_enum ADD VALUE IF NOT EXISTS 'mixed';`);
        }
        catch {
        }
    }
    async safelySaveBatch(batch, fallbackCodePrefix) {
        try {
            return await this.batchRepository.save(batch);
        }
        catch (err) {
            if (err?.code === '22P02' ||
                err?.message?.includes('batches_class_type_enum') ||
                err?.driverError?.message?.includes('batches_class_type_enum')) {
                try {
                    await this.batchRepository.query(`ALTER TYPE batches_class_type_enum ADD VALUE IF NOT EXISTS 'mixed';`);
                    return await this.batchRepository.save(batch);
                }
                catch {
                    batch.class_type = batch_entity_1.ClassType.SELF_PACED;
                    return await this.batchRepository.save(batch);
                }
            }
            if (err?.code === '23505' ||
                err?.detail?.includes('code') ||
                err?.message?.toLowerCase().includes('code') ||
                err?.message?.toLowerCase().includes('unique')) {
                batch.code = `${fallbackCodePrefix}-${Date.now().toString().slice(-4)}`;
                return await this.batchRepository.save(batch);
            }
            throw err;
        }
    }
    async generateUniqueCode(baseCode, excludeId) {
        const cleanBase = (baseCode || 'BATCH')
            .trim()
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || 'BATCH';
        let candidate = cleanBase;
        let counter = 1;
        while (true) {
            const existing = await this.batchRepository.findOne({
                where: { code: candidate },
                select: { id: true, code: true },
            });
            if (!existing || (excludeId && existing.id === excludeId)) {
                return candidate;
            }
            candidate = `${cleanBase}-${counter}`;
            counter++;
        }
    }
    async create(createBatchDto) {
        const { start_date, end_date, registration_start, registration_end, ...rest } = createBatchDto;
        const uniqueCode = await this.generateUniqueCode(createBatchDto.code || createBatchDto.name || 'BATCH');
        const batchData = {
            ...rest,
            code: uniqueCode,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            registration_start: registration_start
                ? new Date(registration_start)
                : undefined,
            registration_end: registration_end
                ? new Date(registration_end)
                : undefined,
        };
        const batch = this.batchRepository.create(batchData);
        return await this.safelySaveBatch(batch, uniqueCode);
    }
    async launch(createBatchDto) {
        const { start_date, end_date, registration_start, registration_end, ...rest } = createBatchDto;
        const uniqueCode = await this.generateUniqueCode(createBatchDto.code || createBatchDto.name || 'BATCH');
        const batchData = {
            ...rest,
            code: uniqueCode,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            registration_start: registration_start
                ? new Date(registration_start)
                : undefined,
            registration_end: registration_end
                ? new Date(registration_end)
                : undefined,
        };
        if (batchData.course_id) {
            await this.batchRepository
                .createQueryBuilder()
                .update(batch_entity_1.Batch)
                .set({ status: batch_entity_1.BatchStatus.ONGOING })
                .where('course_id = :courseId', { courseId: batchData.course_id })
                .andWhere('status IN (:...statuses)', {
                statuses: [batch_entity_1.BatchStatus.UPCOMING, batch_entity_1.BatchStatus.OPEN],
            })
                .execute();
        }
        const batch = this.batchRepository.create(batchData);
        return await this.safelySaveBatch(batch, uniqueCode);
    }
    async findAll(pageStr, limitStr, search, courseId, status, mode, mentorId) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.name = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (courseId) {
            where.course_id = courseId;
        }
        if (status) {
            where.status = status;
        }
        if (mode) {
            where.mode = mode;
        }
        if (mentorId) {
            where.course = {
                mentors: {
                    user: { id: mentorId },
                },
            };
        }
        const [items, total] = await this.batchRepository.findAndCount({
            where,
            relations: { course: true },
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
    async findOne(idOrCodeOrSlug) {
        const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrCodeOrSlug);
        let whereCondition;
        if (isUuid) {
            whereCondition = { id: idOrCodeOrSlug };
        }
        else {
            whereCondition = [
                { code: idOrCodeOrSlug },
                { course: { slug: idOrCodeOrSlug } }
            ];
        }
        const batch = await this.batchRepository.findOne({
            where: whereCondition,
            relations: {
                course: {
                    mentors: {
                        user: true
                    },
                    modules: {
                        lessons: true
                    }
                }
            },
        });
        if (!batch) {
            throw new common_1.NotFoundException(`Batch with identifier ${idOrCodeOrSlug} not found`);
        }
        return batch;
    }
    async update(id, updateBatchDto) {
        const batch = await this.findOne(id);
        let updatedCode = batch.code;
        if (updateBatchDto.code && updateBatchDto.code !== batch.code) {
            updatedCode = await this.generateUniqueCode(updateBatchDto.code, batch.id);
        }
        const updatedBatch = Object.assign(batch, {
            ...updateBatchDto,
            code: updatedCode,
            ...(updateBatchDto.start_date && {
                start_date: new Date(updateBatchDto.start_date),
            }),
            ...(updateBatchDto.end_date && {
                end_date: new Date(updateBatchDto.end_date),
            }),
            ...(updateBatchDto.registration_start !== undefined && {
                registration_start: updateBatchDto.registration_start
                    ? new Date(updateBatchDto.registration_start)
                    : null,
            }),
            ...(updateBatchDto.registration_end !== undefined && {
                registration_end: updateBatchDto.registration_end
                    ? new Date(updateBatchDto.registration_end)
                    : null,
            }),
        });
        if (updateBatchDto.course_id) {
            updatedBatch.course = { id: updateBatchDto.course_id };
        }
        return await this.safelySaveBatch(updatedBatch, updatedCode);
    }
    async remove(id) {
        const batch = await this.findOne(id);
        return await this.batchRepository.softRemove(batch);
    }
};
exports.BatchService = BatchService;
exports.BatchService = BatchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(batch_entity_1.Batch)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BatchService);
//# sourceMappingURL=batch.service.js.map