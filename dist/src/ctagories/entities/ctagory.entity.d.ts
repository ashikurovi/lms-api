export declare class CourseCategory {
    id: string;
    parent_id: string;
    parent: CourseCategory;
    children: CourseCategory[];
    name: string;
    slug: string;
    description: string;
    thumbnail: string;
    sort_order: number;
    status: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
