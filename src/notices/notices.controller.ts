import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Public()
  @Post()
  async create(@Body() createNoticeDto: CreateNoticeDto) {
    const data = await this.noticesService.create(createNoticeDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Notice created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.noticesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Notices retrieved successfully',
      data,
    };
  }

  @Public()
  @Get('active')
  async findActive() {
    const data = await this.noticesService.findActive();
    return {
      statusCode: HttpStatus.OK,
      message: 'Active notice retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.noticesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice retrieved successfully',
      data,
    };
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    const data = await this.noticesService.update(id, updateNoticeDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice updated successfully',
      data,
    };
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.noticesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Notice deleted successfully',
      data,
    };
  }
}
