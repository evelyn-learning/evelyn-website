import JSZip from "jszip";
import { sanitize } from "./render";

// Reads SOLARO's QTI 2.1 export (Vance Schamehorn, 2026-10-29 sample): one
// folder per item holding item_<id>_apip.xml (stem, options, key, their
// solution as modalFeedback), item_<id>_metadata.xml (SYSTEM_* fields) and
// resources/ images. Uploads may be one zip per item, one zip of folders, or
// a zip of zips. MathML stays inline: browsers render it natively.

export type QtiItem = {
  itemId: string;
  subject: string;
  course: string;
  grade?: number;
  itemType: string;
  key: string;
  standards: string[];
  topic: string;
  questionHtml: string;
  options: { label: string; html: string }[];
  castleRockSolutionHtml: string;
  /** Files referenced by the item, keyed by the path used in the XML (e.g. "resources/Image_1.jpg"). */
  resources: Map<string, Uint8Array>;
  /** The original XML, kept so the approved solution can go back as a QTI package. */
  raw: { apip: string; metadata: string };
};

const SUBJECT: Record<string, string> = {
  MATH: "Mathematics",
  BIOL: "Biology",
  CHEM: "Chemistry",
  PHYS: "Physics",
  SCI: "Science",
  ELA: "English Language Arts",
};

const TYPE: Record<string, string> = {
  "multiple choice": "MC",
  "multiple selection": "MS",
  "numerical response": "NR",
  "written response": "WR",
  "short written response": "SWR",
  "text input": "TI",
};

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1].trim()) : "";
}

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_m, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function course(code: string, subject: string, grade?: number): string {
  // AB.MATH.30 → "Math 30"; AB.PHYS.30 → "Physics 30". Metadata is only a hint (Vance, 10-30).
  const m = code.match(/^[A-Z]{2}\.([A-Z]+)\.(\S+)$/);
  if (!m) return code || (grade ? `${subject}, Grade ${grade}` : subject);
  const name = { MATH: "Math", PHYS: "Physics", CHEM: "Chemistry", BIOL: "Biology", SCI: "Science" }[m[1]] ?? m[1];
  return `${name} ${m[2]}`;
}

/** Turns a QTI fragment into plain HTML: drops ids/namespaces, keeps MathML. */
function toHtml(xml: string): string {
  return sanitize(
    xml
      .replace(/<rubricBlock\b[\s\S]*?<\/rubricBlock>/g, "")
      .replace(/\s(id|xmlns(:\w+)?|responseIdentifier|identifier|maxChoices)="[^"]*"/g, "")
      .replace(/<(\/?)div class="text">/g, "<$1div class=\"cr-step-title\">")
      .trim(),
  );
}

export function parseQtiItem(apip: string, metadata: string): Omit<QtiItem, "resources" | "raw"> & { imageRefs: string[] } {
  const itemId =
    tag(metadata, "SYSTEM_ItemID") || (apip.match(/identifier="item_(\d+)"/)?.[1] ?? "");
  if (!itemId) throw new Error("item id not found");
  const subjectCode = tag(metadata, "SYSTEM_Subject");
  const subject = SUBJECT[subjectCode] ?? subjectCode;
  const gradeRaw = tag(metadata, "SYSTEM_Grade");
  const grade = gradeRaw && /^\d+$/.test(gradeRaw) ? Number(gradeRaw) : undefined;
  const itemTypeRaw = tag(metadata, "SYSTEM_ItemType");
  const itemType = TYPE[itemTypeRaw.toLowerCase()] ?? itemTypeRaw;

  const keyValues = [...(apip.match(/<correctResponse>([\s\S]*?)<\/correctResponse>/)?.[1] ?? "").matchAll(/<value>([\s\S]*?)<\/value>/g)].map((m) => decode(m[1].trim()));
  const key = keyValues.join(",");

  const standards: string[] = [];
  for (const m of metadata.matchAll(/<Standard>([\s\S]*?)<\/Standard>/g)) {
    const code = tag(m[1], "Code");
    const desc = tag(m[1], "Description");
    if (code || desc) standards.push([code, desc].filter(Boolean).join(" "));
  }

  const body = apip.match(/<itemBody>([\s\S]*?)<\/itemBody>/)?.[1] ?? "";
  const options: { label: string; html: string }[] = [];
  for (const m of body.matchAll(/<simpleChoice\b[^>]*identifier="([^"]+)"[^>]*>([\s\S]*?)<\/simpleChoice>/g)) {
    options.push({ label: m[1], html: toHtml(m[2]) });
  }
  const stem = body.replace(/<choiceInteraction\b[\s\S]*?<\/choiceInteraction>/g, "");
  const solution = apip.match(/<modalFeedback\b[^>]*identifier="solution"[^>]*>([\s\S]*?)<\/modalFeedback>/)?.[1] ?? "";

  const imageRefs = [...apip.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);

  return {
    itemId,
    subject,
    course: course(tag(metadata, "SYSTEM_Course"), subject, grade),
    grade,
    itemType,
    key,
    standards,
    topic: tag(metadata, "keyword"),
    questionHtml: toHtml(stem),
    options,
    castleRockSolutionHtml: solution ? toHtml(solution) : "",
    imageRefs,
  };
}

/** Walks a zip (and zips inside it) and returns every item it finds. */
export async function readQtiZip(data: Uint8Array | ArrayBuffer, depth = 0): Promise<{ items: QtiItem[]; messages: string[] }> {
  const zip = await JSZip.loadAsync(data);
  const items: QtiItem[] = [];
  const messages: string[] = [];
  const files = Object.values(zip.files).filter((f) => !f.dir && !f.name.split("/").some((p) => p.startsWith("__MACOSX") || p.startsWith(".")));

  for (const f of files.filter((f) => /\/?item_\d+_apip\.xml$/.test(f.name))) {
    const dir = f.name.slice(0, f.name.lastIndexOf("/") + 1);
    const id = f.name.match(/item_(\d+)_apip\.xml$/)![1];
    try {
      const apip = await f.async("string");
      const metaFile = zip.file(`${dir}item_${id}_metadata.xml`);
      const metadata = metaFile ? await metaFile.async("string") : "";
      if (!metaFile) messages.push(`Item ${id}: no metadata file; subject and course left blank.`);
      const parsed = parseQtiItem(apip, metadata);
      const resources = new Map<string, Uint8Array>();
      for (const ref of parsed.imageRefs) {
        const rf = zip.file(`${dir}${ref}`);
        if (rf) resources.set(ref, await rf.async("uint8array"));
        else messages.push(`Item ${id}: image ${ref} is referenced but not in the zip.`);
      }
      const { imageRefs: _ignored, ...rest } = parsed;
      items.push({ ...rest, resources, raw: { apip, metadata } });
    } catch (e) {
      messages.push(`Item ${id}: could not be read (${(e as Error).message}).`);
    }
  }

  if (depth < 2) {
    for (const f of files.filter((f) => f.name.toLowerCase().endsWith(".zip"))) {
      const inner = await readQtiZip(await f.async("uint8array"), depth + 1);
      items.push(...inner.items);
      messages.push(...inner.messages);
    }
  }
  return { items, messages };
}
