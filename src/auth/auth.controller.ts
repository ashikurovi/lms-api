import { Controller, Post, Get, Delete, Param, Body, Request, HttpCode, HttpStatus, Headers } from '@nestjs/common';
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
    const data = await this.authService.sendLoginOtp(sendOtpDto.phone);
    return { statusCode: HttpStatus.OK, ...data };
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Headers('user-agent') userAgent: string,
  ) {
    const device = verifyOtpDto.device || userAgent || 'Unknown Device';
    const data = await this.authService.verifyOtp(verifyOtpDto.phone, verifyOtpDto.otpCode, device);
    return { statusCode: HttpStatus.OK, message: 'Login successful', data };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: import('./dto/login.dto').LoginDto,
    @Headers('user-agent') userAgent: string,
  ) {
    const device = loginDto.device || userAgent || 'Unknown Device';
    const data = await this.authService.login(loginDto.email, loginDto.password, device);
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
    const user = await this.authService.getMe(req.user.id);
    const isDeviceLocked = (user.devices || []).length > 3;
    return { statusCode: HttpStatus.OK, user: { ...user, isDeviceLocked } };
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: any,
    @Headers('user-agent') userAgent: string,
    @Body('device') bodyDevice?: string,
  ) {
    // Requires JwtAuthGuard to be active
    const deviceName = bodyDevice || userAgent || 'Unknown Device';
    const data = await this.authService.logout(req.user.id, deviceName);
    return { statusCode: HttpStatus.OK, ...data };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Request() req: any) {
    // Requires JwtAuthGuard to be active
    const data = await this.authService.logoutAll(req.user.id);
    return { statusCode: HttpStatus.OK, ...data };
  }
}

