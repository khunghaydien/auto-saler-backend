import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findActiveUsers(): Promise<UserEntity[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.repository.update(userId, { lastLoginAt: new Date() });
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.repository.update(userId, { isEmailVerified: true });
  }

  async searchByFullName(
    searchTerm: string,
    similarityThreshold: number = 0.3,
  ): Promise<UserEntity[]> {
    return this.repository
      .createQueryBuilder('user')
      .where('similarity(user.fullName, :searchTerm) > :threshold', {
        searchTerm,
        threshold: similarityThreshold,
      })
      .orderBy('similarity(user.fullName, :searchTerm)', 'DESC')
      .setParameter('searchTerm', searchTerm)
      .getMany();
  }
}
