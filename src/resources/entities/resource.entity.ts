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

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  batchId: string;

  @ManyToOne(() => Batch, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batchId' })
  batch: Batch;

  @Column({ nullable: true })
  mentorId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'mentorId' })
  mentor?: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ nullable: true })
  pdf?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  sizeMb?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
