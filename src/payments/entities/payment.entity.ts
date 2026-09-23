import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Installment } from '../../installment/entities/installment.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentGateway {
  SSLCOMMERZ = 'SSLCOMMERZ',
  MANUAL = 'MANUAL',
}

export enum PaymentEnvironment {
  SANDBOX = 'SANDBOX',
  LIVE = 'LIVE',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enrollment_id: string;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column()
  installment_id: string;

  @ManyToOne(() => Installment, (installment) => installment.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'installment_id' })
  installment: Installment;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
    default: PaymentGateway.SSLCOMMERZ,
  })
  gateway: PaymentGateway;

  @Column({
    type: 'enum',
    enum: PaymentEnvironment,
    default: PaymentEnvironment.SANDBOX,
  })
  environment: PaymentEnvironment;

  @Column({ type: 'varchar', nullable: true, unique: true })
  transaction_id: string | null;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
