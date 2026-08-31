import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    slug: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: 0 })
    coursesCount?: number; // Number of courses in this category
}
