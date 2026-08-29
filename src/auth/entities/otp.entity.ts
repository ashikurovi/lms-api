import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column()
  otpCode: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
