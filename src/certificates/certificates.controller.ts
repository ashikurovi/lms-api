import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto, BulkCreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async create(@Body() createCertificateDto: CreateCertificateDto) {
    const data = await this.certificatesService.create(createCertificateDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Certificate issued successfully',
      data,
    };
  }

  @Post('bulk')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async createBulk(@Body() bulkDto: BulkCreateCertificateDto) {
    const data = await this.certificatesService.createBulk(bulkDto.certificates);
    return {
      statusCode: HttpStatus.CREATED,
      message: `${data.length} certificates issued successfully in bulk`,
      data,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('batchId') batchId?: string,
    @Query('courseId') courseId?: string,
    @Query('studentId') studentId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.certificatesService.findAll(
      page,
      limit,
      search,
      batchId,
      courseId,
      studentId,
      status,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Certificates retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.certificatesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Certificate retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
  ) {
    const data = await this.certificatesService.update(id, updateCertificateDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Certificate updated successfully',
      data,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.DEVELOPER)
  async remove(@Param('id') id: string) {
    const data = await this.certificatesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Certificate deleted successfully',
      data,
    };
  }
}
