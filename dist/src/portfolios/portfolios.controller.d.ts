import { HttpStatus } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
export declare class PortfoliosController {
    private readonly portfoliosService;
    constructor(portfoliosService: PortfoliosService);
    create(createPortfolioDto: CreatePortfolioDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/portfolio.entity").Portfolio[];
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/portfolio.entity").Portfolio[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/portfolio.entity").Portfolio;
    }>;
    update(id: string, updatePortfolioDto: UpdatePortfolioDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/portfolio.entity").Portfolio;
    }>;
}
