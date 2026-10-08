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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./entities/student.entity");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
let StudentsService = class StudentsService {
    studentRepository;
    usersService;
    constructor(studentRepository, usersService) {
        this.studentRepository = studentRepository;
        this.usersService = usersService;
    }
    async checkStudent(query) {
        const { phone, roll, registrationNumber } = query;
        if (!phone && !roll && !registrationNumber) {
            return { exists: false, message: 'Please provide phone, roll, or registration number to verify.' };
        }
        let student = null;
        const whereConditions = [];
        if (phone)
            whereConditions.push({ phone });
        if (roll)
            whereConditions.push({ roll });
        if (registrationNumber)
            whereConditions.push({ registrationNumber });
        if (whereConditions.length > 0) {
            student = await this.studentRepository.findOne({
                where: whereConditions,
                relations: { user: true },
            });
        }
        let user = null;
        if (phone) {
            user = await this.usersService.findByPhone(phone);
        }
        const exists = !!(student || user);
        return {
            exists,
            student,
            userExists: !!user,
            message: exists ? 'Record found in database.' : 'Record not found in database.',
        };
    }
    async registerStudent(registerDto) {
        const { email, phone, name, password, roll, registrationNumber, institute, department, technology, semester, session, shift } = registerDto;
        if (!email || !name) {
            throw new common_1.BadRequestException('Email and Name are required for registration.');
        }
        let user = await this.usersService.findByEmail(email);
        if (!user && phone) {
            user = await this.usersService.findByPhone(phone);
        }
        if (!user) {
            const rawPassword = password || 'Password123!';
            user = await this.usersService.create({
                name,
                email,
                phone: phone || '',
                password: rawPassword,
                role: user_entity_1.UserRole.STUDENT,
            });
        }
        let student = await this.studentRepository.findOne({ where: { email } });
        if (!student && phone) {
            student = await this.studentRepository.findOne({ where: { phone } });
        }
        if (!student) {
            student = this.studentRepository.create({
                name,
                email,
                phone,
                roll,
                registrationNumber,
                institute,
                department,
                technology,
                semester: semester ? Number(semester) : undefined,
                session,
                shift,
                user,
            });
        }
        else {
            Object.assign(student, {
                name,
                roll: roll || student.roll,
                registrationNumber: registrationNumber || student.registrationNumber,
                institute: institute || student.institute,
                department: department || student.department,
                technology: technology || student.technology,
                semester: semester ? Number(semester) : student.semester,
                session: session || student.session,
                shift: shift || student.shift,
                user,
            });
        }
        const savedStudent = await this.studentRepository.save(student);
        return { student: savedStudent, user };
    }
    async create(createStudentDto) {
        const { userId, ...rest } = createStudentDto;
        const student = this.studentRepository.create({
            ...rest,
            ...(userId && { user: { id: userId } }),
        });
        return await this.studentRepository.save(student);
    }
    async findAll(pageStr, limitStr, search) {
        const page = parseInt(pageStr ?? '1', 10) || 1;
        const limit = parseInt(limitStr ?? '10', 10) || 10;
        const skip = (page - 1) * limit;
        const where = search ? { name: (0, typeorm_2.ILike)(`%${search}%`) } : {};
        const [items, total] = await this.studentRepository.findAndCount({
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
        const student = await this.studentRepository.findOne({ where: { id }, relations: { user: true } });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }
    async findByUserId(userId) {
        const student = await this.studentRepository.findOne({ where: { user: { id: userId } }, relations: { user: true } });
        if (!student) {
            throw new common_1.NotFoundException(`Student profile not found for user ID ${userId}`);
        }
        return student;
    }
    async update(id, updateStudentDto) {
        const student = await this.findOne(id);
        const updatedStudent = Object.assign(student, updateStudentDto);
        return await this.studentRepository.save(updatedStudent);
    }
    async remove(id) {
        const student = await this.findOne(id);
        return await this.studentRepository.remove(student);
    }
    async ban(id) {
        const student = await this.findOne(id);
        if (student.user) {
            student.user.isBanned = true;
            student.user.bannedAt = new Date();
            await this.studentRepository.manager.save(student.user);
        }
        return student;
    }
    async unban(id) {
        const student = await this.findOne(id);
        if (student.user) {
            student.user.isBanned = false;
            student.user.bannedAt = null;
            await this.studentRepository.manager.save(student.user);
        }
        return student;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], StudentsService);
//# sourceMappingURL=students.service.js.map