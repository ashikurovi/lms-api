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
import { User } from '../../users/entities/user.entity';

@Entity('live_schedules')
export class LiveSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Batch relation
  @Column()
  batchId: string;

  // Note: Since Batch does not have a 'liveSchedules' relation defined, 
  // we omit the inverse side (batch => batch.liveSchedules) here.
  @ManyToOne(() => Batch, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batchId' })
  batch: Batch;

  // Mentor responsible for this class
  @Column({ nullable: true })
  mentorId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'mentorId' })
  mentor?: User;

  // Class information
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  // Meeting platform
  @Column({
    type: 'enum',
    enum: ['google_meet', 'zoom'],
  })
  platform: 'google_meet' | 'zoom';

  // Meeting information
  @Column({ type: 'text' })
  meetingUrl: string;

  @Column({ nullable: true })
  meetingId?: string;

  @Column({ nullable: true })
  meetingPassword?: string;

  // Status
  @Column({
    type: 'enum',
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';

  // Who created it
  @Column({ nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'createdBy' })
  creator?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
