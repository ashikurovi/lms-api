import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
export declare class NoticesService {
    private readonly noticesRepository;
    constructor(noticesRepository: Repository<Notice>);
    create(createNoticeDto: CreateNoticeDto): Promise<Notice>;
    findAll(): Promise<Notice[]>;
    findActive(): Promise<Notice[]>;
    findOne(id: string): Promise<Notice>;
    update(id: string, updateNoticeDto: UpdateNoticeDto): Promise<Notice>;
    remove(id: string): Promise<void>;
}
