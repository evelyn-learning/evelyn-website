import JSZip from "jszip";
import { sanitize } from "./render";
import { keyFor, parseInteractions, stemWithoutInteractions, type Interaction } from "./qti-interactions";
import { checkAgainstSource, readSource, recoverChoices } from "./source";

// Reads SOLARO's QTI 2.1 export (Vance Schamehorn, 2026-10-29 sample): one
// folder per item holding item_<id>_apip.xml (stem, options, key, their
// solution as modalFeedback), item_<id>_metadata.xml (SYSTEM_* fields) and
// resources/ images. Uploads may be one zip per item, one zip of folders, or
// a zip of zips. MathML stays inline: browsers render it natively. A reading
// passage (rubricBlock class="passage" → passage_<id>.xml beside the item) is
// shown above the stem: the question cannot be reviewed without it.

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
  /** Every interaction in the item (drop-downs, matching, drag and drop, order, written response, numerical), read-only. */
  interactions: Interaction[];
  /** responseId → correct values, in document order. */
  keys: Record<string, string[]>;
  castleRockSolutionHtml: string;
  /** Files referenced by the item, keyed by the path used in the XML (e.g. "resources/Image_1.jpg"). */
  resources: Map<string, Uint8Array>;
  /** The original XML, kept so the approved solution can go back as a QTI package. */
  raw: { apip: string; metadata: string; passages: { file: string; xml: string }[] };
  /** Where the QTI export differs from Castle Rock's own source file (item_<id>_original.txt). Empty: it agrees, or there was none. */
  sourceFindings?: string[];
  /** What was taken from the source file because the QTI export lacked it. */
  sourceNotes?: string[];
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

export function decode(s: string): string {
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
export function toHtml(xml: string): string {
  return sanitize(
    xml
      .replace(/<rubricBlock\b[\s\S]*?<\/rubricBlock>/g, "")
      // A typesetting instruction for their print layout ("castlefo keep-with-next…"), never meant to be read.
      .replace(/<span\b[^>]*\bclass="procinst"[^>]*>[\s\S]*?<\/span>/g, "")
      .replace(/\s(id|xmlns(:\w+)?|responseIdentifier|identifier|maxChoices)="[^"]*"/g, "")
      .replace(/<(\/?)div class="text">/g, "<$1div class=\"cr-step-title\">")
      .trim(),
  );
}

/** A passage file (div.passage > div.title + div.content) as HTML for the question panel. */
export function passageHtml(xml: string): string {
  return toHtml(
    xml
      .replace(/<\?xml[^>]*\?>/g, "")
      .replace(/\slabel="[^"]*"/g, "")
      .replace(/<div class="passage"/g, '<div class="cr-passage"')
      .replace(/<div class="title"/g, '<div class="cr-passage-title"'),
  );
}

export function parseQtiItem(
  apip: string,
  metadata: string,
): Omit<QtiItem, "resources" | "raw"> & { imageRefs: string[]; passageRefs: string[] } {
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
    // Descriptions arrive wrapped in <p>; the standards list is plain text.
    const text = desc.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (code || text) standards.push([code, text].filter(Boolean).join(" "));
  }

  const body = apip.match(/<itemBody>([\s\S]*?)<\/itemBody>/)?.[1] ?? "";
  const options: { label: string; html: string }[] = [];
  // Only choiceInteraction's simpleChoice count: orderInteraction has them too and is shown from `interactions`.
  for (const ci of body.matchAll(/<choiceInteraction\b[\s\S]*?<\/choiceInteraction>/g)) {
    for (const m of ci[0].matchAll(/<simpleChoice\b[^>]*identifier="([^"]+)"[^>]*>([\s\S]*?)<\/simpleChoice>/g)) {
      options.push({ label: m[1], html: toHtml(m[2]) });
    }
  }
  const stem = stemWithoutInteractions(body);
  const solution = apip.match(/<modalFeedback\b[^>]*identifier="solution"[^>]*>([\s\S]*?)<\/modalFeedback>/)?.[1] ?? "";

  const imageRefs = [...apip.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
  const passageRefs = [...body.matchAll(/<rubricBlock\b[^>]*class="passage"[^>]*>([\s\S]*?)<\/rubricBlock>/g)].flatMap((m) =>
    [...m[1].matchAll(/<object\b[^>]*\bdata="([^"]+)"/g)].map((o) => o[1]),
  );

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
    interactions: parseInteractions(body),
    keys: keyFor(apip),
    castleRockSolutionHtml: solution ? toHtml(solution) : "",
    imageRefs,
    passageRefs,
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
      const passageFiles: { ref: string; xml: string }[] = [];
      for (const ref of parsed.passageRefs) {
        const pf = zip.file(`${dir}${ref}`);
        if (pf) passageFiles.push({ ref, xml: await pf.async("string") });
      }
      // Images a passage shows are referenced from the passage file, not from the item's own XML.
      const passageImages = passageFiles.flatMap((p) => [...p.xml.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]));
      const resources = new Map<string, Uint8Array>();
      for (const ref of [...new Set([...parsed.imageRefs, ...passageImages])]) {
        const rf = zip.file(`${dir}${ref}`);
        if (rf) resources.set(ref, await rf.async("uint8array"));
        else messages.push(`Item ${id}: image ${ref} is referenced but not in the zip.`);
      }
      const passages: { file: string; xml: string }[] = [];
      for (const ref of parsed.passageRefs) {
        const p = passageFiles.find((x) => x.ref === ref);
        if (p) passages.push({ file: ref, xml: p.xml });
        else messages.push(`Item ${id}: passage ${ref} is referenced but not in the zip; the question is shown without it.`);
      }
      const { imageRefs: _ignored, passageRefs: _refs, ...rest } = parsed;
      let item: QtiItem = {
        ...rest,
        questionHtml: passages.map((p) => passageHtml(p.xml)).join("") + rest.questionHtml,
        resources,
        raw: { apip, metadata, passages },
        sourceFindings: [],
        sourceNotes: [],
      };
      item = await viewableImages(item, messages);
      const sourceFile = zip.file(`${dir}item_${id}_original.txt`);
      if (sourceFile) {
        const zipImages = files.filter((x) => x.name.startsWith(`${dir}resources/`)).map((x) => x.name.split("/").pop()!);
        const load = async (ref: string) => { const rf = zip.file(`${dir}${ref}`); return rf ? rf.async("uint8array") : null; };
        item = await withSource(item, await sourceFile.async("string"), zipImages, load, messages);
      }
      items.push(item);
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

/** TIF images (which no browser shows) get a PNG copy, and every place the item shows one points at the PNG. */
async function viewableImages(item: QtiItem, messages: string[]): Promise<QtiItem> {
  const tifs = [...item.resources.keys()].filter((r) => /\.tiff?$/i.test(r));
  if (!tifs.length) return item;
  const { default: sharp } = await import("sharp");
  const swap: [string, string][] = [];
  for (const ref of tifs) {
    try {
      const png = await sharp(Buffer.from(item.resources.get(ref)!)).png().toBuffer();
      const to = ref.replace(/\.tiff?$/i, ".png");
      item.resources.set(to, new Uint8Array(png));
      swap.push([ref, to]);
    } catch (e) {
      messages.push(`Item ${item.itemId}: image ${ref} is a TIF that could not be converted (${(e as Error).message}); browsers cannot show it.`);
    }
  }
  const fix = (h: string) => swap.reduce((acc, [a, b]) => acc.split(`src="${a}"`).join(`src="${b}"`), h);
  return {
    ...item,
    questionHtml: fix(item.questionHtml),
    options: item.options.map((o) => ({ ...o, html: fix(o.html) })),
    interactions: JSON.parse(swap.reduce((acc, [a, b]) => acc.split(`src=\\"${a}\\"`).join(`src=\\"${b}\\"`), JSON.stringify(item.interactions))),
    castleRockSolutionHtml: fix(item.castleRockSolutionHtml),
  };
}

/** Compares the item with Castle Rock's source file and, where the exporter dropped a choice item's choices, takes them from it. */
async function withSource(item: QtiItem, text: string, zipFiles: string[], load: (ref: string) => Promise<Uint8Array | null>, messages: string[]): Promise<QtiItem> {
  const src = readSource(text, zipFiles);
  if (!src) return item;
  let out = item;
  const noAnswerArea = !item.options.length && !item.interactions.length;
  const recovered = noAnswerArea ? recoverChoices(src) : null;
  if (recovered) {
    out = { ...item, options: recovered.options, key: recovered.key, keys: { RESPONSE: recovered.key.split(",") }, itemType: recovered.itemType };
    out.sourceNotes = [`Choices and key taken from Castle Rock's source file: the QTI export had none (key ${recovered.key}).`];
    messages.push(`Item ${item.itemId}: the QTI export had no choices; the ${recovered.options.length} choices and key ${recovered.key} were taken from the item's source file.`);
    for (const o of recovered.options)
      for (const m of o.html.matchAll(/src="([^"]+)"/g)) {
        if (out.resources.has(m[1])) continue;
        const data = await load(m[1]);
        if (data) out.resources.set(m[1], data);
        else messages.push(`Item ${item.itemId}: choice image ${m[1]} not found in the zip.`);
      }
  }
  out.sourceFindings = checkAgainstSource(out, src);
  for (const f of out.sourceFindings) messages.push(`Item ${item.itemId}: ${f}`);
  return out;
}
