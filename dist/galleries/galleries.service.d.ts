import { Repository } from 'typeorm';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { Gallery } from './entities/gallery.entity';
export declare class GalleriesService {
    private galleryRepository;
    constructor(galleryRepository: Repository<Gallery>);
    create(createGalleryDto: CreateGalleryDto | any): Promise<Gallery[]>;
    findAll(): Promise<Gallery[]>;
    findOne(id: string): Promise<Gallery>;
    update(id: string, updateGalleryDto: UpdateGalleryDto | any): Promise<any>;
    remove(id: string): Promise<Gallery>;
}
