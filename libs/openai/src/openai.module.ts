import { Module } from '@nestjs/common';
import { ConfigModule } from '@app/common';
import { OpenAiService } from './services';

@Module({
  imports: [ConfigModule],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
