// A small validator for the JSON-schema subset the pipeline's schemas use:
// type (object/array/string/number/integer/boolean/null, or an array of them),
// properties, required, items, enum, additionalProperties:false (required on
// every object), plus the annotations title/description.
// assertSchemaSupported rejects anything else, so validate() never silently
// ignores a keyword it does not check.

type Schema = {
  type?: string | string[];
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  enum?: unknown[];
  additionalProperties?: boolean;
};

const TYPES = new Set(["object", "array", "string", "number", "integer", "boolean", "null"]);
const KEYWORDS = new Set(["type", "properties", "required", "items", "enum", "additionalProperties", "title", "description"]);

const own = (o: object, k: string) => Object.hasOwn(o, k);

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "object") return isPlainObject(v) ? "object" : "non-plain object";
  return typeof v;
}

/** Throws (programmer error) naming the first keyword or shape outside the supported
 * subset, or an object schema without additionalProperties:false. */
export function assertSchemaSupported(schema: object, path = "$"): void {
  if (!isPlainObject(schema)) throw new Error(`schema ${path}: not a plain object`);
  for (const k of Object.keys(schema)) {
    if (!KEYWORDS.has(k)) throw new Error(`unsupported schema keyword "${k}" at ${path}`);
  }
  const s = schema as Schema;
  const types = s.type === undefined ? [] : Array.isArray(s.type) ? s.type : [s.type];
  for (const t of types) if (!TYPES.has(t)) throw new Error(`schema ${path}: unsupported type "${t}"`);
  if (s.enum !== undefined && !Array.isArray(s.enum)) throw new Error(`schema ${path}: enum must be an array`);
  const isObject = types.includes("object") || own(schema, "properties");
  if (isObject) {
    if (s.additionalProperties !== false) throw new Error(`schema ${path}: object schemas need additionalProperties: false`);
    if (s.required !== undefined && !(Array.isArray(s.required) && s.required.every((r) => typeof r === "string"))) {
      throw new Error(`schema ${path}: required must be a list of names`);
    }
    for (const [k, sub] of Object.entries(s.properties ?? {})) assertSchemaSupported(sub, `${path}.properties.${k}`);
  } else if (own(schema, "additionalProperties") || own(schema, "required")) {
    throw new Error(`schema ${path}: additionalProperties/required outside an object schema`);
  }
  if (s.items !== undefined) assertSchemaSupported(s.items, `${path}.items`);
}

function matchesType(v: unknown, t: string): boolean {
  switch (t) {
    case "object": return isPlainObject(v);
    case "array": return Array.isArray(v);
    case "string": return typeof v === "string";
    case "number": return typeof v === "number" && Number.isFinite(v);
    case "integer": return typeof v === "number" && Number.isInteger(v);
    case "boolean": return typeof v === "boolean";
    case "null": return v === null;
    default: return false;
  }
}

/** Null when the value matches, else the first problem with its path. */
export function validate(value: unknown, schema: object, path = "$"): string | null {
  const s = schema as Schema;
  if (s.type !== undefined) {
    const types = Array.isArray(s.type) ? s.type : [s.type];
    if (!types.some((t) => matchesType(value, t))) return `${path}: expected ${types.join("|")}, got ${typeOf(value)}`;
  }
  if (s.enum && !s.enum.some((e) => e === value)) return `${path}: ${JSON.stringify(value)} is not one of ${JSON.stringify(s.enum)}`;
  if (isPlainObject(value)) {
    const props = s.properties ?? {};
    for (const k of s.required ?? []) if (!own(value, k)) return `${path}: missing required field "${k}"`;
    for (const [k, v] of Object.entries(value)) {
      if (own(props, k)) {
        const err = validate(v, props[k], `${path}.${k}`);
        if (err) return err;
      } else if (s.additionalProperties === false) {
        return `${path}: unexpected field "${k}"`;
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

/** Pure JSON first; failing that, a reply that is ENTIRELY one fenced block
 * (optionally labelled json). Prose around a fence is not accepted. */
export function parseJsonReply(text: string): { ok: true; value: unknown } | { ok: false; detail: string } {
  const trimmed = text.trim();
  try {
    return { ok: true, value: JSON.parse(trimmed) };
  } catch {
    // fall through to the fenced form
  }
  const fence = trimmed.match(/^```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n?```$/i);
  if (fence) {
    try {
      return { ok: true, value: JSON.parse(fence[1].trim()) };
    } catch {
      // fall through
    }
  }
  return { ok: false, detail: `reply is not JSON: ${JSON.stringify(text.slice(0, 120))}` };
}
