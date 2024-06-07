import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  // la respuesta debe de ser en formato markdown,
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
                Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                la respuesta debe de ser en formato markdown,
                los pros y contras deben de estar en una lista.
            `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    // model: 'gpt-3.5-turbo-1106',
    model: 'gpt-4o',
    temperature: 0.8,
    max_tokens: 500,
  });
  return completion.choices[0].message;
  // const jsonResp = await JSON.parse(completion.choices[0].message.content);

  // return jsonResp;
};
