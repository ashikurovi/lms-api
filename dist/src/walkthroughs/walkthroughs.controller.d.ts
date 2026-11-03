import { HttpStatus } from '@nestjs/common';
import { WalkthroughsService } from './walkthroughs.service';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
export declare class WalkthroughsController {
    private readonly walkthroughsService;
    constructor(walkthroughsService: WalkthroughsService);
    create(createWalkthroughDto: CreateWalkthroughDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/walkthrough.entity").Walkthrough;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/walkthrough.entity").Walkthrough[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/walkthrough.entity").Walkthrough;
    }>;
    update(id: string, updateWalkthroughDto: UpdateWalkthroughDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/walkthrough.entity").Walkthrough & UpdateWalkthroughDto;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/walkthrough.entity").Walkthrough;
    }>;
}
