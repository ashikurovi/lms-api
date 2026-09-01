import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async create(@Body() createStudentDto: CreateStudentDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;
      createStudentDto.profileImage = fileUrl;
    }
    const data = await this.studentsService.create(createStudentDto);
    return { statusCode: HttpStatus.CREATED, message: 'Student created successfully', data };
  }

  @Public()
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.studentsService.findAll(page, limit, search);
    return { statusCode: HttpStatus.OK, message: 'Students retrieved successfully', data };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.studentsService.findOne(id);
    return { statusCode: HttpStatus.OK, message: 'Student retrieved successfully', data };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;
      updateStudentDto.profileImage = fileUrl;
    }
    const data = await this.studentsService.update(id, updateStudentDto);
    return { statusCode: HttpStatus.OK, message: 'Student updated successfully', data };
  }

  @Patch(':id/ban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async ban(@Param('id') id: string) {
    const data = await this.studentsService.ban(id);
    return { statusCode: HttpStatus.OK, message: 'Student banned successfully', data };
  }

  @Patch(':id/unban')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async unban(@Param('id') id: string) {
    const data = await this.studentsService.unban(id);
    return { statusCode: HttpStatus.OK, message: 'Student unbanned successfully', data };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.studentsService.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Student deleted successfully', data };
  }
}
