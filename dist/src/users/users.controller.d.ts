import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            items: import("./entities/user.entity").User[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    ban(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
    unban(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/user.entity").User;
    }>;
}
