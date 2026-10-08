import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
export declare class PortfoliosController {
    private readonly portfoliosService;
    constructor(portfoliosService: PortfoliosService);
    create(createPortfolioDto: CreatePortfolioDto): Promise<import("./entities/portfolio.entity").Portfolio[]>;
    findAll(): Promise<import("./entities/portfolio.entity").Portfolio[]>;
    findOne(id: string): Promise<import("./entities/portfolio.entity").Portfolio>;
    update(id: string, updatePortfolioDto: UpdatePortfolioDto): Promise<any>;
    remove(id: string): Promise<import("./entities/portfolio.entity").Portfolio>;
}
