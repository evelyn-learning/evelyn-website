import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { EvelynTutor } from './client.js';
import { describeUsage, formatDoctor, runDoctor } from './doctor.js';
import { DASHBOARD_URL, EvelynConfigError, explainError, SANDBOX_URL } from './errors.js';
import { bundledGuide, loadGuide } from './guide.js';
import { fetchLanguages } from './languages.js';
import { loadProjectEnv } from './project-env.js';
import { buildScaffold, FRAMEWORKS, type Framework } from './scaffold.js';
import type { SessionClaims } from './token.js';
import { VERSION } from './version.js';

/** Protocol revisions this server speaks, newest first. */
const PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

const GUIDE_URI = 'evelyn://docs/integration-guide';

const INSTRUCTIONS =
  'Tools for adding the Evelyn Voice Tutor (a hosted AI tutor with voice, whiteboard and typed chat) to an app. ' +
  'Start with evelyn_docs to read the integration guide, then evelyn_scaffold for example files to write into the project. ' +
  'The partner secret is read from the environment or the project env file; never write it into source code or send it to a browser.';

const KEYS_INSTRUCTIONS = `How to get keys for the Evelyn Voice Tutor (a person does this; it cannot be automated):

1. Open ${SANDBOX_URL} and sign up with an email address.
2. Open the confirmation link in the email.
3. The dashboard (${DASHBOARD_URL}) then shows the partner id and the partner secret, with 300 free tutoring minutes. No approval step.
4. Put both in the project's env file, which must be in .gitignore (.env.local for Next.js, .env otherwise):

   EVELYN_PARTNER_ID=<partner id>
   EVELYN_PARTNER_SECRET=<partner secret>

   Running \`npx @evelynlearning/tutor init\` in the project does this step and writes a working example.

The secret signs session tokens and API calls. It stays on the server: never in browser code, a mobile app or a commit.
The sandbox is for evaluation with test data. Before real students use it, write to info@evelynlearning.com for an agreement.`;

/** A JSON Schema object for a tool's arguments. */
type Schema = { type: 'object'; properties: Record<string, unknown>; required?: string[]; additionalProperties: false };

/** One tool: what the assistant reads about it, and what runs. */
interface Tool {
  name: string;
  description: string;
  inputSchema: Schema;
  run(args: Record<string, unknown>): Promise<string>;
}

const noArguments: Schema = { type: 'object', properties: {}, additionalProperties: false };

/** A required string argument of a tool call. */
function requireString(args: Record<string, unknown>, name: string): string {
  const value = args[name];
  if (typeof value !== 'string' || !value) throw new EvelynConfigError(`"${name}" is required and must be a non-empty string.`);
  return value;
}

const TOOLS: Tool[] = [
  {
    name: 'evelyn_docs',
    description:
      'Returns the Evelyn Voice Tutor integration guide as Markdown: session token claims, the embed URL and iframe, Android WebView microphone setup, the worksheet photo flow, API request signing, browser events and usage. ' +
      'Read it before writing any integration code. Free, needs no keys. Fetches the live guide and falls back to the copy bundled with this package when offline.',
    inputSchema: noArguments,
    run: async () => {
      const guide = await loadGuide();
      return `${guide.text}\n\n---\nSource: ${guide.source === 'live' ? 'live guide' : 'copy bundled with @evelynlearning/tutor ' + VERSION + ' (the live guide could not be reached)'}.\nIn Node, the package @evelynlearning/tutor does the token signing and request signing shown above: new EvelynTutor().sessionUrl(claims).`;
    },
  },
  {
    name: 'evelyn_get_keys_instructions',
    description:
      'Explains how the developer gets a partner id and secret (a free sandbox with 300 tutoring minutes) and where to put them. ' +
      'Use it when the keys are missing or another tool reports EVELYN_PARTNER_ID or EVELYN_PARTNER_SECRET not set. Sign-up needs a person and an email address; this tool does not sign up for them. Free, needs no keys.',
    inputSchema: noArguments,
    run: async () => KEYS_INSTRUCTIONS,
  },
  {
    name: 'evelyn_languages',
    description:
      'Lists the languages a lesson can be taught in, with the code to put in tutor_languages (for example ["hi"]) and switch_languages, each language\'s own name, and a first topic in that language for a test lesson. ' +
      'Use it before offering a language choice in the app or creating a session in another language; do not write a fixed list into the app, because the service adds languages (the app can call languages() from @evelynlearning/tutor on its server). Free, needs no keys. Returns the service\'s current list, or the list bundled with this package when offline.',
    inputSchema: noArguments,
    run: async () => {
      const offered = await fetchLanguages({ embedHost: process.env.EVELYN_EMBED_HOST });
      return `${JSON.stringify(offered, null, 2)}\n\nA lesson is in English unless tutor_languages names one of these codes. hi-Latn is Hinglish: spoken Hindi mixed with English, with the board in English.`;
    },
  },
  {
    name: 'evelyn_create_session_url',
    description:
      'Signs a session token and returns the session page URL (https://tutor.evelynlearning.com/embed?token=…) for one student and one lesson. ' +
      'Use it to try a lesson by hand or to check a set of claims; in the app itself the server makes this URL per session with EvelynTutor.sessionUrl. ' +
      'Creating a URL costs nothing: tutoring minutes are used only when someone opens the URL and starts the session. The URL is valid for two hours unless expires_in_seconds says otherwise. Needs the keys in the environment.',
    inputSchema: {
      type: 'object',
      properties: {
        student_id: { type: 'string', description: "The app's own stable id for the student, for example \"test-student\". All data for the student is keyed on it." },
        subject: { type: 'string', description: 'math, science, ela, social-studies (also cs, languages).' },
        level: { type: 'string', description: 'The grade label, for example "Grade 8".' },
        topic: { type: 'string', description: 'Free text in the lesson\'s language. The tutor builds the lesson on it. Send it with target_kind "freestyle".' },
        target_kind: { type: 'string', enum: ['freestyle', 'lessonNode'], description: '"freestyle" for a lesson built on topic; "lessonNode" when curriculum_module names a lesson plan.' },
        student_name: { type: 'string', description: 'First name; the tutor uses it in conversation.' },
        tutor_languages: {
          type: 'array',
          items: { type: 'string' },
          description: 'Leave out for English. One code from evelyn_languages, for example ["zh-TW"], ["hi"] or ["es"], teaches the whole lesson in that language.',
        },
        switch_languages: {
          type: 'array',
          items: { type: 'string' },
          description: 'Languages the student may change the lesson to mid-lesson by asking the tutor: codes from evelyn_languages, or ["all"] for every language. Leave out and the lesson\'s language cannot change.',
        },
        input_mode: { type: 'string', enum: ['voice', 'text'], description: 'voice (default) or text.' },
        max_duration_minutes: { type: 'number', minimum: 1, maximum: 120, description: 'Session time cap. Default 30; a sandbox session ends at 15 minutes whatever this says.' },
        session_goal: { type: 'string', enum: ['homework-help', 'practice', 'concept-review', 'test-prep', 'catch-up', 'challenge', 'general'], description: 'Default concept-review. Use homework-help with the plan id from evelyn_prepare_problem.' },
        curriculum_module: { type: 'string', description: 'A lesson plan id, for example the planId returned by evelyn_prepare_problem. Locks the session to that plan.' },
        session_id: { type: 'string', description: "The app's own id for the session. Otherwise the service makes one." },
        expires_in_seconds: { type: 'number', minimum: 1, description: 'Token lifetime. Default 7200.' },
      },
      required: ['student_id', 'subject', 'level'],
      additionalProperties: false,
    },
    run: async (args) => {
      const { expires_in_seconds: expires, ...claims } = args;
      if (Array.isArray(claims.switch_languages) && claims.switch_languages.length === 1 && claims.switch_languages[0] === 'all') claims.switch_languages = 'all';
      const tutor = new EvelynTutor();
      const url = tutor.sessionUrl(claims as unknown as SessionClaims, typeof expires === 'number' ? { expiresInSeconds: expires } : {});
      return `${url}\n\nOpen it in a browser, or use it as an iframe src with allow="microphone; camera; autoplay; clipboard-write". Anyone with this URL can start the session as this student until it expires, so do not commit it.`;
    },
  },
  {
    name: 'evelyn_usage',
    description:
      'Returns the tutoring minutes used and left for the configured partner (signed GET /api/portal/v1/usage). ' +
      'Use it to confirm the keys work or to see how much of the sandbox allowance is left. Free. Needs the keys in the environment.',
    inputSchema: noArguments,
    run: async () => {
      const usage = await new EvelynTutor().usage();
      return `${describeUsage(usage)}\n\n${JSON.stringify(usage, null, 2)}`;
    },
  },
  {
    name: 'evelyn_read_worksheet',
    description:
      'Sends photos of a worksheet to the service and returns the questions it read, numbered as printed, with the sheet\'s planId (signed POST /api/portal/v1/plan-generate with goal "homework-help"). ' +
      'Use it to try the worksheet flow with a real image file, then call evelyn_prepare_problem with the planId and a question number. ' +
      'Uses no tutoring minutes, but the service reads the image with a model, so the call is slower than the others. Needs the keys in the environment.',
    inputSchema: {
      type: 'object',
      properties: {
        paths: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 4, description: 'Paths of 1 to 4 image files (.jpg, .jpeg, .png, .webp, .gif), each up to 8 MB. Relative paths are read from the project directory.' },
        subject: { type: 'string', description: 'math, science, ela, social-studies (also cs, languages).' },
        grade: { type: 'string', description: 'The grade label, for example "Grade 8".' },
        text: { type: 'string', description: 'A short description of the sheet in the lesson\'s language, at least 3 characters. Optional.' },
        locale: { type: 'string', description: 'The language the session will be taught in, for example "zh-TW". Leave out for English.' },
        student_id: { type: 'string', description: "The app's id for the student whose sheet this is. Optional." },
      },
      required: ['paths', 'subject', 'grade'],
      additionalProperties: false,
    },
    run: async (args) => {
      const paths = args.paths;
      if (!Array.isArray(paths) || paths.length === 0 || paths.some((p) => typeof p !== 'string')) throw new EvelynConfigError('"paths" must be a list of 1 to 4 image file paths.');
      const sheet = await new EvelynTutor().worksheet.read({
        images: (paths as string[]).map((p) => ({ data: resolve(p) })),
        subject: requireString(args, 'subject'),
        grade: requireString(args, 'grade'),
        ...(typeof args.text === 'string' ? { text: args.text } : {}),
        ...(typeof args.locale === 'string' ? { locale: args.locale } : {}),
        ...(typeof args.student_id === 'string' ? { studentId: args.student_id } : {}),
      });
      if (!sheet.problems || sheet.problems.length === 0) {
        return `planId: ${sheet.planId}\nThe service did not split this material into numbered questions. The planId is an ordinary lesson plan on the material: pass it as curriculum_module to evelyn_create_session_url.`;
      }
      return `planId: ${sheet.planId}\n${sheet.problems.length} questions:\n${sheet.problems.map((p) => `${p.n}. ${p.text}`).join('\n')}\n\nNext: evelyn_prepare_problem with this planId and the number of the question the student picked.`;
    },
  },
  {
    name: 'evelyn_prepare_problem',
    description:
      'Prepares one question of a worksheet for tutoring and returns that question\'s own plan id (signed POST /api/portal/v1/homework-problem-plan). ' +
      'Use it after evelyn_read_worksheet. Then open the session with evelyn_create_session_url, passing the returned plan id as curriculum_module and session_goal "homework-help" (no topic, no target_kind). ' +
      'Uses no tutoring minutes. Waits up to 8 seconds for the question to be prepared. Needs the keys in the environment.',
    inputSchema: {
      type: 'object',
      properties: {
        plan_id: { type: 'string', description: 'The planId returned by evelyn_read_worksheet.' },
        n: { type: 'integer', minimum: 1, description: 'The number of the question, as listed by evelyn_read_worksheet.' },
        locale: { type: 'string', description: 'The language the session is taught in, if the sheet was read without a locale.' },
      },
      required: ['plan_id', 'n'],
      additionalProperties: false,
    },
    run: async (args) => {
      const plan = await new EvelynTutor().worksheet.prepare(requireString(args, 'plan_id'), args.n as number, typeof args.locale === 'string' ? { locale: args.locale } : {});
      return `${JSON.stringify(plan, null, 2)}\n\nOpen the session with claims { session_goal: "homework-help", curriculum_module: "${plan.planId}" } plus student_id, subject and level. buildStatus "ready" means the answer was checked before the session; with "preparing" or "unverified" the session still runs.`;
    },
  },
  {
    name: 'evelyn_scaffold',
    description:
      'Returns the contents of a minimal working example for a framework: a server route that returns a session URL and a page that shows the tutor in an iframe. Nothing is written to disk; write the files into the project yourself and adapt them (take student_id from the app\'s own auth). ' +
      'Use it when adding the tutor to a Next.js, Express or plain Node project. Free, needs no keys.',
    inputSchema: {
      type: 'object',
      properties: {
        framework: { type: 'string', enum: [...FRAMEWORKS], description: 'next (App Router), express, or node (a standalone http server).' },
        typescript: { type: 'boolean', description: 'Next.js only: name the files .ts/.tsx. Default true.' },
        src_dir: { type: 'boolean', description: 'Next.js only: the app directory is src/app. Default false.' },
        esm: { type: 'boolean', description: 'Express only: the project uses ES modules ("type": "module"). Default false.' },
      },
      required: ['framework'],
      additionalProperties: false,
    },
    run: async (args) => {
      const framework = args.framework as Framework;
      if (!FRAMEWORKS.includes(framework)) throw new EvelynConfigError(`"framework" must be one of: ${FRAMEWORKS.join(', ')}.`);
      const scaffold = buildScaffold({ framework, typescript: args.typescript !== false, srcDir: args.src_dir === true, esm: args.esm === true });
      const files = scaffold.files.map((file) => `File: ${file.path}\n\`\`\`\n${file.content}\`\`\``).join('\n\n');
      return `${files}\n\nKeys go in ${scaffold.envFile} (keep it in .gitignore):\nEVELYN_PARTNER_ID=…\nEVELYN_PARTNER_SECRET=…\n\nThen:\n1. npm install @evelynlearning/tutor\n${scaffold.nextSteps.map((step, i) => `${i + 2}. ${step}`).join('\n')}`;
    },
  },
  {
    name: 'evelyn_doctor',
    description:
      'Checks the integration\'s setup: both keys present, this machine\'s clock against the API\'s (requests are refused beyond 5 minutes of difference), and one signed GET /api/portal/v1/usage. Reports each check with what to change. ' +
      'Use it first when anything fails with 401, or after the keys are added. Free; never prints the secret.',
    inputSchema: noArguments,
    run: async () => formatDoctor(await runDoctor()),
  },
];

/** A JSON-RPC message as it arrives. */
interface RpcMessage {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

/** A JSON-RPC success reply. */
function result(id: RpcMessage['id'], value: unknown): object {
  return { jsonrpc: '2.0', id, result: value };
}

/** A JSON-RPC error reply. */
function failure(id: RpcMessage['id'], code: number, message: string): object {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
}

/**
 * Answers one JSON-RPC message. Returns nothing for a notification (a message with no id), which is
 * accepted and ignored. Exported for tests; `startMcpServer` runs it over stdio.
 */
export async function handleMessage(message: RpcMessage): Promise<object | undefined> {
  if (!message || typeof message !== 'object' || typeof message.method !== 'string') {
    return failure(message?.id, -32600, 'Invalid request');
  }
  if (message.id === undefined) return undefined;
  const { id, method, params = {} } = message;

  switch (method) {
    case 'initialize': {
      const requested = params.protocolVersion;
      return result(id, {
        protocolVersion: typeof requested === 'string' && PROTOCOL_VERSIONS.includes(requested) ? requested : PROTOCOL_VERSIONS[0],
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: 'evelyn-tutor', version: VERSION },
        instructions: INSTRUCTIONS,
      });
    }
    case 'ping':
      return result(id, {});
    case 'tools/list':
      return result(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case 'tools/call': {
      const tool = TOOLS.find((candidate) => candidate.name === params.name);
      if (!tool) return failure(id, -32602, `Unknown tool: ${String(params.name)}`);
      try {
        // Read on every call, so keys added to the env file while the server runs are picked up.
        loadProjectEnv(process.cwd());
        const args = params.arguments && typeof params.arguments === 'object' ? (params.arguments as Record<string, unknown>) : {};
        return result(id, { content: [{ type: 'text', text: await tool.run(args) }] });
      } catch (err) {
        // A tool's failure is a result the assistant can read and act on, not a protocol error.
        return result(id, { content: [{ type: 'text', text: explainError(err) }], isError: true });
      }
    }
    case 'resources/list':
      return result(id, {
        resources: [{ uri: GUIDE_URI, name: 'Evelyn Voice Tutor integration guide', description: 'The whole integration in one Markdown file (the copy bundled with this package).', mimeType: 'text/markdown' }],
      });
    case 'resources/read':
      if (params.uri !== GUIDE_URI) return failure(id, -32002, `Resource not found: ${String(params.uri)}`);
      return result(id, { contents: [{ uri: GUIDE_URI, mimeType: 'text/markdown', text: bundledGuide() }] });
    default:
      return failure(id, -32601, `Method not found: ${method}`);
  }
}

/**
 * Runs the MCP server on stdio: one JSON-RPC message per line in, one per line out. Standard output
 * carries protocol messages only. Keys are read from the environment, then from the project's
 * `.env.local` / `.env` in the directory the server was started in.
 */
export function startMcpServer(): void {
  const send = (message: object): void => {
    process.stdout.write(`${JSON.stringify(message)}\n`);
  };
  const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
  lines.on('line', (line) => {
    if (!line.trim()) return;
    let message: RpcMessage;
    try {
      message = JSON.parse(line) as RpcMessage;
    } catch {
      send(failure(null, -32700, 'Parse error'));
      return;
    }
    void handleMessage(message).then((reply) => {
      if (reply) send(reply);
    });
  });
}
