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
exports.LiveSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const live_schedule_entity_1 = require("./entities/live_schedule.entity");
let LiveSchedulesService = class LiveSchedulesService {
    liveScheduleRepository;
    constructor(liveScheduleRepository) {
        this.liveScheduleRepository = liveScheduleRepository;
    }
    async create(createLiveScheduleDto) {
        const { startTime, endTime, ...rest } = createLiveScheduleDto;
        const scheduleData = {
            ...rest,
            startTime: new Date(startTime),
            endTime: endTime ? new Date(endTime) : undefined,
        };
        const schedule = this.liveScheduleRepository.create(scheduleData);
        return await this.liveScheduleRepository.save(schedule);
    }
    async findAll(pageStr, limitStr, search, batchId, mentorId, status) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.title = (0, typeorm_2.ILike)(`%${search}%`);
        }
        if (batchId) {
            where.batchId = batchId;
        }
        if (mentorId) {
            where.mentorId = mentorId;
        }
        if (status) {
            where.status = status;
        }
        const [items, total] = await this.liveScheduleRepository.findAndCount({
            where,
            relations: { batch: true, mentor: true, creator: true },
            skip,
            take: limit,
            order: { startTime: 'ASC' },
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
        const schedule = await this.liveScheduleRepository.findOne({
            where: { id },
            relations: { batch: true, mentor: true, creator: true },
        });
        if (!schedule) {
            throw new common_1.NotFoundException(`Live schedule with ID ${id} not found`);
        }
        return schedule;
    }
    async update(id, updateLiveScheduleDto) {
        const schedule = await this.findOne(id);
        const updatedSchedule = Object.assign(schedule, {
            ...updateLiveScheduleDto,
            ...(updateLiveScheduleDto.startTime && {
                startTime: new Date(updateLiveScheduleDto.startTime),
            }),
            ...(updateLiveScheduleDto.endTime !== undefined && {
                endTime: updateLiveScheduleDto.endTime
                    ? new Date(updateLiveScheduleDto.endTime)
                    : null,
            }),
        });
        return await this.liveScheduleRepository.save(updatedSchedule);
    }
    async remove(id) {
        const schedule = await this.findOne(id);
        return await this.liveScheduleRepository.remove(schedule);
    }
};
exports.LiveSchedulesService = LiveSchedulesService;
exports.LiveSchedulesService = LiveSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(live_schedule_entity_1.LiveSchedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LiveSchedulesService);
//# sourceMappingURL=live_schedules.service.js.map