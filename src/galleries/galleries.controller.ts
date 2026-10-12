import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleriesService: GalleriesService) {}

  @Public()
  @Post()
  async create(@Body() createGalleryDto: CreateGalleryDto) {
    const data = await this.galleriesService.create(createGalleryDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Gallery item created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.galleriesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery items retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.galleriesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery item retrieved successfully',
      data,
    };
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto) {
    const data = await this.galleriesService.update(id, updateGalleryDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery item updated successfully',
      data,
    };
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.galleriesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery item deleted successfully',
      data,
    };
  }
}
