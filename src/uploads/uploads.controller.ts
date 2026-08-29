import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Public } from '../auth/decorators/public.decorator';

@Controller('upload')
export class UploadsController {
  @Post()
  @Public() // Make public so anyone can upload, or remove to protect it
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    // Construct the URL to the uploaded file.
    // Ideally you'd get the full host dynamically, but for now we'll use a relative or configured one.
    const fileUrl = `${process.env.API_URL || 'http://localhost:8000'}/uploads/${file.filename}`;
    
    return {
      statusCode: 201,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        filename: file.filename,
      }
    };
  }
}
