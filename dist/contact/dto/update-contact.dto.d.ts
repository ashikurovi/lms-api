import { CreateContactDto } from './create-contact.dto';
import { ContactStatus } from '../entities/contact.entity';
declare const UpdateContactDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateContactDto>>;
export declare class UpdateContactDto extends UpdateContactDto_base {
    status?: ContactStatus;
}
export {};
