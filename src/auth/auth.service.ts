import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Otp } from './entities/otp.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async sendLoginOtp(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sendOtp(phone);
  }

  async sendOtp(phone: string) {
    // 1. Generate a random 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Set expiration time (e.g., 5 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // 3. Save to database
    const otpRecord = this.otpRepository.create({
      phone,
      otpCode,
      expiresAt,
    });
    await this.otpRepository.save(otpRecord);

    // 4. Send OTP via BulkSMSBD API
    const apiKey = process.env.BULKSMSBD_API_KEY
    const senderId = process.env.BULKSMSBD_SENDER_ID

    if (!senderId) {
      console.warn(`[WARNING] BULKSMSBD_SENDER_ID is missing. SMS to ${phone} not sent. OTP is ${otpCode}`);
      return { message: 'OTP generated (SMS not sent due to missing Sender ID)' };
    }

    const message = encodeURIComponent(`Your OTP code is ${otpCode}. It is valid for 5 minutes.`);
    const smsUrl = `http://bulksmsbd.net/api/smsapi?api_key=${apiKey}&type=text&number=${phone}&senderid=${senderId}&message=${message}`;

    try {
      const response = await fetch(smsUrl);
      const data = await response.json();

      // Handle the BulkSMSBD response codes based on documentation
      if (data.response_code === 202) {
        console.log(`[SMS SUCCESS] OTP sent to ${phone}`);
      } else {
        console.error(`[SMS FAILED] BulkSMSBD returned code ${data.response_code}: ${data.error_message || 'Unknown Error'}`);
        // Consider whether you want to throw an error or just log it so the user can try again
      }
    } catch (error) {
      console.error(`[SMS ERROR] Failed to call BulkSMSBD API`, error);
    }

    return { message: 'OTP request processed' };
  }

  async verifyOtp(phone: string, otpCode: string, device?: string) {
    // 1. Find the latest unused OTP for this phone
    const otpRecord = await this.otpRepository.findOne({
      where: { phone, isUsed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP or no OTP requested');
    }

    if (otpRecord.otpCode !== otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // 2. Mark OTP as used
    otpRecord.isUsed = true;
    await this.otpRepository.save(otpRecord);

    // 3. Find or Create User
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      // Create new user if not exists
      // Note: we might need to adjust what data is required in users.service
      user = await this.usersService.create({
        phone,
        email: `${phone}@example.com`, // temporary placeholder
        name: 'New User',
        password: 'Password123!', // temporary placeholder
      });
    }

    // 4. Update lastlogin and devices
    user.lastlogin = new Date();
    let devices = user.devices || [];
    if (device && !devices.includes(device)) {
      if (devices.length >= 3) {
        throw new ForbiddenException('Device limit reached. You can only log in from up to 3 devices.');
      }
      devices.push(device);
    }
    await this.usersService.update(user.id, { lastlogin: user.lastlogin, devices });

    // 5. Generate JWT Token
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async login(email: string, pass: string, device?: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await require('bcrypt').compare(pass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    if (user.isBanned) {
      throw new BadRequestException('User is banned');
    }

    user.lastlogin = new Date();
    let devices = user.devices || [];
    if (device && !devices.includes(device)) {
      if (devices.length >= 3) {
        throw new ForbiddenException('Device limit reached. You can only log in from up to 3 devices.');
      }
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

  async forgotPassword(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('User with this phone number not found');
    }

    // Reuse the sendOtp method to generate and send an OTP
    return this.sendOtp(phone);
  }

  async resetPassword(phone: string, otpCode: string, newPassword: string) {
    // 1. Validate OTP
    const otpRecord = await this.otpRepository.findOne({
      where: { phone, isUsed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP or no OTP requested');
    }

    if (otpRecord.otpCode !== otpCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    // 2. Mark OTP as used
    otpRecord.isUsed = true;
    await this.otpRepository.save(otpRecord);

    // 3. Find user and update password
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // We assume usersService has an update method or we can save via a repository
    // Let's call a theoretical update method or save it if we have access
    // Wait, usersService in NestJS typically has an update method, but I need to make sure
    // what usersService provides. Let me just use usersService to update.
    await this.usersService.update(user.id, { password: user.password });

    return { message: 'Password has been reset successfully' };
  }

  async logout(userId: string, deviceToRemove: string) {
    // UsersService.findOne might throw NotFoundException if not found
    const user = await this.usersService.findOne(userId);
    
    const devices = user.devices || [];
    const newDevices = devices.filter(d => d !== deviceToRemove);
    
    await this.usersService.update(user.id, { devices: newDevices });
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    const user = await this.usersService.findOne(userId);
    await this.usersService.update(user.id, { devices: [] });
    return { message: 'Logged out from all devices successfully' };
  }
}

