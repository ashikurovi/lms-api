import { Repository } from 'typeorm';
import { CreateMentorDto } from './dto/create-mentor.dto';
import { UpdateMentorDto } from './dto/update-mentor.dto';
import { Mentor } from './entities/mentor.entity';
export declare class MentorsService {
    private mentorRepository;
    constructor(mentorRepository: Repository<Mentor>);
    create(createMentorDto: CreateMentorDto): Promise<Mentor>;
    findAll(pageStr?: string, limitStr?: string, search?: string): Promise<{
        items: Mentor[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Mentor>;
    update(id: string, updateMentorDto: UpdateMentorDto): Promise<Mentor & UpdateMentorDto>;
    remove(id: string): Promise<Mentor>;
    ban(id: string): Promise<Mentor>;
    unban(id: string): Promise<Mentor>;
}
