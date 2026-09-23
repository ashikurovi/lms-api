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
import { CourseModule } from '../../module/entities/module.entity';

export enum LessonType {
  VIDEO = 'video',
  TEXT = 'text',
  PDF = 'pdf',
  IMAGE = 'image',
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
}

export enum LessonStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  module_id: string;

  @ManyToOne(() => CourseModule, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: LessonType,
    default: LessonType.VIDEO,
  })
  type: LessonType;

  @Column({ nullable: true })
  video_url: string;

  @Column({ nullable: true })
  pdf_url: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ default: false })
  is_preview: boolean;

  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.DRAFT,
  })
  status: LessonStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
