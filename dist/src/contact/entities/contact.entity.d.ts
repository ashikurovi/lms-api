export declare enum ContactStatus {
    UNREAD = "unread",
    READ = "read",
    ARCHIVED = "archived"
}
export declare class Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: ContactStatus;
    createdAt: Date;
    updatedAt: Date;
}
