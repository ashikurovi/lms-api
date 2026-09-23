import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assignment } from '../../assignments/entities/assignment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  assignmentId: string;

  @ManyToOne(() => Assignment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;

  @Column()
  studentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ type: 'text', nullable: true })
  answer?: string;

  @Column({ type: 'text', nullable: true })
  fileUrl?: string;

  @Column({ type: 'timestamp' })
  submittedAt: Date;

  @Column({
    type: 'enum',
    enum: ['submitted', 'reviewed', 'resubmitted'],
    default: 'submitted',
  })
  status: 'submitted' | 'reviewed' | 'resubmitted';

  @Column({ type: 'int', nullable: true })
  marks?: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;
}
