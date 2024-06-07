import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [ConfigModule.forRoot(), GptModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
