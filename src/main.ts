import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Add this to enable CORS
  app.enableCors({
    origin: true, // Allows all origins in development, you can restrict this in production
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT ?? 8000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
