import { HttpStatus } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
export declare class GalleriesController {
    private readonly galleriesService;
    constructor(galleriesService: GalleriesService);
    create(createGalleryDto: CreateGalleryDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/gallery.entity").Gallery[];
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/gallery.entity").Gallery[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/gallery.entity").Gallery;
    }>;
    update(id: string, updateGalleryDto: UpdateGalleryDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/gallery.entity").Gallery;
    }>;
}
