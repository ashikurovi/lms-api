import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<import("./entities/contact.entity").Contact>;
    findAll(): Promise<import("./entities/contact.entity").Contact[]>;
    findOne(id: string): Promise<import("./entities/contact.entity").Contact>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<import("./entities/contact.entity").Contact>;
    remove(id: string): Promise<import("./entities/contact.entity").Contact>;
}
