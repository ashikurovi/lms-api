import { Repository } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './entities/lesson.entity';
export declare class LessonService {
    private lessonRepository;
    constructor(lessonRepository: Repository<Lesson>);
    create(createLessonDto: CreateLessonDto): Promise<Lesson>;
    findAll(pageStr?: string, limitStr?: string, search?: string, moduleId?: string, status?: string, type?: string): Promise<{
        items: Lesson[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Lesson>;
    update(id: string, updateLessonDto: UpdateLessonDto): Promise<Lesson & UpdateLessonDto & {
        slug: string;
    }>;
    remove(id: string): Promise<Lesson>;
}
