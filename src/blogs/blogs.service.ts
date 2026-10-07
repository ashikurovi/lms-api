import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto | any) {
    const blog = this.blogRepository.create(createBlogDto);
    return await this.blogRepository.save(blog);
  }

  async findAll() {
    return await this.blogRepository.find();
  }

  async findOne(id: string) {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto | any) {
    const blog = await this.findOne(id);
    const updated = Object.assign(blog, updateBlogDto);
    return await this.blogRepository.save(updated);
  }

  async remove(id: string) {
    const blog = await this.findOne(id);
    return await this.blogRepository.remove(blog);
  }
}
