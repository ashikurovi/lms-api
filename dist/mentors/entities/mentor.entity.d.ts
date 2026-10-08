import { User } from '../../users/entities/user.entity';
export declare class Mentor {
    id: string;
    user: User;
    profileImage: string;
    bio: string;
    designation: string;
    expertise: string[];
    subject: string;
    skills: string[];
    experience: string;
    facebook: string;
    linkedin: string;
    createdAt: Date;
    updatedAt: Date;
}
