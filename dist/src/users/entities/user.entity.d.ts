export declare enum UserRole {
    ADMIN = "admin",
    STUDENT = "student",
    MENTOR = "mentor",
    MODERATOR = "moderator",
    DEVELOPER = "developer",
    MANAGER = "manager",
    HR = "hr",
    PROJECT_MANAGER = "project_manager"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone: string;
    avatar: string;
    lastlogin: Date;
    devices: string[];
    isBanned: boolean;
    bannedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    hashPassword(): Promise<void>;
}
