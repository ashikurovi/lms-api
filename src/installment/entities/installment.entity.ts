import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum InstallmentStatus {
  PENDING = 'PENDING',
  DUE = 'DUE',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

@Entity('installments')
export class Installment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enrollment_id: string;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.installments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column({ type: 'int' })
  installment_number: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paid_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  due_amount: number;

  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: InstallmentStatus,
    default: InstallmentStatus.PENDING,
  })
  status: InstallmentStatus;

  @OneToMany(() => Payment, (payment) => payment.installment)
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
