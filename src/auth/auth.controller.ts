import { Controller, Post, Get, Delete, Param, Body, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const data = await this.authService.sendOtp(sendOtpDto.phone);
    return { statusCode: HttpStatus.OK, ...data };
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const data = await this.authService.verifyOtp(verifyOtpDto.phone, verifyOtpDto.otpCode, verifyOtpDto.device);
    return { statusCode: HttpStatus.OK, message: 'Login successful', data };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: import('./dto/login.dto').LoginDto) {
    const data = await this.authService.login(loginDto.email, loginDto.password, loginDto.device);
    return { statusCode: HttpStatus.OK, message: 'Login successful', data };
  }
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: import('./dto/forgot-password.dto').ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(forgotPasswordDto.phone);
    return { statusCode: HttpStatus.OK, ...data };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: import('./dto/reset-password.dto').ResetPasswordDto) {
    const data = await this.authService.resetPassword(
      resetPasswordDto.phone,
      resetPasswordDto.otpCode,
      resetPasswordDto.newPassword
    );
    return { statusCode: HttpStatus.OK, ...data };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Request() req: any) {
    // Requires JwtAuthGuard to be active (assuming global or applied via module)
    // The decoded JWT token will be placed in req.user
    return { statusCode: HttpStatus.OK, user: req.user };
  }
  @Delete('devices/:deviceName')
  @HttpCode(HttpStatus.OK)
  async removeDevice(@Request() req: any, @Param('deviceName') deviceName: string) {
    // Requires JwtAuthGuard to be active
    const data = await this.authService.removeDevice(req.user.sub, deviceName);
    return { statusCode: HttpStatus.OK, ...data };
  }
}

