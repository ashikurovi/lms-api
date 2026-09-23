import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';

export enum BatchStatus {
  UPCOMING = 'upcoming',
  OPEN = 'open',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum BatchMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
  HYBRID = 'hybrid',
}

export enum ClassType {
  LIVE = 'live',
  RECORDED = 'recorded',
  SELF_PACED = 'self_paced',
}

@Entity('batches')
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  course_id: string;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  registration_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  registration_end: Date;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  enrolled_count: number;

  @Column({
    type: 'enum',
    enum: BatchStatus,
    default: BatchStatus.UPCOMING,
  })
  status: BatchStatus;

  @Column({
    type: 'enum',
    enum: BatchMode,
    default: BatchMode.ONLINE,
  })
  mode: BatchMode;

  @Column({
    type: 'enum',
    enum: ClassType,
    default: ClassType.LIVE,
  })
  class_type: ClassType;

  @Column({ default: 'Asia/Dhaka' })
  timezone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
