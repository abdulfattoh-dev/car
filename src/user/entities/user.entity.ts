import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../enum/enum';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', name: 'full_name' })
    fullName: string;

    @Column({ type: 'varchar', name: 'username' })
    username: string;

    @Column({ type: 'varchar', name: 'email' })
    email: string;

    @Column({ type: 'varchar', name: 'phone_number' })
    phoneNumber: string;

    @Column({ type: 'varchar', name: 'password' })
    password: string;

    @Column({ type: 'enum', name: 'gender', enum: Gender })
    gender: Gender;

    @CreateDateColumn({ type: 'date', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'date', name: 'updated_at' })
    updatedAt: Date;
}
