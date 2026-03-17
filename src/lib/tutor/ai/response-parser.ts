/**
 * Response Parser
 *
 * Parses AI tutor responses to extract:
 * - Clean text for TTS (without whiteboard commands)
 * - Whiteboard commands to execute
 * - Pedagogical intent
 */

import type { WhiteboardCommand } from '../../knowledge/types';
import type { PedagogicalIntent } from '../types';

export interface ParsedResponse {
  cleanText: string;
  commands: WhiteboardCommand[];
  pedagogicalIntent?: PedagogicalIntent;
}

/**
 * Parse whiteboard commands from AI response
 */
export function parseWhiteboardCommands(response: string): ParsedResponse {
  const commands: WhiteboardCommand[] = [];

  // Extract whiteboard code blocks
  const whiteboardRegex = /```whiteboard\s*([\s\S]*?)```/g;
  let match;
  let cleanText = response;

  while ((match = whiteboardRegex.exec(response)) !== null) {
    const commandBlock = match[1].trim();

    try {
      // Try to parse as JSON
      const command = JSON.parse(commandBlock);

      // Validate it's a valid whiteboard command
      if (isValidWhiteboardCommand(command)) {
        commands.push(command);
      }
    } catch {
      // Try to parse multiple commands (one per line)
      const lines = commandBlock.split('\n').filter((l) => l.trim());
      for (const line of lines) {
        try {
          const command = JSON.parse(line.trim());
          if (isValidWhiteboardCommand(command)) {
            commands.push(command);
          }
        } catch {
          console.warn('[ResponseParser] Failed to parse whiteboard command:', line);
        }
      }
    }
  }

  // Remove whiteboard blocks from text
  cleanText = cleanText.replace(/```whiteboard\s*[\s\S]*?```/g, '').trim();

  // Also remove any JSON-like objects that might be inline commands
  cleanText = cleanText.replace(/\{[\s\S]*?"action"[\s\S]*?\}/g, '').trim();

  // Clean up any double spaces or newlines
  cleanText = cleanText.replace(/\n{3,}/g, '\n\n').replace(/  +/g, ' ').trim();

  // Detect pedagogical intent
  const pedagogicalIntent = detectPedagogicalIntent(cleanText);

  return {
    cleanText,
    commands,
    pedagogicalIntent,
  };
}

/**
 * Validate that an object is a valid whiteboard command
 */
function isValidWhiteboardCommand(obj: unknown): obj is WhiteboardCommand {
  if (!obj || typeof obj !== 'object') return false;

  const command = obj as { action?: string };
  if (!command.action) return false;

  const validActions = [
    'clear',
    'newPage',
    'goToPage',
    'showEquation',
    'showGraph',
    'showDiagram',
    'drawVector',
    'annotate',
    'highlight',
    'showProblem',
    'showSolution',
    'showWorkedExample',
    'showTable',
    'showImage',
    'showSvgDiagram',
    'showCode',
  ];

  return validActions.includes(command.action);
}

/**
 * Detect the pedagogical intent of a tutor message
 */
function detectPedagogicalIntent(text: string): PedagogicalIntent | undefined {
  const lower = text.toLowerCase();

  // Question detection
  if (text.includes('?')) {
    // Socratic questions
    if (
      lower.includes('what do you think') ||
      lower.includes('why do you think') ||
      lower.includes('what would happen') ||
      lower.includes('how would') ||
      lower.includes('can you explain')
    ) {
      return 'question';
    }
  }

  // Greeting detection
  if (
    lower.includes('welcome') ||
    lower.includes('hello') ||
    lower.includes('hi there') ||
    lower.includes("let's get started")
  ) {
    return 'greeting';
  }

  // Hint detection
  if (
    lower.includes('hint') ||
    lower.includes('here\'s a clue') ||
    lower.includes('think about') ||
    lower.includes('consider') ||
    lower.includes('remember that')
  ) {
    return 'hint';
  }

  // Encouragement detection
  if (
    lower.includes('great') ||
    lower.includes('excellent') ||
    lower.includes('good job') ||
    lower.includes('nice work') ||
    lower.includes('exactly') ||
    lower.includes('perfect') ||
    lower.includes('well done')
  ) {
    return 'encouragement';
  }

  // Correction detection
  if (
    lower.includes('not quite') ||
    lower.includes('actually') ||
    lower.includes('let me clarify') ||
    lower.includes('careful') ||
    lower.includes('watch out')
  ) {
    return 'correction';
  }

  // Summary detection
  if (
    lower.includes('to summarize') ||
    lower.includes('in summary') ||
    lower.includes('so today we') ||
    lower.includes('we covered') ||
    lower.includes('key takeaways')
  ) {
    return 'summary';
  }

  // Explanation detection
  if (
    lower.includes('let me explain') ||
    lower.includes('this means') ||
    lower.includes('the reason is') ||
    lower.includes('in other words') ||
    text.length > 200 // Long responses are usually explanations
  ) {
    return 'explanation';
  }

  // Problem presentation
  if (
    lower.includes("here's a problem") ||
    lower.includes('try this') ||
    lower.includes("let's work on") ||
    lower.includes('solve for')
  ) {
    return 'problem-presentation';
  }

  // Feedback detection
  if (
    lower.includes('your answer') ||
    lower.includes('that gives us') ||
    lower.includes('the result')
  ) {
    return 'feedback';
  }

  return undefined;
}

/**
 * Clean text for TTS by removing any remaining technical artifacts
 */
export function cleanTextForTTS(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    // Remove headers
    .replace(/^#+\s*/gm, '')
    // Remove links
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove bullet points
    .replace(/^[-*]\s*/gm, '')
    // Clean up LaTeX
    .replace(/\$\$(.*?)\$\$/g, (_, expr) => latexToSpeech(expr))
    .replace(/\$(.*?)\$/g, (_, expr) => latexToSpeech(expr))
    // Clean up whitespace
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/  +/g, ' ')
    .trim();
}

/**
 * Convert simple LaTeX to speakable text
 */
function latexToSpeech(latex: string): string {
  return (
    latex
      // Fractions
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, '$1 over $2')
      // Subscripts
      .replace(/_\{(.*?)\}/g, ' sub $1')
      .replace(/_(.)/g, ' sub $1')
      // Superscripts
      .replace(/\^\{(.*?)\}/g, ' to the power of $1')
      .replace(/\^2/g, ' squared')
      .replace(/\^3/g, ' cubed')
      .replace(/\^(.)/g, ' to the $1')
      // Greek letters
      .replace(/\\alpha/g, 'alpha')
      .replace(/\\beta/g, 'beta')
      .replace(/\\gamma/g, 'gamma')
      .replace(/\\delta/g, 'delta')
      .replace(/\\Delta/g, 'delta')
      .replace(/\\theta/g, 'theta')
      .replace(/\\pi/g, 'pi')
      // Common symbols
      .replace(/\\cdot/g, ' times ')
      .replace(/\\times/g, ' times ')
      .replace(/\\div/g, ' divided by ')
      .replace(/\\pm/g, ' plus or minus ')
      .replace(/\\leq/g, ' less than or equal to ')
      .replace(/\\geq/g, ' greater than or equal to ')
      .replace(/\\neq/g, ' not equal to ')
      .replace(/\\approx/g, ' approximately ')
      .replace(/\\sqrt\{(.*?)\}/g, 'square root of $1')
      // Clean up remaining backslashes
      .replace(/\\/g, '')
      // Clean up braces
      .replace(/[{}]/g, '')
  );
}
