import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const newContact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(newContact);
  }

  async findAll() {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.findOne(id);
    Object.assign(contact, updateContactDto);
    return await this.contactRepository.save(contact);
  }

  async remove(id: string) {
    const contact = await this.findOne(id);
    return await this.contactRepository.remove(contact);
  }
}
