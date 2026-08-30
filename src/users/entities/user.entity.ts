import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  MENTOR = 'mentor',
  MODERATOR = 'moderator',
  DEVELOPER = 'developer',
  MANAGER = 'manager',
  HR = 'hr',
  PROJECT_MANAGER = 'project_manager',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  lastlogin: Date;

  @Column({ type: 'simple-array', nullable: true })
  devices: string[];

  @Column({ default: false })
  isBanned: boolean;

  @Column({ type: 'timestamp', nullable: true })
  bannedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length > 0 && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
