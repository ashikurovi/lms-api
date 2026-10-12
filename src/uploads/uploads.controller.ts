import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/decorators/public.decorator';

@Controller('upload')
export class UploadsController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/i)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const apiKey =
        this.configService.get<string>('IMGBB_API_KEY') ||
        process.env.IMGBB_API_KEY ||
        '7f7b2615e37d49f2db2eec28c9007bc4';

      const base64Image = file.buffer.toString('base64');
      const formData = new URLSearchParams();
      formData.append('image', base64Image);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.data?.url) {
        throw new BadRequestException(data?.error?.message || 'Failed to upload image to ImgBB');
      }

      return {
        statusCode: 200,
        message: 'File uploaded successfully to ImgBB',
        data: {
          url: data.data.url,
          filename: file.originalname,
        },
      };
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to upload image to ImgBB');
    }
  }
}
