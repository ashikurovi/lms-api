import { Repository } from 'typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { Assignment } from './entities/assignment.entity';
import { Mentor } from '../mentors/entities/mentor.entity';
export declare class AssignmentsService {
    private assignmentRepository;
    private mentorRepository;
    constructor(assignmentRepository: Repository<Assignment>, mentorRepository: Repository<Mentor>);
    create(createAssignmentDto: CreateAssignmentDto, userId?: string): Promise<Assignment>;
    findAll(pageStr?: string, limitStr?: string, search?: string, batchId?: string, mentorId?: string, status?: string): Promise<{
        items: Assignment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Assignment>;
    update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment & {
        dueAt?: string | Date | null | undefined;
        batchId?: string | undefined;
        mentorId?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        attachmentUrl?: string | undefined;
        totalMarks?: number | undefined;
        status?: "draft" | "published" | "closed" | undefined;
    }>;
    remove(id: string): Promise<Assignment>;
}
