import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_tvsBwDZC6GVpTOM98TZSrsXB' } = options;

  const run = openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions:  // OJO! sobreescribe el asistente
  });
  console.log({ run });
  return run;
};
