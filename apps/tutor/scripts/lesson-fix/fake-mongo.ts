/**
 * A very small in-memory stand-in for the parts of the mongosh `db` object
 * the generated lesson-correction script uses. Test support only — it never
 * opens a connection. Implements exactly: getName, <collection>.find(filter,
 * projection).toArray(), <collection>.updateOne(filter, {$set,$push,$pop}).
 *
 * Path rules follow MongoDB's: a numeric path component on an array is an
 * index; a non-numeric component on an array matches any element.
 */

type Doc = Record<string, unknown>;

function resolve(value: unknown, parts: readonly string[]): unknown[] {
  if (parts.length === 0) return [value];
  const [head, ...rest] = parts;
  if (Array.isArray(value)) {
    if (/^\d+$/.test(head)) return Number(head) < value.length ? resolve(value[Number(head)], rest) : [];
    return value.flatMap((el) => resolve(el, parts));
  }
  if (value && typeof value === 'object' && head in (value as Doc)) return resolve((value as Doc)[head], rest);
  return [];
}

function matchesCondition(candidates: unknown[], cond: unknown): boolean {
  if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
    const c = cond as Record<string, unknown>;
    const ops = Object.keys(c);
    if (ops.every((k) => k.startsWith('$'))) {
      return ops.every((op) => {
        if (op === '$in') return candidates.some((v) => (Array.isArray(v) ? v : [v]).some((x) => (c.$in as unknown[]).includes(x)));
        if (op === '$nin') return !candidates.some((v) => (Array.isArray(v) ? v : [v]).some((x) => (c.$nin as unknown[]).includes(x)));
        if (op === '$size') return candidates.some((v) => Array.isArray(v) && v.length === c.$size);
        throw new Error(`fake-mongo: unsupported query operator ${op}`);
      });
    }
  }
  return candidates.some((v) => v === cond || (Array.isArray(v) && v.includes(cond)));
}

function matches(doc: Doc, filter: Record<string, unknown>): boolean {
  return Object.entries(filter).every(([p, cond]) => matchesCondition(resolve(doc, p.split('.')), cond));
}

function parentOf(doc: Doc, pathText: string): { parent: Record<string, unknown> | unknown[]; key: string } {
  const parts = pathText.split('.');
  let cur: unknown = doc;
  for (const part of parts.slice(0, -1)) {
    if (Array.isArray(cur)) cur = cur[Number(part)];
    else cur = (cur as Doc)[part];
    if (cur === undefined || cur === null) throw new Error(`fake-mongo: path ${pathText} does not exist`);
  }
  return { parent: cur as Record<string, unknown> | unknown[], key: parts[parts.length - 1] };
}

export interface FakeDb {
  getName(): string;
  lessonplans: {
    find(filter: Record<string, unknown>, projection?: Record<string, unknown>): { toArray(): Doc[] };
    updateOne(filter: Record<string, unknown>, update: Record<string, Record<string, unknown>>): { matchedCount: number; modifiedCount: number };
  };
}

export interface FakeDbHandle {
  db: FakeDb;
  /** The live documents (mutated by updateOne). */
  docs: Doc[];
  /** Every updateOne call that matched a document. */
  writes: Array<{ filter: Record<string, unknown>; update: Record<string, unknown> }>;
  /** Called before each updateOne — lets a test change a document "between
   *  the read and the write". */
  beforeUpdate?: (docs: Doc[]) => void;
}

export function makeFakeDb(name: string, initial: readonly Doc[]): FakeDbHandle {
  const handle: FakeDbHandle = {
    docs: JSON.parse(JSON.stringify(initial)) as Doc[],
    writes: [],
    db: {
      getName: () => name,
      lessonplans: {
        find(filter, projection) {
          const found = handle.docs.filter((d) => matches(d, filter));
          const copy = JSON.parse(JSON.stringify(found)) as Doc[];
          const keys = projection ? Object.keys(projection) : [];
          return { toArray: () => (keys.length ? copy.map((d) => Object.fromEntries(keys.map((k) => [k, d[k]]))) : copy) };
        },
        updateOne(filter, update) {
          handle.beforeUpdate?.(handle.docs);
          const doc = handle.docs.find((d) => matches(d, filter));
          if (!doc) return { matchedCount: 0, modifiedCount: 0 };
          const before = JSON.stringify(doc);
          const touched = new Set<string>();
          const claim = (p: string): void => {
            // MongoDB refuses one update that writes a path and a prefix of it.
            for (const t of touched) {
              if (t === p || t.startsWith(`${p}.`) || p.startsWith(`${t}.`)) throw new Error(`fake-mongo: conflicting update paths ${t} / ${p}`);
            }
            touched.add(p);
          };
          for (const [op, spec] of Object.entries(update)) {
            for (const [p, v] of Object.entries(spec)) {
              claim(p);
              const { parent, key } = parentOf(doc, p);
              if (op === '$set') {
                (parent as Record<string, unknown>)[key] = v;
              } else if (op === '$push') {
                const arr = (parent as Record<string, unknown>)[key];
                if (!Array.isArray(arr)) throw new Error(`fake-mongo: $push to non-array ${p}`);
                const each = v && typeof v === 'object' && '$each' in (v as Doc) ? ((v as Doc).$each as unknown[]) : [v];
                arr.push(...each);
              } else if (op === '$pop') {
                const arr = (parent as Record<string, unknown>)[key];
                if (!Array.isArray(arr)) throw new Error(`fake-mongo: $pop on non-array ${p}`);
                if (v === 1) arr.pop();
                else arr.shift();
              } else {
                throw new Error(`fake-mongo: unsupported update operator ${op}`);
              }
            }
          }
          handle.writes.push({ filter, update });
          return { matchedCount: 1, modifiedCount: JSON.stringify(doc) === before ? 0 : 1 };
        },
      },
    },
  };
  return handle;
}
