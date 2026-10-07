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

@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: 'batchId' })
  batch: Batch;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
