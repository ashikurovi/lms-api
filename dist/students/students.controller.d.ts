import { HttpStatus } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto, file?: Express.Multer.File): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/student.entity").Student[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    checkStudent(phone?: string, roll?: string, registrationNumber?: string): Promise<{
        exists: boolean;
        message: string;
        student?: undefined;
        userExists?: undefined;
        statusCode: HttpStatus;
    } | {
        exists: boolean;
        student: import("./entities/student.entity").Student | null;
        userExists: boolean;
        message: string;
        statusCode: HttpStatus;
    }>;
    registerStudent(registerDto: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            student: import("./entities/student.entity").Student;
            user: import("../users/entities/user.entity").User;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student;
    } | undefined>;
    getMyProfile(req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student;
    }>;
    updateMyProfile(req: any, updateStudentDto: UpdateStudentDto, file?: Express.Multer.File): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student & UpdateStudentDto;
    }>;
    update(id: string, updateStudentDto: UpdateStudentDto, file?: Express.Multer.File): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student & UpdateStudentDto;
    }>;
    ban(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student;
    }>;
    unban(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/student.entity").Student;
    }>;
}
