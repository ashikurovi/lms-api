import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CtagoriesService } from './ctagories.service';
import { CtagoriesController } from './ctagories.controller';
import { CourseCategory } from './entities/ctagory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseCategory])],
  controllers: [CtagoriesController],
  providers: [CtagoriesService],
  exports: [CtagoriesService],
})
export class CtagoriesModule {}
