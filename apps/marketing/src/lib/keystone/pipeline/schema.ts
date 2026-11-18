// A small validator for the JSON-schema subset the pipeline's schemas use:
// type (object/array/string/number/integer/boolean/null, or an array of them),
// properties, required, items, enum, additionalProperties:false.
// Returns null when the value matches, else the first problem with its path.

type Schema = {
  type?: string | string[];
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  enum?: unknown[];
  additionalProperties?: boolean | Schema;
};

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function matchesType(v: unknown, t: string): boolean {
  switch (t) {
    case "object": return typeOf(v) === "object";
    case "array": return Array.isArray(v);
    case "string": return typeof v === "string";
    case "number": return typeof v === "number" && Number.isFinite(v);
    case "integer": return typeof v === "number" && Number.isInteger(v);
    case "boolean": return typeof v === "boolean";
    case "null": return v === null;
    default: return false;
  }
}

export function validate(value: unknown, schema: object, path = "$"): string | null {
  const s = schema as Schema;
  if (s.type !== undefined) {
    const types = Array.isArray(s.type) ? s.type : [s.type];
    if (!types.some((t) => matchesType(value, t))) return `${path}: expected ${types.join("|")}, got ${typeOf(value)}`;
  }
  if (s.enum && !s.enum.some((e) => e === value)) return `${path}: ${JSON.stringify(value)} is not one of ${JSON.stringify(s.enum)}`;
  if (typeOf(value) === "object") {
    const obj = value as Record<string, unknown>;
    for (const k of s.required ?? []) if (!(k in obj)) return `${path}: missing required field "${k}"`;
    const props = s.properties ?? {};
    for (const [k, v] of Object.entries(obj)) {
      if (k in props) {
        const err = validate(v, props[k], `${path}.${k}`);
        if (err) return err;
      } else if (s.additionalProperties === false) {
        return `${path}: unexpected field "${k}"`;
      } else if (typeof s.additionalProperties === "object") {
        const err = validate(v, s.additionalProperties, `${path}.${k}`);
        if (err) return err;
      }
    }
  }
  if (Array.isArray(value) && s.items) {
    for (let i = 0; i < value.length; i++) {
      const err = validate(value[i], s.items, `${path}[${i}]`);
      if (err) return err;
    }
  }
  return null;
}

/** True when every object in the schema lists all its properties as required and
 * forbids extra ones: the shape OpenAI's strict structured outputs accept. */
export function isStrictSchema(schema: object): boolean {
  const s = schema as Schema;
  if (s.properties || s.type === "object") {
    const keys = Object.keys(s.properties ?? {});
    const req = new Set(s.required ?? []);
    if (s.additionalProperties !== false || keys.some((k) => !req.has(k))) return false;
    if (keys.some((k) => !isStrictSchema(s.properties![k]))) return false;
  }
  if (s.items && !isStrictSchema(s.items)) return false;
  return true;
}

/** Strip one ``` fenced block if the reply has one; otherwise the reply must be pure JSON. */
export function parseJsonReply(text: string): { ok: true; value: unknown } | { ok: false; detail: string } {
  const fence = text.match(/```[a-zA-Z]*\s*\n([\s\S]*?)\n?\s*```/);
  const body = (fence ? fence[1] : text).trim();
  try {
    return { ok: true, value: JSON.parse(body) };
  } catch {
    return { ok: false, detail: `reply is not JSON: ${JSON.stringify(text.slice(0, 120))}` };
  }
}
