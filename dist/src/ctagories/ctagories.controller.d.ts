import { HttpStatus } from '@nestjs/common';
import { CtagoriesService } from './ctagories.service';
import { CreateCourseCategoryDto } from './dto/create-ctagory.dto';
import { UpdateCourseCategoryDto } from './dto/update-ctagory.dto';
export declare class CtagoriesController {
    private readonly ctagoriesService;
    constructor(ctagoriesService: CtagoriesService);
    create(createCourseCategoryDto: CreateCourseCategoryDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/ctagory.entity").CourseCategory;
    }>;
    findAll(page?: string, limit?: string, search?: string, parentId?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/ctagory.entity").CourseCategory[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/ctagory.entity").CourseCategory;
    }>;
    update(id: string, updateCourseCategoryDto: UpdateCourseCategoryDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/ctagory.entity").CourseCategory & UpdateCourseCategoryDto & {
            slug: string;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/ctagory.entity").CourseCategory;
    }>;
}
