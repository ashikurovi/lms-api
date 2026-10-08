import { Repository } from 'typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CourseModule } from './entities/module.entity';
export declare class ModuleService {
    private moduleRepository;
    constructor(moduleRepository: Repository<CourseModule>);
    create(createModuleDto: CreateModuleDto): Promise<CourseModule>;
    findAll(pageStr?: string, limitStr?: string, search?: string, courseId?: string, status?: string): Promise<{
        items: CourseModule[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<CourseModule>;
    update(id: string, updateModuleDto: UpdateModuleDto): Promise<CourseModule & UpdateModuleDto>;
    remove(id: string): Promise<CourseModule>;
}
