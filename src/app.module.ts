import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GptModule } from './gpt/gpt.module';
import { SamAssistantModule } from './sam-assistant/sam-assistant.module';

@Module({
  imports: [ConfigModule.forRoot(), GptModule, SamAssistantModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
