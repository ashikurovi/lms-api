import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    create(createBlogDto: CreateBlogDto): Promise<import("./entities/blog.entity").Blog[]>;
    findAll(): Promise<import("./entities/blog.entity").Blog[]>;
    findOne(id: string): Promise<import("./entities/blog.entity").Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<any>;
    remove(id: string): Promise<import("./entities/blog.entity").Blog>;
}
