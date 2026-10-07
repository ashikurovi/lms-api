import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ContactStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.UNREAD
  })
  status: ContactStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
