/// <reference types="node" />
/**
 * Tiny Claude helper shared by the e2e harness (cooperative-student driver) and
 * the judge. Uses claude-sonnet-4-6 + plain messages.create (SDK 0.71.2 types
 * output_config only on the beta path and doesn't type adaptive thinking).
 */
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';

export function loadApiKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const env = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const m = env.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  } catch { /* ignore */ }
  throw new Error('ANTHROPIC_API_KEY not set (env or .env.local)');
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: loadApiKey() });
  return client;
}

/** One-shot completion. Returns the concatenated text blocks, trimmed. */
export async function askClaude(system: string, user: string, maxTokens = 400): Promise<string> {
  const msg = await getClient().messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}
