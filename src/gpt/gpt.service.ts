import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
} from './use-cases';
import {
  OrthograpyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import OpenAI from 'openai';
import { translateUseCase } from './use-cases/translate.use-case';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Sólo va a llamar a casos de uso
  async orthograpyCheck(orthographyDto: OrthograpyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translateText({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId['fileId']}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);
    if (!wasFound)
      throw new NotFoundException(`File ${fileId['fileId']}.mp3 not found}`);

    return filePath;
  }
}
