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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const otp_entity_1 = require("./entities/otp.entity");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    otpRepository;
    usersService;
    jwtService;
    constructor(otpRepository, usersService, jwtService) {
        this.otpRepository = otpRepository;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async sendLoginOtp(phone) {
        const user = await this.usersService.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.sendOtp(phone);
    }
    async sendOtp(phone) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);
        const otpRecord = this.otpRepository.create({
            phone,
            otpCode,
            expiresAt,
        });
        await this.otpRepository.save(otpRecord);
        const apiKey = process.env.BULKSMSBD_API_KEY || "UivVa73bujGUIqNCr6s6";
        const senderId = process.env.BULKSMSBD_SENDER_ID || "8809617625025";
        console.log(`[DEV OTP] Generated OTP for ${phone}: ${otpCode}`);
        if (!senderId) {
            console.warn(`[WARNING] BULKSMSBD_SENDER_ID is missing. SMS to ${phone} not sent. OTP is ${otpCode}`);
            return { message: 'OTP generated (SMS not sent due to missing Sender ID)' };
        }
        const message = encodeURIComponent(`Your OTP code is ${otpCode}. It is valid for 5 minutes.`);
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.length === 11 && formattedPhone.startsWith('01')) {
            formattedPhone = '88' + formattedPhone;
        }
        const smsUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${formattedPhone}&senderid=${senderId}&message=${message}`;
        try {
            const response = await fetch(smsUrl);
            const data = await response.json();
            if (data.response_code === 202) {
                console.log(`[SMS SUCCESS] OTP sent to ${phone}`);
            }
            else {
                console.error(`[SMS FAILED] BulkSMSBD returned code ${data.response_code}: ${data.error_message || 'Unknown Error'}`);
            }
        }
        catch (error) {
            console.error(`[SMS ERROR] Failed to call BulkSMSBD API`, error);
        }
        return { message: 'OTP request processed' };
    }
    async verifyOtp(phone, otpCode, device) {
        const otpRecord = await this.otpRepository.findOne({
            where: { phone, isUsed: false },
            order: { createdAt: 'DESC' },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid OTP or no OTP requested');
        }
        if (otpRecord.otpCode !== otpCode) {
            throw new common_1.BadRequestException('Invalid OTP code');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        otpRecord.isUsed = true;
        await this.otpRepository.save(otpRecord);
        let user = await this.usersService.findByPhone(phone);
        if (!user) {
            user = await this.usersService.create({
                phone,
                email: `${phone}@example.com`,
                name: 'New User',
                password: 'Password123!',
            });
        }
        if (user.isBanned) {
            throw new common_1.BadRequestException('User is banned');
        }
        user.lastlogin = new Date();
        let devices = user.devices || [];
        if (device && !devices.includes(device)) {
            devices.push(device);
        }
        await this.usersService.update(user.id, { lastlogin: user.lastlogin, devices });
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user,
        };
    }
    async login(email, pass, device) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !user.password) {
            throw new common_1.BadRequestException('Invalid email or password');
        }
        const isMatch = await require('bcrypt').compare(pass, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('Invalid email or password');
        }
        if (user.isBanned) {
            throw new common_1.BadRequestException('User is banned');
        }
        user.lastlogin = new Date();
        let devices = user.devices || [];
        if (device && !devices.includes(device)) {
            devices.push(device);
        }
        await this.usersService.update(user.id, { lastlogin: user.lastlogin, devices });
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user,
        };
    }
    async forgotPassword(phone) {
        const user = await this.usersService.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException('User with this phone number not found');
        }
        return this.sendOtp(phone);
    }
    async resetPassword(phone, otpCode, newPassword) {
        const otpRecord = await this.otpRepository.findOne({
            where: { phone, isUsed: false },
            order: { createdAt: 'DESC' },
        });
        if (!otpRecord) {
            throw new common_1.BadRequestException('Invalid OTP or no OTP requested');
        }
        if (otpRecord.otpCode !== otpCode) {
            throw new common_1.BadRequestException('Invalid OTP code');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        otpRecord.isUsed = true;
        await this.otpRepository.save(otpRecord);
        const user = await this.usersService.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await this.usersService.update(user.id, { password: user.password });
        return { message: 'Password has been reset successfully' };
    }
    async logout(userId, deviceToRemove) {
        const user = await this.usersService.findOne(userId);
        const devices = user.devices || [];
        const newDevices = devices.filter(d => d !== deviceToRemove);
        await this.usersService.update(user.id, { devices: newDevices });
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId) {
        const user = await this.usersService.findOne(userId);
        await this.usersService.update(user.id, { devices: [] });
        return { message: 'Logged out from all devices successfully' };
    }
    async getMe(userId) {
        return await this.usersService.findOne(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map