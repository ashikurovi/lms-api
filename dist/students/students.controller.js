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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async create(createStudentDto, file) {
        if (file) {
            const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;
            createStudentDto.profileImage = fileUrl;
        }
        const data = await this.studentsService.create(createStudentDto);
        return { statusCode: common_1.HttpStatus.CREATED, message: 'Student created successfully', data };
    }
    async findAll(page, limit, search) {
        const data = await this.studentsService.findAll(page, limit, search);
        return { statusCode: common_1.HttpStatus.OK, message: 'Students retrieved successfully', data };
    }
    async checkStudent(phone, roll, registrationNumber) {
        const data = await this.studentsService.checkStudent({ phone, roll, registrationNumber });
        return { statusCode: common_1.HttpStatus.OK, ...data };
    }
    async registerStudent(registerDto) {
        const data = await this.studentsService.registerStudent(registerDto);
        return { statusCode: common_1.HttpStatus.CREATED, message: 'Student registered successfully', data };
    }
    async findOne(id) {
        if (id === 'my')
            return;
        const data = await this.studentsService.findOne(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student retrieved successfully', data };
    }
    async getMyProfile(req) {
        const userId = req.user.id;
        const student = await this.studentsService.findByUserId(userId);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student profile retrieved successfully', data: student };
    }
    async updateMyProfile(req, updateStudentDto, file) {
        const userId = req.user.id;
        const student = await this.studentsService.findByUserId(userId);
        if (file) {
            const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;
            updateStudentDto.profileImage = fileUrl;
        }
        const data = await this.studentsService.update(student.id, updateStudentDto);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student profile updated successfully', data };
    }
    async update(id, updateStudentDto, file) {
        if (file) {
            const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;
            updateStudentDto.profileImage = fileUrl;
        }
        const data = await this.studentsService.update(id, updateStudentDto);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student updated successfully', data };
    }
    async ban(id) {
        const data = await this.studentsService.ban(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student banned successfully', data };
    }
    async unban(id) {
        const data = await this.studentsService.unban(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student unbanned successfully', data };
    }
    async remove(id) {
        const data = await this.studentsService.remove(id);
        return { statusCode: common_1.HttpStatus.OK, message: 'Student deleted successfully', data };
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)('phone')),
    __param(1, (0, common_1.Query)('roll')),
    __param(2, (0, common_1.Query)('registrationNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "checkStudent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "registerStudent", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('profile/my'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.STUDENT, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('profile/my'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.STUDENT, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_student_dto_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                return cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/ban'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "ban", null);
__decorate([
    (0, common_1.Patch)(':id/unban'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "unban", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MODERATOR, user_entity_1.UserRole.DEVELOPER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "remove", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map