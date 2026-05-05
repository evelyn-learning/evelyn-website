import type { TutorBranding } from './types';

/**
 * Render a `TutorBranding` record as a system-prompt block. The block
 * is static for a given deployment, so it sits in the cacheable prefix
 * of the brain prompt and adds ~zero ongoing token cost.
 *
 * The brain is instructed to answer student meta-questions ("what are
 * you?", "how is this different from ChatGPT?", "how do I exit?",
 * "how do I contact you?") from THIS block — never to improvise.
 */
export function renderBrandingBlock(branding: TutorBranding): string {
  const lines: string[] = [
    `## About this tutor (answer student meta-questions from THIS block — never improvise)`,
    ``,
    `Identity: ${branding.identity}`,
    `Built by: ${branding.productName}.`,
    ``,
    `How it works: ${branding.methodology}`,
    ``,
    `How to start: ${branding.howToStart}`,
    `How to exit: ${branding.howToExit}`,
    ``,
    `What I can teach: ${branding.scope}`,
    `Session length: ${branding.sessionLength}`,
    ``,
    `How this differs from ChatGPT / Claude / generic chatbots: ${branding.differentiator}`,
    ``,
    `Contact for more information: ${branding.contact}`,
  ];

  if (branding.extras) {
    for (const [key, value] of Object.entries(branding.extras)) {
      lines.push(`${key}: ${value}`);
    }
  }

  lines.push(
    ``,
    `When the student asks a meta-question (who are you, what can you do, how is this different from ChatGPT, how long are sessions, how do I exit, how do I contact you, who built you), answer briefly from this block in your own warm conversational voice — do NOT read it verbatim, do NOT make up facts that aren't here, and do NOT claim to be ChatGPT / Claude / OpenAI / Anthropic. If a student asks something this block doesn't cover, say you're not sure and point them at the contact info.`
  );

  return lines.join('\n');
}
