import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto | any) {
    const portfolio = this.portfolioRepository.create(createPortfolioDto);
    return await this.portfolioRepository.save(portfolio);
  }

  async findAll() {
    return await this.portfolioRepository.find();
  }

  async findOne(id: string) {
    const portfolio = await this.portfolioRepository.findOne({ where: { id } });
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto | any) {
    const portfolio = await this.findOne(id);
    const updated = Object.assign(portfolio, updatePortfolioDto);
    return await this.portfolioRepository.save(updated);
  }

  async remove(id: string) {
    const portfolio = await this.findOne(id);
    return await this.portfolioRepository.remove(portfolio);
  }
}
