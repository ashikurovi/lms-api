import { Repository } from 'typeorm';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { Walkthrough } from './entities/walkthrough.entity';
export declare class WalkthroughsService {
    private walkthroughRepository;
    constructor(walkthroughRepository: Repository<Walkthrough>);
    create(createWalkthroughDto: CreateWalkthroughDto): Promise<Walkthrough>;
    findAll(): Promise<Walkthrough[]>;
    findOne(id: string): Promise<Walkthrough>;
    update(id: string, updateWalkthroughDto: UpdateWalkthroughDto): Promise<Walkthrough & UpdateWalkthroughDto>;
    remove(id: string): Promise<Walkthrough>;
}
