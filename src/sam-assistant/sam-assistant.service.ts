import { Injectable } from '@nestjs/common';
import { QuestionDto } from './dtos/question.dto';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import OpenAI from 'openai';

@Injectable()
export class SamAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    const message = await createMessageUseCase(this.openai, {
      threadId,
      question,
    });
    console.log(message);
    const run = await createRunUseCase(this.openai, { threadId });
    console.log(run);
    await checkCompleteStatusUseCase(this.openai, { threadId, runId: run.id });
    const messages = await getMessageListUseCase(this.openai, {
      threadId,
    });

    return messages.reverse();
  }
}
