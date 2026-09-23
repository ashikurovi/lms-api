import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentSubmissionsService } from './assignment_submissions.service';
import { AssignmentSubmissionsController } from './assignment_submissions.controller';
import { AssignmentSubmission } from './entities/assignment_submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentSubmission])],
  controllers: [AssignmentSubmissionsController],
  providers: [AssignmentSubmissionsService],
  exports: [AssignmentSubmissionsService],
})
export class AssignmentSubmissionsModule {}
