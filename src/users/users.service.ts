import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByPhone(phone: string) {
    return await this.userRepository.findOneBy({ phone });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return await this.userRepository.softRemove(user);
  }

  async ban(id: string) {
    const user = await this.findOne(id);
    user.isBanned = true;
    user.bannedAt = new Date();
    return await this.userRepository.save(user);
  }

  async unban(id: string) {
    const user = await this.findOne(id);
    user.isBanned = false;
    user.bannedAt = null;
    return await this.userRepository.save(user);
  }
}
