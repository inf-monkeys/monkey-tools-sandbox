import { encoding_for_model } from '@dqbd/tiktoken';
import { ChatCompletionMessageParam } from 'openai/resources';

export async function countTokens(text: string) {
  if (!text) return 0;
  const encoder = encoding_for_model('gpt-3.5-turbo');

  const tokens = encoder.encode(text);
  encoder.free();
  const length = tokens.length;
  return length;
}

/**
 * Count the tokens for multi-message chat completion requests
 */
export async function getChatRequestTokenCount(
  messages: Array<ChatCompletionMessageParam>,
) {
  const tokensPerRequest = 3; // every reply is primed with <|im_start|>assistant<|im_sep|>

  const tokens = await Promise.all(
    messages.map((message) => getMessageTokenCount(message)),
  );
  const numTokens = tokens.reduce((acc, tkns) => acc + tkns, 0);

  return numTokens + tokensPerRequest;
}

/**
 * Count the tokens for a single message within a chat completion request
 *
 * See "Counting tokens for chat API calls"
 * from https://github.com/openai/openai-cookbook/blob/834181d5739740eb8380096dac7056c925578d9a/examples/How_to_count_tokens_with_tiktoken.ipynb
 */
export async function getMessageTokenCount(
  message: ChatCompletionMessageParam,
) {
  const tokensPerMessage = 4; // every message follows <|start|>{role/name}\n{content}<|end|>\n
  const tokensPerName = -1; // if there's a name, the role is omitted

  let tokens = tokensPerMessage;

  for (const entry of Object.entries(message)) {
    const [key, value] = entry;
    tokens += await countTokens(value);
    if (key === 'name') {
      tokens += tokensPerName;
    }
  }

  return tokens;
}
