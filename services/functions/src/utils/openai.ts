import OpenAI from 'openai';
import { env } from './env.js';

export const embedding = async ({
  input,
  openai = new OpenAI({
    apiKey: env('OPENAI_API_KEY'),
    organization: env('OPENAI_ORGANIZATION_ID'),
  }),
}: {
  input: string;
  openai?: OpenAI;
}) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    encoding_format: 'float',
    input,
  });
  return response.data[0].embedding;
};
