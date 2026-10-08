import { Repository } from 'typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
export declare class ResourcesService {
    private resourceRepository;
    constructor(resourceRepository: Repository<Resource>);
    create(createResourceDto: CreateResourceDto, mentorId?: string): Promise<Resource>;
    findAll(pageStr?: string, limitStr?: string, search?: string, batchId?: string): Promise<{
        items: Resource[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Resource>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<Resource & UpdateResourceDto>;
    remove(id: string): Promise<Resource>;
}
