import { HttpStatus } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    create(createAssignmentDto: CreateAssignmentDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment.entity").Assignment;
    }>;
    findAll(page?: string, limit?: string, search?: string, batchId?: string, mentorId?: string, status?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/assignment.entity").Assignment[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment.entity").Assignment;
    }>;
    update(id: string, updateAssignmentDto: UpdateAssignmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment.entity").Assignment & {
            dueAt?: string | Date | null | undefined;
            batchId?: string | undefined;
            mentorId?: string | undefined;
            title?: string | undefined;
            description?: string | undefined;
            attachmentUrl?: string | undefined;
            totalMarks?: number | undefined;
            status?: "draft" | "published" | "closed" | undefined;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/assignment.entity").Assignment;
    }>;
}
