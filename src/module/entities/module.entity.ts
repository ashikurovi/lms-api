import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Lesson } from '../../lesson/entities/lesson.entity';

export enum ModuleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  course_id: string;

  @ManyToOne(() => Course, (course) => course.modules, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({
    type: 'enum',
    enum: ModuleStatus,
    default: ModuleStatus.DRAFT,
  })
  status: ModuleStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
