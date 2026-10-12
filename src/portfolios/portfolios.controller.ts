import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Public()
  @Post()
  async create(@Body() createPortfolioDto: CreatePortfolioDto) {
    const data = await this.portfoliosService.create(createPortfolioDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Portfolio item created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.portfoliosService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Portfolios retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.portfoliosService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Portfolio retrieved successfully',
      data,
    };
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePortfolioDto: UpdatePortfolioDto) {
    const data = await this.portfoliosService.update(id, updatePortfolioDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Portfolio updated successfully',
      data,
    };
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.portfoliosService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Portfolio deleted successfully',
      data,
    };
  }
}
