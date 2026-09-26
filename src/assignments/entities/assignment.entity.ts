import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Batch } from '../../batch/entities/batch.entity';
import { Mentor } from '../../mentors/entities/mentor.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  batchId: string;

  @ManyToOne(() => Batch, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batchId' })
  batch: Batch;

  @Column()
  mentorId: string;

  @ManyToOne(() => Mentor)
  @JoinColumn({ name: 'mentorId' })
  mentor: Mentor;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  attachmentUrl?: string;

  @Column({ type: 'int', default: 100 })
  totalMarks: number;

  @Column({ type: 'timestamp', nullable: true })
  dueAt?: Date;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'closed'],
    default: 'draft',
  })
  status: 'draft' | 'published' | 'closed';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
