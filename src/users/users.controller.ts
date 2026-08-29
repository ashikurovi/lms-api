import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return { statusCode: HttpStatus.CREATED, message: 'User created successfully', data };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async findAll() {
    const data = await this.usersService.findAll();
    return { statusCode: HttpStatus.OK, message: 'Users retrieved successfully', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(id);
    return { statusCode: HttpStatus.OK, message: 'User retrieved successfully', data };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(id, updateUserDto);
    return { statusCode: HttpStatus.OK, message: 'User updated successfully', data };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(id);
    return { statusCode: HttpStatus.OK, message: 'User deleted successfully', data };
  }

  @Patch(':id/ban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async ban(@Param('id') id: string) {
    const data = await this.usersService.ban(id);
    return { statusCode: HttpStatus.OK, message: 'User banned successfully', data };
  }

  @Patch(':id/unban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async unban(@Param('id') id: string) {
    const data = await this.usersService.unban(id);
    return { statusCode: HttpStatus.OK, message: 'User unbanned successfully', data };
  }
}
