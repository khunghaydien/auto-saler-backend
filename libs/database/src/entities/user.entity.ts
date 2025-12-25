import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'username' })
  username: string | null;

  @Column({ type: 'varchar', length: 255, name: 'password' })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'full_name' })
  fullName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true, name: 'phone' })
  phone: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_email_verified' })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date | null;
}
