import { Repository } from 'typeorm';
import { CreateCourseCategoryDto } from './dto/create-ctagory.dto';
import { UpdateCourseCategoryDto } from './dto/update-ctagory.dto';
import { CourseCategory } from './entities/ctagory.entity';
export declare class CtagoriesService {
    private courseCategoryRepository;
    constructor(courseCategoryRepository: Repository<CourseCategory>);
    create(createCourseCategoryDto: CreateCourseCategoryDto): Promise<CourseCategory>;
    findAll(pageStr?: string, limitStr?: string, search?: string, parentId?: string): Promise<{
        items: CourseCategory[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<CourseCategory>;
    update(id: string, updateCourseCategoryDto: UpdateCourseCategoryDto): Promise<CourseCategory & UpdateCourseCategoryDto & {
        slug: string;
    }>;
    remove(id: string): Promise<CourseCategory>;
}
