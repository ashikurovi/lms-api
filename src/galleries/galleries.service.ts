import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Gallery } from './entities/gallery.entity';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async create(createGalleryDto: CreateGalleryDto | any) {
    const gallery = this.galleryRepository.create(createGalleryDto);
    return await this.galleryRepository.save(gallery);
  }

  async findAll() {
    return await this.galleryRepository.find({ relations: { batch: true } });
  }

  async findOne(id: string) {
    const gallery = await this.galleryRepository.findOne({ where: { id }, relations: { batch: true } });
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }
    return gallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto | any) {
    const gallery = await this.findOne(id);
    const updated = Object.assign(gallery, updateGalleryDto);
    return await this.galleryRepository.save(updated);
  }

  async remove(id: string) {
    const gallery = await this.findOne(id);
    return await this.galleryRepository.remove(gallery);
  }
}
