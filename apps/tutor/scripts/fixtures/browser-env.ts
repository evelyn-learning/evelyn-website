/**
 * The brain's system prompt is built in the BROWSER. These prompt flags are
 * server-only (not NEXT_PUBLIC_, not exposed by next.config), so there they
 * are undefined — and `core` (BASE_PROMPT + branding) is the same for every
 * session. A Node script that loads .env.local sees them set, which makes
 * `core` vary by subject and measures a prompt production never sends.
 */
export const SERVER_ONLY_PROMPT_FLAGS = [
  'TUTOR_TOOL_SUBJECT_FILTER',
  'TUTOR_BOARD_ANCHORED_SPEECH',
  'TUTOR_SKETCH',
  'TUTOR_ANSWER_EQUIVALENCE',
] as const;

/** Make this Node process build the prompt the way the browser does. */
export function unsetServerOnlyPromptFlags(): void {
  for (const f of SERVER_ONLY_PROMPT_FLAGS) delete process.env[f];
}

/** True when a server-only prompt flag would reach the browser build: named
 *  in next.config (an `env` exposure) or read under a NEXT_PUBLIC_ name. */
export function exposesServerOnlyPromptFlags(nextConfigSrc: string, builderSrc: string): boolean {
  return SERVER_ONLY_PROMPT_FLAGS.some(
    (f) => nextConfigSrc.includes(f) || builderSrc.includes(`NEXT_PUBLIC_${f}`),
  );
}
