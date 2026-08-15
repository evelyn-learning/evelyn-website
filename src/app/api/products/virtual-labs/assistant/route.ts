import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkBurstLimit, checkDailyLimit, getIPFromRequest } from '@core/utils/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI Lab Assistant for a virtual science lab platform. You help students understand physics and chemistry concepts through their simulations.

Your role:
- Explain what's happening in the simulation in clear, educational language
- Answer questions about the physics/chemistry concepts being demonstrated
- Suggest experiments students can try with the simulation parameters
- Point out interesting observations and real-world connections
- Use analogies and simple language appropriate for high school students

Guidelines:
- Keep responses concise (2-4 sentences unless asked for more detail)
- Reference specific simulation parameters (gravity, elasticity, temperature, pressure, etc.) when relevant
- Encourage experimentation and scientific thinking
- Use proper scientific terminology but always explain it
- If a student asks something outside the scope of the simulation, briefly answer but redirect to what they can explore in the lab

You will receive context about the current simulation state (which lab is active, current parameters, what's happening). Use this to give contextual, helpful responses.`;

export async function POST(request: NextRequest) {
  const ip = getIPFromRequest(request);

  const burst = checkBurstLimit(`virtual-labs:${ip}`, 10, 60_000);
  if (!burst.allowed) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'Too many requests. Please wait a moment.' })}\n\n`,
      { status: 429, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  const daily = checkDailyLimit(ip, 'virtual-labs', 50);
  if (!daily.allowed) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', content: 'Daily usage limit reached. Try again tomorrow.' })}\n\n`,
      { status: 429, headers: { 'Content-Type': 'text/event-stream' } }
    );
  }

  try {
    const { messages, labContext } = await request.json();

    const contextMessage = labContext
      ? `\n\n[Current Lab Context: ${labContext}]`
      : '';

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 400,
      system: SYSTEM_PROMPT + contextMessage,
      messages: messages.slice(-10), // Keep last 10 messages for context
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        stream.on('text', (text) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`)
          );
        });

        stream.on('error', (error) => {
          console.error('Virtual labs assistant stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: 'An error occurred. Please try again.' })}\n\n`
            )
          );
          controller.close();
        });

        try {
          const finalMessage = await stream.finalMessage();
          const usage = {
            inputTokens: finalMessage.usage.input_tokens,
            outputTokens: finalMessage.usage.output_tokens,
            model: 'claude-sonnet-4-5-20250929',
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done', usage })}\n\n`)
          );
        } catch {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
          );
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Virtual labs assistant error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
