import { HttpStatus } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
export declare class NoticesController {
    private readonly noticesService;
    constructor(noticesService: NoticesService);
    create(createNoticeDto: CreateNoticeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").Notice;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").Notice[];
    }>;
    findActive(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").Notice[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").Notice;
    }>;
    update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/notice.entity").Notice;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: void;
    }>;
}
