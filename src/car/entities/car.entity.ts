import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cars')
export class CarEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'int', name: 'price' })
  price: number;

  @Column({ type: 'varchar', name: 'brand' })
  brand: string;

  @Column({ type: 'varchar', name: 'color' })
  color: string;

  @Column({ type: 'date', name: 'release_date' })
  releaseDate: Date;

  @Column({ type: 'int', name: 'power' })
  power: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
