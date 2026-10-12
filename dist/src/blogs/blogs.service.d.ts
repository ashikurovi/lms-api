import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
export declare class BlogsService {
    private blogRepository;
    constructor(blogRepository: Repository<Blog>);
    create(createBlogDto: CreateBlogDto | any): Promise<Blog[]>;
    findAll(): Promise<Blog[]>;
    findOne(id: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto | any): Promise<any>;
    remove(id: string): Promise<Blog>;
}
