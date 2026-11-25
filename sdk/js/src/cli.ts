import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { EvelynTutor } from './client.js';
import { describeUsage, formatDoctor, runDoctor } from './doctor.js';
import { DASHBOARD_URL, EvelynConfigError, explainError, SANDBOX_URL } from './errors.js';
import { loadGuide } from './guide.js';
import { fetchLanguages, type Language } from './languages.js';
import { startMcpServer } from './mcp.js';
import { addEnvEntries, ensureGitignored, loadProjectEnv } from './project-env.js';
import { buildScaffold, detectProject, FRAMEWORKS, type Framework } from './scaffold.js';
import type { SessionClaims, SessionGoal } from './token.js';
import { VERSION } from './version.js';

const HELP = `evelyn-tutor ${VERSION}: set up and check an Evelyn Voice Tutor integration

Usage: npx @evelynlearning/tutor <command> [options]

Commands
  init      Save your keys in the project's env file and write a working example
              --yes                 no questions; keys come from the environment
              --force               overwrite example files that already exist
              --framework <name>    next, express or node (default: read from package.json)
              --partner-id <id>     your partner id (the secret is asked for, or read from EVELYN_PARTNER_SECRET)
              --dir <path>          the project directory (default: the current one)
  token     Print a session URL
              --student <id>        your id for the student (required)
              --topic <text>        what the lesson is on
              --subject <name>      default: math
              --level <label>       default: "Grade 8"
              --language <code>     a code from "evelyn-tutor languages"; leave out for English
              --switch <all|codes>  languages the student may change to by asking: all, or hi,es
              --mode <voice|text>   default: voice
              --name <first name>   the student's first name
              --minutes <1-120>     session time cap
              --plan <plan id>      open a prepared lesson plan or worksheet question
              --goal <goal>         for example homework-help
              --expires <seconds>   token lifetime (default: 7200)
  languages List the languages a lesson can be taught in (--json for the raw list)
  usage     Print tutoring minutes used and left (--json for the raw answer)
  doctor    Check the keys, this machine's clock, one signed API call, and for a newer version
  docs      Print the integration guide
  mcp       Run the MCP server on stdio, for coding assistants

Keys are read from EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET, or from .env.local / .env in the
current directory. Get them at ${SANDBOX_URL}
`;

const BOOLEAN_FLAGS = new Set(['yes', 'force', 'json', 'help']);

/** The options each command takes. A misspelt option is refused, not ignored. */
const COMMAND_FLAGS: Record<string, readonly string[]> = {
  init: ['yes', 'force', 'framework', 'partner-id', 'dir'],
  token: ['student', 'topic', 'subject', 'level', 'language', 'switch', 'mode', 'name', 'minutes', 'plan', 'goal', 'expires'],
  languages: ['json'],
  usage: ['json'],
  doctor: [],
  docs: [],
};

/** Splits `--name value`, `--name=value` and bare flags from a command's arguments. */
function parseFlags(command: string, args: string[]): Map<string, string> {
  const allowed = COMMAND_FLAGS[command];
  if (!allowed) throw new EvelynConfigError(`Unknown command "${command}". Run evelyn-tutor help for the list.`);
  const flags = new Map<string, string>();
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]!;
    if (!arg.startsWith('--')) throw new EvelynConfigError(`Unexpected argument "${arg}". Options are written --name value.`);
    const [name, inline] = arg.slice(2).split(/=(.*)/s) as [string, string | undefined];
    if (name !== 'help' && !allowed.includes(name)) {
      throw new EvelynConfigError(`"${command}" has no option --${name}.${allowed.length > 0 ? ` Its options: ${allowed.map((flag) => `--${flag}`).join(', ')}.` : ''}`);
    }
    if (BOOLEAN_FLAGS.has(name)) {
      flags.set(name, 'true');
    } else if (inline !== undefined) {
      flags.set(name, inline);
    } else {
      const value = args[i + 1];
      if (value === undefined || value.startsWith('--')) throw new EvelynConfigError(`--${name} needs a value.`);
      flags.set(name, value);
      i += 1;
    }
  }
  return flags;
}

/** Asks one question on the terminal. With `hidden`, what is typed is not shown. */
function ask(question: string, hidden = false): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, _encoding, done) {
      if (!muted) process.stdout.write(chunk);
      done();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  return new Promise((resolveAnswer) => {
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolveAnswer(answer.trim());
    });
    muted = hidden;
  });
}

/** `init`: saves the keys in the project's env file, keeps that file out of git, and writes the example files. */
async function init(flags: Map<string, string>): Promise<void> {
  const dir = resolve(flags.get('dir') ?? '.');
  if (!existsSync(dir)) throw new EvelynConfigError(`${dir} does not exist.`);
  const interactive = !flags.has('yes') && !!process.stdin.isTTY;
  loadProjectEnv(dir);

  const layout = detectProject(dir);
  const requested = flags.get('framework');
  if (requested !== undefined) {
    if (!FRAMEWORKS.includes(requested as Framework)) throw new EvelynConfigError(`--framework must be one of: ${FRAMEWORKS.join(', ')}.`);
    layout.framework = requested as Framework;
  }
  const scaffold = buildScaffold(layout);
  console.log(`Project: ${dir} (${layout.framework})`);

  let partnerId = flags.get('partner-id') ?? process.env.EVELYN_PARTNER_ID ?? '';
  let secret = process.env.EVELYN_PARTNER_SECRET ?? '';
  if (interactive && (!partnerId || !secret)) {
    console.log(`\nYou need a partner id and a secret. Sign up at ${SANDBOX_URL} with an email address,`);
    console.log(`confirm the emailed link, and copy both from ${DASHBOARD_URL}. The sandbox has 300 free tutoring minutes.\n`);
    if (!partnerId) partnerId = await ask('Partner id: ');
    if (!secret) secret = await ask('Partner secret (not shown): ', true);
  }

  if (partnerId && secret) {
    const { added, kept } = addEnvEntries(join(dir, scaffold.envFile), { EVELYN_PARTNER_ID: partnerId, EVELYN_PARTNER_SECRET: secret });
    if (added.length > 0) console.log(`Wrote ${added.join(' and ')} to ${scaffold.envFile}.`);
    if (kept.length > 0) console.log(`Kept ${kept.join(' and ')} as already set in ${scaffold.envFile}.`);
    try {
      const result = ensureGitignored(dir, scaffold.envFile);
      if (result === 'created') console.log(`Created .gitignore with ${scaffold.envFile}, so the secret is not committed.`);
      if (result === 'added') console.log(`Added ${scaffold.envFile} to .gitignore, so the secret is not committed.`);
    } catch (err) {
      console.warn(`Warning: could not update .gitignore (${(err as Error).message}). Make sure ${scaffold.envFile} is never committed: it holds your secret.`);
    }
  } else {
    console.log(`No keys saved: set EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET in ${scaffold.envFile} yourself.`);
    console.log(`Get them at ${SANDBOX_URL} (email, confirm the link, copy both from the dashboard).`);
  }

  for (const file of scaffold.files) {
    const target = join(dir, file.path);
    if (existsSync(target) && !flags.has('force')) {
      console.log(`Kept ${file.path} (it exists; --force overwrites it).`);
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
    console.log(`Wrote ${file.path}.`);
  }

  const steps = [...scaffold.nextSteps];
  if (!dependsOnPackage(dir)) steps.unshift('Install the package: npm install @evelynlearning/tutor');
  console.log(`\nNext:\n${steps.map((step, i) => `  ${i + 1}. ${step}`).join('\n')}`);
  console.log('\nCheck the setup at any time with: npx @evelynlearning/tutor doctor');
}

/** Whether the project's package.json already lists this package. */
function dependsOnPackage(dir: string): boolean {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { dependencies?: Record<string, unknown>; devDependencies?: Record<string, unknown> };
    return '@evelynlearning/tutor' in { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {
    return false;
  }
}

/** The list's own spelling of a language code typed on the command line (`zh-tw` → `zh-TW`), or an error naming the codes. */
function languageCode(typed: string, offered: Language[], flag: string): string {
  const match = offered.find((language) => language.code.toLowerCase() === typed.trim().toLowerCase());
  if (!match) throw new EvelynConfigError(`--${flag}: "${typed}" is not a lesson language. The codes: ${offered.map((language) => language.code).join(', ')}.`);
  return match.code;
}

/** `languages`: prints the languages a lesson can be taught in. */
async function languages(flags: Map<string, string>): Promise<void> {
  const offered = await fetchLanguages({ embedHost: process.env.EVELYN_EMBED_HOST });
  if (flags.has('json')) return console.log(JSON.stringify(offered, null, 2));
  const width = Math.max(...offered.map((language) => language.code.length));
  console.log(offered.map((language) => `${language.code.padEnd(width)}  ${language.english}${language.label === language.english ? '' : ` (${language.label})`}`).join('\n'));
}

/** `token`: prints a session URL built from the flags. */
async function token(flags: Map<string, string>): Promise<void> {
  const student = flags.get('student');
  if (!student) throw new EvelynConfigError('--student is required: your id for the student, for example --student test-student.');
  const mode = flags.get('mode');
  if (mode !== undefined && mode !== 'voice' && mode !== 'text') throw new EvelynConfigError('--mode must be voice or text.');
  const plan = flags.get('plan');
  const topic = flags.get('topic');
  const language = flags.get('language');
  const switchTo = flags.get('switch');
  const offered = language !== undefined || (switchTo !== undefined && switchTo !== 'all') ? await fetchLanguages({ embedHost: process.env.EVELYN_EMBED_HOST }) : [];
  const claims: SessionClaims = {
    student_id: student,
    subject: flags.get('subject') ?? 'math',
    level: flags.get('level') ?? 'Grade 8',
    ...(flags.has('name') ? { student_name: flags.get('name') } : {}),
    ...(topic ? { topic } : {}),
    ...(topic && !plan ? { target_kind: 'freestyle' as const } : {}),
    ...(plan ? { curriculum_module: plan } : {}),
    ...(flags.has('goal') ? { session_goal: flags.get('goal') as SessionGoal } : {}),
    ...(language !== undefined ? { tutor_languages: [languageCode(language, offered, 'language')] } : {}),
    ...(switchTo === 'all' ? { switch_languages: 'all' as const } : {}),
    ...(switchTo !== undefined && switchTo !== 'all' ? { switch_languages: switchTo.split(',').map((code) => languageCode(code, offered, 'switch')) } : {}),
    ...(mode ? { input_mode: mode } : {}),
    ...(flags.has('minutes') ? { max_duration_minutes: Number(flags.get('minutes')) } : {}),
  };
  const expires = flags.get('expires');
  console.log(new EvelynTutor().sessionUrl(claims, expires === undefined ? {} : { expiresInSeconds: Number(expires) }));
}

/** `usage`: prints the minutes used and left. */
async function usage(flags: Map<string, string>): Promise<void> {
  const answer = await new EvelynTutor().usage();
  console.log(flags.has('json') ? JSON.stringify(answer, null, 2) : describeUsage(answer));
}

/** `doctor`: prints the setup checks; exits 1 when one fails. */
async function doctor(): Promise<void> {
  const checks = await runDoctor();
  console.log(formatDoctor(checks));
  if (!checks.every((check) => check.ok)) process.exitCode = 1;
}

/**
 * Runs the command line. Errors are printed as one plain line and set a non-zero exit code;
 * the secret is never printed.
 */
export async function main(argv: string[]): Promise<void> {
  const [command, ...rest] = argv;
  try {
    if (command === 'mcp') return startMcpServer();
    if (command === '--version' || command === '-v') return console.log(VERSION);
    if (command === undefined || command === 'help' || command === '--help' || command === '-h') return console.log(HELP);
    const flags = parseFlags(command, rest);
    if (flags.has('help')) return console.log(HELP);
    if (command === 'init') return await init(flags);
    loadProjectEnv(process.cwd());
    if (command === 'token') return await token(flags);
    if (command === 'languages') return await languages(flags);
    if (command === 'usage') return await usage(flags);
    if (command === 'doctor') return await doctor();
    return console.log((await loadGuide()).text);
  } catch (err) {
    console.error(`Error: ${explainError(err)}`);
    process.exitCode = 1;
  }
}
