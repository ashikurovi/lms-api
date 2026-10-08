import { HttpStatus } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
export declare class ModuleController {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    create(createModuleDto: CreateModuleDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/module.entity").CourseModule;
    }>;
    findAll(page?: string, limit?: string, search?: string, courseId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/module.entity").CourseModule[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/module.entity").CourseModule;
    }>;
    update(id: string, updateModuleDto: UpdateModuleDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/module.entity").CourseModule & UpdateModuleDto;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/module.entity").CourseModule;
    }>;
}
