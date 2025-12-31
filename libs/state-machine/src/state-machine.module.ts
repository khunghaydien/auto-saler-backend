import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/common';
import { OpenAiModule } from '@app/openai';
import { StateMachineService } from './services';

@Module({
  imports: [ConfigModule, OpenAiModule],
  providers: [StateMachineService],
  exports: [StateMachineService],
})
export class StateMachineModule {}
