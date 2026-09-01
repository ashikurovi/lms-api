import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Personal Information
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  profileImage: string;

  // Academic Information
  @Column({ nullable: true })
  institute: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  technology: string;

  @Column({ type: 'int', nullable: true })
  semester: number;

  @Column({ nullable: true })
  shift: string;

  @Column({ nullable: true })
  session: string;

  @Column({ nullable: true })
  roll: string;

  @Column({ nullable: true })
  registrationNumber: string;

  // Address
  @Column({ nullable: true })
  presentAddress: string;

  @Column({ nullable: true })
  permanentAddress: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  division: string;

  // Skills & Career
  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ type: 'simple-array', nullable: true })
  interestedField: string[];

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  portfolio: string;

  // Polytechnic Related
  @Column({ default: false })
  industrialAttachment: boolean;

  @Column({ nullable: true })
  attachmentCompany: string;

  @Column({ nullable: true })
  attachmentStatus: string;

  // Account
  @Column({ nullable: true })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
