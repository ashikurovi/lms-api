import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/decorators/public.decorator';

@Controller('upload')
export class UploadsController {
  constructor(private readonly configService: ConfigService) { }

  @Post()
  @Public() // Make public so anyone can upload, or remove to protect it
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.NODE_ENV === 'production' ? '/tmp' : './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = randomUUID();
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;

      return {
        statusCode: 201,
        message: 'File uploaded successfully',
        data: {
          url: fileUrl,
          filename: file.filename,
        }
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to upload image');
    }
  }
}
