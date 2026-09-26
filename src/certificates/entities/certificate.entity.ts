import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Batch } from '../../batch/entities/batch.entity';
import { Course } from '../../course/entities/course.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Student
  @Column()
  studentId: string;

  @ManyToOne(() => Student, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  // Batch
  @Column()
  batchId: string;

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batchId' })
  batch: Batch;

  // Course
  @Column()
  courseId: string;

  @ManyToOne(() => Course, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  // Certificate identity
  @Column({ unique: true })
  certificateNumber: string;

  @Column({ unique: true })
  verificationCode: string;

  // Certificate information
  @Column()
  studentName: string;

  @Column()
  courseName: string;

  @Column()
  batchNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  // Certificate file
  @Column({ type: 'text', nullable: true })
  certificateUrl?: string;

  // Signatures
  @Column({ type: 'text', nullable: true })
  signature1Url?: string;

  @Column({ type: 'text', nullable: true })
  signature2Url?: string;

  @Column({ nullable: true })
  signature1Name?: string;

  @Column({ nullable: true })
  signature1Designation?: string;

  @Column({ nullable: true })
  signature2Name?: string;

  @Column({ nullable: true })
  signature2Designation?: string;

  @Column({
    type: 'enum',
    enum: ['issued', 'revoked'],
    default: 'issued',
  })
  status: 'issued' | 'revoked';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
