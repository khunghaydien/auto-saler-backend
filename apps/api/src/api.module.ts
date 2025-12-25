import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@app/common';

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule],
})
export class ApiModule {}
