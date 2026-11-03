import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { WalkthroughsService } from './walkthroughs.service';
import { CreateWalkthroughDto } from './dto/create-walkthrough.dto';
import { UpdateWalkthroughDto } from './dto/update-walkthrough.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('walkthroughs')
export class WalkthroughsController {
  constructor(private readonly walkthroughsService: WalkthroughsService) {}

  @Public()
  @Post()
  async create(@Body() createWalkthroughDto: CreateWalkthroughDto) {
    const data = await this.walkthroughsService.create(createWalkthroughDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Walkthrough created successfully',
      data,
    };
  }

  @Public()
  @Get()
  async findAll() {
    const data = await this.walkthroughsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Walkthroughs retrieved successfully',
      data,
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.walkthroughsService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Walkthrough retrieved successfully',
      data,
    };
  }

  @Public()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWalkthroughDto: UpdateWalkthroughDto,
  ) {
    const data = await this.walkthroughsService.update(id, updateWalkthroughDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Walkthrough updated successfully',
      data,
    };
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.walkthroughsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Walkthrough deleted successfully',
      data,
    };
  }
}

