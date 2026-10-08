import { HttpStatus } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(createResourceDto: CreateResourceDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/resource.entity").Resource;
    }>;
    findAll(page?: string, limit?: string, search?: string, batchId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/resource.entity").Resource[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/resource.entity").Resource;
    }>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/resource.entity").Resource & UpdateResourceDto;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/resource.entity").Resource;
    }>;
}
