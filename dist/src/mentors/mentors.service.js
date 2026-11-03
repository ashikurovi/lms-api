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
exports.MentorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mentor_entity_1 = require("./entities/mentor.entity");
const user_entity_1 = require("../users/entities/user.entity");
let MentorsService = class MentorsService {
    constructor(mentorRepository) {
        this.mentorRepository = mentorRepository;
    }
    async create(createMentorDto) {
        const { userId, ...rest } = createMentorDto;
        const mentor = this.mentorRepository.create({
            ...rest,
            user: { id: userId },
        });
        return await this.mentorRepository.save(mentor);
    }
    async findAll(pageStr, limitStr, search) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = search ? { subject: (0, typeorm_2.ILike)(`%${search}%`) } : {};
        const [items, total] = await this.mentorRepository.findAndCount({
            where,
            skip,
            take: limit,
            relations: { user: true },
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
        const mentor = await this.mentorRepository.findOne({ where: { id }, relations: { user: true } });
        if (!mentor) {
            throw new common_1.NotFoundException(`Mentor with ID ${id} not found`);
        }
        return mentor;
    }
    async update(id, updateMentorDto) {
        const mentor = await this.findOne(id);
        const { name, phone, ...rest } = updateMentorDto;
        if (mentor.user) {
            let userChanged = false;
            if (name !== undefined && name.trim()) {
                mentor.user.name = name.trim();
                userChanged = true;
            }
            if (phone !== undefined) {
                mentor.user.phone = phone.trim();
                userChanged = true;
            }
            if (userChanged) {
                await this.mentorRepository.manager.save(mentor.user);
            }
        }
        const updatedMentor = Object.assign(mentor, rest);
        return await this.mentorRepository.save(updatedMentor);
    }
    async remove(id) {
        const mentor = await this.findOne(id);
        try {
            await this.mentorRepository.query(`DELETE FROM "course_mentors" WHERE "mentor_id" = $1`, [id]);
        }
        catch (err) {
            console.warn('Error clearing course_mentors:', err);
        }
        try {
            await this.mentorRepository.query(`ALTER TABLE "assignments" ALTER COLUMN "mentorId" DROP NOT NULL`);
        }
        catch { }
        try {
            await this.mentorRepository.query(`UPDATE "assignments" SET "mentorId" = NULL WHERE "mentorId" = $1`, [id]);
        }
        catch (err) {
            console.warn('Error clearing assignments mentorId:', err);
        }
        if (mentor.user?.id) {
            try {
                await this.mentorRepository.query(`UPDATE "live_schedules" SET "mentorId" = NULL WHERE "mentorId" = $1`, [mentor.user.id]);
            }
            catch { }
            try {
                await this.mentorRepository.query(`UPDATE "resources" SET "mentorId" = NULL WHERE "mentorId" = $1`, [mentor.user.id]);
            }
            catch { }
        }
        const result = await this.mentorRepository.remove(mentor);
        if (mentor.user) {
            try {
                if (mentor.user.role === user_entity_1.UserRole.MENTOR) {
                    mentor.user.role = user_entity_1.UserRole.STUDENT;
                    await this.mentorRepository.manager.save(mentor.user);
                }
            }
            catch (err) {
                console.warn('Error updating user role:', err);
            }
        }
        return result;
    }
    async ban(id) {
        const mentor = await this.findOne(id);
        if (mentor.user) {
            mentor.user.isBanned = true;
            mentor.user.bannedAt = new Date();
            await this.mentorRepository.manager.save(mentor.user);
        }
        return mentor;
    }
    async unban(id) {
        const mentor = await this.findOne(id);
        if (mentor.user) {
            mentor.user.isBanned = false;
            mentor.user.bannedAt = null;
            await this.mentorRepository.manager.save(mentor.user);
        }
        return mentor;
    }
};
exports.MentorsService = MentorsService;
exports.MentorsService = MentorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(mentor_entity_1.Mentor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MentorsService);
//# sourceMappingURL=mentors.service.js.map