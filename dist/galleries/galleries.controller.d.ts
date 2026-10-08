import { GalleriesService } from './galleries.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
export declare class GalleriesController {
    private readonly galleriesService;
    constructor(galleriesService: GalleriesService);
    create(createGalleryDto: CreateGalleryDto): Promise<import("./entities/gallery.entity").Gallery[]>;
    findAll(): Promise<import("./entities/gallery.entity").Gallery[]>;
    findOne(id: string): Promise<import("./entities/gallery.entity").Gallery>;
    update(id: string, updateGalleryDto: UpdateGalleryDto): Promise<any>;
    remove(id: string): Promise<import("./entities/gallery.entity").Gallery>;
}
