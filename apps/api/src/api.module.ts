import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StateMachineModule } from './state-machine/state-machine.module';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@app/common';

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule, StateMachineModule],
})
export class ApiModule {}
