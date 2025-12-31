import { Module } from '@nestjs/common';
import { StateMachineModule as StateMachineServiceModule } from '@app/state-machine';
import { StateMachineController } from './state-machine.controller';

@Module({
  imports: [StateMachineServiceModule],
  controllers: [StateMachineController],
})
export class StateMachineModule {}
