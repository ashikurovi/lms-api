import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { CourseCategory } from '../../ctagories/entities/ctagory.entity';
import { Mentor } from '../../mentors/entities/mentor.entity';
import { CourseModule } from '../../module/entities/module.entity';
import { Batch } from '../../batch/entities/batch.entity';

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum DurationUnit {
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
}

export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum CourseVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  category_id: string;

  @ManyToOne(() => CourseCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: CourseCategory;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  course_code: string;

  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  intro_video_url: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({ default: 'English' })
  language: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  duration: number;

  @Column({
    type: 'enum',
    enum: DurationUnit,
    default: DurationUnit.HOURS,
  })
  duration_unit: DurationUnit;


  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({
    type: 'enum',
    enum: CourseVisibility,
    default: CourseVisibility.PUBLIC,
  })
  visibility: CourseVisibility;

  @ManyToMany(() => Mentor, { eager: false })
  @JoinTable({
    name: 'course_mentors',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'mentor_id', referencedColumnName: 'id' },
  })
  mentors: Mentor[];

  @OneToMany(() => CourseModule, (module) => module.course)
  modules: CourseModule[];

  @OneToMany(() => Batch, (batch) => batch.course)
  batches: Batch[];

  @Column({ type: 'timestamp', nullable: true })
  published_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
