import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** The env files a project keeps its keys in, in the order they are read. */
const ENV_FILES = ['.env.local', '.env'] as const;

/** The `KEY=value` pairs of an env file. Quotes around a value and a leading `export` are dropped. */
export function parseEnv(text: string): Map<string, string> {
  const entries = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    const value = match[2]!;
    const quoted = /^(["'])(.*)\1$/.exec(value);
    entries.set(match[1]!, quoted ? quoted[2]! : value);
  }
  return entries;
}

/**
 * Makes a project's own `EVELYN_*` keys available to the command line and the MCP server: any that the
 * environment does not already set are read from `.env.local`, then `.env`, in `dir`. Other keys are left alone.
 */
export function loadProjectEnv(dir: string, env: NodeJS.ProcessEnv = process.env): void {
  for (const name of ENV_FILES) {
    const file = join(dir, name);
    if (!existsSync(file)) continue;
    for (const [key, value] of parseEnv(readFileSync(file, 'utf8'))) {
      if (key.startsWith('EVELYN_') && value && !env[key]) env[key] = value;
    }
  }
}

/**
 * Adds keys to an env file without touching what is there: a key the file already defines is kept as it is.
 * Returns which keys were added and which were kept.
 */
export function addEnvEntries(file: string, entries: Record<string, string>): { added: string[]; kept: string[] } {
  const current = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const present = parseEnv(current);
  const added = Object.keys(entries).filter((key) => !present.has(key));
  const kept = Object.keys(entries).filter((key) => present.has(key));
  if (added.length > 0) {
    const gap = current === '' || current.endsWith('\n') ? '' : '\n';
    writeFileSync(file, `${current}${gap}${added.map((key) => `${key}=${entries[key]}\n`).join('')}`, { mode: 0o600 });
  }
  return { added, kept };
}

/** Whether a .gitignore's patterns cover a file in the project root (plain names and `*` globs; negations are not followed). */
function ignores(gitignore: string, fileName: string): boolean {
  return gitignore.split(/\r?\n/).some((raw) => {
    const pattern = raw.trim().replace(/^\//, '');
    if (!pattern || pattern.startsWith('#') || pattern.startsWith('!')) return false;
    const regex = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
    return regex.test(fileName);
  });
}

/**
 * Makes sure git will not pick up the env file: adds it to `.gitignore`, creating the file when there is none.
 * Returns what was done.
 */
export function ensureGitignored(dir: string, fileName: string): 'already' | 'added' | 'created' {
  const file = join(dir, '.gitignore');
  if (!existsSync(file)) {
    writeFileSync(file, `${fileName}\n`);
    return 'created';
  }
  const current = readFileSync(file, 'utf8');
  if (ignores(current, fileName)) return 'already';
  writeFileSync(file, `${current}${current === '' || current.endsWith('\n') ? '' : '\n'}${fileName}\n`);
  return 'added';
}
