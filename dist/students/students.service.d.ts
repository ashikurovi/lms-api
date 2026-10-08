import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export declare class StudentsService {
    private studentRepository;
    private usersService;
    constructor(studentRepository: Repository<Student>, usersService: UsersService);
    checkStudent(query: {
        phone?: string;
        roll?: string;
        registrationNumber?: string;
    }): Promise<{
        exists: boolean;
        message: string;
        student?: undefined;
        userExists?: undefined;
    } | {
        exists: boolean;
        student: Student | null;
        userExists: boolean;
        message: string;
    }>;
    registerStudent(registerDto: any): Promise<{
        student: Student;
        user: User;
    }>;
    create(createStudentDto: CreateStudentDto): Promise<Student>;
    findAll(pageStr?: string, limitStr?: string, search?: string): Promise<{
        items: Student[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Student>;
    findByUserId(userId: string): Promise<Student>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student & UpdateStudentDto>;
    remove(id: string): Promise<Student>;
    ban(id: string): Promise<Student>;
    unban(id: string): Promise<Student>;
}
