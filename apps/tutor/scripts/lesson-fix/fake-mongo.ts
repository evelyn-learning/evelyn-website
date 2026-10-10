/**
 * A very small in-memory stand-in for the parts of the mongosh `db` object
 * the generated lesson-correction script uses. Test support only — it never
 * opens a connection. Implements exactly: getName, <collection>.find(filter,
 * projection).toArray(), <collection>.updateOne(filter, {$set,$unset,$push
 * (with $each / $position),$pop,$pull}).
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
                // A stored copy, as a database keeps one (never the caller's object).
                (parent as Record<string, unknown>)[key] = v === undefined ? v : (JSON.parse(JSON.stringify(v)) as unknown);
              } else if (op === '$push') {
                const arr = (parent as Record<string, unknown>)[key];
                if (!Array.isArray(arr)) throw new Error(`fake-mongo: $push to non-array ${p}`);
                const spec = v && typeof v === 'object' && '$each' in (v as Doc) ? (v as Doc) : null;
                const each = (spec ? (spec.$each as unknown[]) : [v]).map((x) => JSON.parse(JSON.stringify(x)) as unknown);
                if (spec && Object.keys(spec).some((k) => k !== '$each' && k !== '$position')) throw new Error(`fake-mongo: unsupported $push modifier in ${JSON.stringify(Object.keys(spec))}`);
                if (spec && typeof spec.$position === 'number') arr.splice(spec.$position, 0, ...each);
                else arr.push(...each);
              } else if (op === '$pull') {
                // Supported conditions: { $in: [scalars] } on an array of
                // scalars, and { <field>: { $in: [...] } } on an array of
                // documents.
                const arr = (parent as Record<string, unknown>)[key];
                if (!Array.isArray(arr)) throw new Error(`fake-mongo: $pull on non-array ${p}`);
                const cond = v as Record<string, unknown>;
                const keys = Object.keys(cond ?? {});
                if (keys.length !== 1) throw new Error(`fake-mongo: unsupported $pull condition ${JSON.stringify(v)}`);
                let gone: (el: unknown) => boolean;
                if (keys[0] === '$in') gone = (el) => (cond.$in as unknown[]).includes(el);
                else {
                  const inner = cond[keys[0]] as Record<string, unknown>;
                  if (!inner || !Array.isArray(inner.$in) || Object.keys(inner).length !== 1) throw new Error(`fake-mongo: unsupported $pull condition ${JSON.stringify(v)}`);
                  gone = (el) => !!el && typeof el === 'object' && (inner.$in as unknown[]).includes((el as Doc)[keys[0]]);
                }
                for (let i = arr.length - 1; i >= 0; i -= 1) if (gone(arr[i])) arr.splice(i, 1);
              } else if (op === '$unset') {
                delete (parent as Record<string, unknown>)[key];
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
