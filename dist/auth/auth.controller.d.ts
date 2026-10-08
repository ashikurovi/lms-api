import { HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtp(sendOtpDto: SendOtpDto): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto, userAgent: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            access_token: string;
            user: import("../users/entities/user.entity").User;
        };
    }>;
    login(loginDto: import('./dto/login.dto').LoginDto, userAgent: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            access_token: string;
            user: import("../users/entities/user.entity").User;
        };
    }>;
    forgotPassword(forgotPasswordDto: import('./dto/forgot-password.dto').ForgotPasswordDto): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
    resetPassword(resetPasswordDto: import('./dto/reset-password.dto').ResetPasswordDto): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
    getMe(req: any): Promise<{
        statusCode: HttpStatus;
        user: {
            isDeviceLocked: boolean;
            id: string;
            name: string;
            email: string;
            password?: string;
            role: import("../users/entities/user.entity").UserRole;
            phone: string;
            avatar: string;
            lastlogin: Date;
            devices: string[];
            isBanned: boolean;
            bannedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
        };
    }>;
    logout(req: any, userAgent: string, bodyDevice?: string): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
    logoutAll(req: any): Promise<{
        message: string;
        statusCode: HttpStatus;
    }>;
}
