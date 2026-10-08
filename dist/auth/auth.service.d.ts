import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Otp } from './entities/otp.entity';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly otpRepository;
    private readonly usersService;
    private readonly jwtService;
    constructor(otpRepository: Repository<Otp>, usersService: UsersService, jwtService: JwtService);
    sendLoginOtp(phone: string): Promise<{
        message: string;
    }>;
    sendOtp(phone: string): Promise<{
        message: string;
    }>;
    verifyOtp(phone: string, otpCode: string, device?: string): Promise<{
        access_token: string;
        user: import("../users/entities/user.entity").User;
    }>;
    login(email: string, pass: string, device?: string): Promise<{
        access_token: string;
        user: import("../users/entities/user.entity").User;
    }>;
    forgotPassword(phone: string): Promise<{
        message: string;
    }>;
    resetPassword(phone: string, otpCode: string, newPassword: string): Promise<{
        message: string;
    }>;
    logout(userId: string, deviceToRemove: string): Promise<{
        message: string;
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<import("../users/entities/user.entity").User>;
}
