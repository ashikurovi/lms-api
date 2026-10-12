import { ModuleStatus } from '../entities/module.entity';
export declare class CreateModuleDto {
    course_id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    order?: number;
    status?: ModuleStatus;
}
