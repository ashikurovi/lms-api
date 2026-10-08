import { Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
export declare class PortfoliosService {
    private portfolioRepository;
    constructor(portfolioRepository: Repository<Portfolio>);
    create(createPortfolioDto: CreatePortfolioDto | any): Promise<Portfolio[]>;
    findAll(): Promise<Portfolio[]>;
    findOne(id: string): Promise<Portfolio>;
    update(id: string, updatePortfolioDto: UpdatePortfolioDto | any): Promise<any>;
    remove(id: string): Promise<Portfolio>;
}
