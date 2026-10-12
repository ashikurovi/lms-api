import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    const data = await this.blogsService.create(createBlogDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Blog created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.blogsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Blogs retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.blogsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog retrieved successfully',
      data,
    };
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const data = await this.blogsService.update(id, updateBlogDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog updated successfully',
      data,
    };
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.blogsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Blog deleted successfully',
      data,
    };
  }
}
