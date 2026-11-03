import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalkthroughsService } from './walkthroughs.service';
import { WalkthroughsController } from './walkthroughs.controller';
import { Walkthrough } from './entities/walkthrough.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Walkthrough])],
  controllers: [WalkthroughsController],
  providers: [WalkthroughsService],
  exports: [WalkthroughsService],
})
export class WalkthroughsModule {}

