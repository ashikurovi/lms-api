import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password?: string;
    role?: UserRole;
    phone?: string;
    avatar?: string;
    lastlogin?: Date;
    devices?: string[];
}
