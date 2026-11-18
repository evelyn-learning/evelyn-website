import mongoose, { Schema, type Connection, type Model } from "mongoose";
import type { Interaction } from "./qti-interactions";
import { KEYSTONE_DB, type Role, type SectionKind, type Stage, type Verdict } from "./config";

// Keystone keeps its own database on the shared mongod. The connection is
// separate from the marketing app's default mongoose connection so the two
// never share models. KEYSTONE_MONGODB_URI overrides the URI (local tests);
// otherwise MONGODB_URI is reused with dbName forced to castle_rock_review.

export type UserDoc = {
  username: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
};

export type SessionDoc = { token: string; username: string; expiresAt: Date; createdAt: Date };

/**
 * Raised when our working reaches a different answer from Castle Rock's key.
 * Not a solution: the reviewer sees only our answer, their key and this working.
 */
export type KeyQueryDoc = { ourAnswer: string; workingHtml: string; raisedAt: Date; reviewerReason?: string; answeredAt?: Date };

export type OptionDoc = { label: string; html: string; md?: string };

/** Why the pipeline holds an item for Praveen (see pipeline/run.ts). Internal: never shown to the client. */
export type Flag =
  | "solvers_split"
  | "second_failure"
  | "written_response"
  | "type_not_supported"
  | "no_agreement"
  | "key_confirmed_by_reviewer"
  | "section_title_unset"
  | "step_failed"
  | "sample"
  /** match, gapMatch, order or inlineChoice: no real sample of these kinds verified end to end yet. */
  | "unverified_type"
  /** The solvers agree but the client supplied no key: the answer is ours alone. */
  | "answer_to_confirm"
  /** Praveen sent the held solution back with a note (pipeline.fixNote): the next run rewrites it. */
  | "owner_sent_back"
  /** The solution was rewritten after Praveen's note: always held for him again. */
  | "owner_rewrite"
  /** The client re-sent the question (content changed) after our solution went to review: held for his look. */
  | "question_resent";

/** What the solutions pipeline last decided about an item. heldFor is set whenever flags is not empty. */
export type PipelineDoc = {
  flags: Flag[];
  passedAt?: Date;
  releaseAt?: Date;
  heldFor?: "praveen";
  /** no key came with the item: the reviewer confirms our answer */
  answerToConfirm?: boolean;
  /** The run that made the last pipeline write to the item (set in the same update as that write). */
  runId?: string;
  /** item_data / key_query when that write was the pipeline's own stage change; absent otherwise. */
  wroteStage?: Stage;
  /**
   * The timed release's claim (pipeline/release.ts): set before the release, cleared after it.
   * releasedAt: the item has been moved to review under this claim; what is left is bookkeeping.
   */
  releaseClaim?: { owner: string; at: Date; releasedAt?: Date };
  /** When the timed release sent this version to review (counts toward its batch's sample base). */
  timerReleasedAt?: Date;
  /** Why the item is held when no flag says it (e.g. "no release time"). Internal: never shown to the client. */
  heldWhy?: string;
  /** Praveen's send-back (flag owner_sent_back): what the author must change, when, by whom. Cleared by the rewrite. */
  fixNote?: string;
  fixRequestedAt?: Date;
  sentBackBy?: string;
  /** When Praveen last looked at the held item ("Keep holding"). */
  seenAt?: Date;
  /** The question was re-sent with changed content and the pipeline record started again (store.ingestQtiItems). */
  resentAt?: Date;
  /** The question was re-sent with changed content after our solution went to review (flag question_resent). */
  questionChangedAt?: Date;
};

export type Step = "intake" | "course" | "cause" | "solve" | "write" | "calc" | "working" | "audit" | "render";
export type RunResult = "ready" | "held" | "item_data" | "key_query" | "course_missing" | "superseded" | "failed";
export type RunStep = {
  step: Step;
  /** "<step>#<n>": the n-th time this step ran in the run; resume reuses the output under the same key. */
  key: string;
  at: Date;
  ok: boolean;
  output: unknown;
  cost: number;
  model?: string;
  /** ok false and the cause was transient (network error, 429 / 5xx after every retry): the next run retries it. */
  transient?: boolean;
};

/** One pipeline run of one item. Internal record (may carry model ids); never shown to the client. */
export type RunDoc = {
  itemId: string;
  runId: string;
  startedAt: Date;
  finishedAt?: Date;
  /** owner: a held solution Praveen sent back with a note (flag owner_sent_back). */
  mode: "fresh" | "key_right" | "changes" | "owner";
  startedFrom: { stage: Stage; version: number; updatedAt: Date };
  steps: RunStep[];
  corrections: number;
  /** changes_requested: the cause proposed from the reviewer's note. */
  cause?: "answer" | "working" | "format" | "style" | "other";
  result?: RunResult;
  /** What the item would have become when a flag held it instead (e.g. a key query on an unverified type). */
  wouldBe?: string;
  flags: Flag[];
  cost: number;
  /** false: no local asset folder, the intake image check was skipped. */
  assetsChecked: boolean;
  dryRun?: boolean;
  error?: string;
  /** Saved just before the run's final item write: what the item will look like once it lands, so a resume can tell its own write from someone else's change. */
  intent?: { writing: RunResult; stage: Stage; toVersion: number; flags: Flag[]; at: Date };
  /** The outbox suggestion for this run's result was made. */
  suggested?: boolean;
  /** Files the question refers to that are not sent to the solvers (with why the item was or was not held). */
  filesNotSent?: string[];
  /** Resume found this run's own final write had landed, and the item changed after it (result superseded). */
  ownWriteLanded?: boolean;
  /** Bookkeeping that failed without failing the item (e.g. the lesson row); scrubbed, at most 5. */
  warnings?: string[];
  /** Times this run ended "failed" or held with step_failed (a resumed run adds to it): the attempt cap counts these. */
  failedAttempts?: number;
};

export type ItemDoc = {
  itemId: string;
  subject: string;
  course: string;
  grade?: number;
  itemType: string;
  topic: string;
  standards: string[];
  key: string;
  evelynAnswer: string;
  keySource: "castle-rock" | "evelyn";
  questionHtml: string;
  questionMd?: string;
  options: OptionDoc[];
  /** Read-only view of every interaction in a QTI item (see qti-interactions.ts). Undefined on older rows. */
  interactions?: Interaction[];
  /** responseId → correct values from the QTI export. Undefined on older rows. */
  keys?: Record<string, string[]>;
  /** Castle Rock's own worked solution from the QTI export, for reference. */
  castleRockSolutionHtml?: string;
  /** Original QTI XML (items that arrived as QTI); resource paths as used in the XML. */
  qti?: { apip: string; metadata: string; resources: string[]; passages?: { file: string; xml: string }[] };
  /** Animated (voiced) player attached to the item: files under assets/<itemId>/player/. */
  player?: { entry: string; voice?: string; height: number; note?: string; attachedAt: Date };
  stage: Stage;
  /** The latest key query (kept for the record once answered). Undefined on items never queried. */
  keyQuery?: KeyQueryDoc;
  version: number;
  /** Highest solution version released to review (Castle Rock never sees above it). Undefined on rows from before 2026-11-17: treat as `version`. */
  releasedVersion?: number;
  /** evelynAnswer as it was when the solution was released; what Castle Rock sees. */
  releasedAnswer?: string;
  /** Where `course` came from: only a spreadsheet value counts (QTI metadata is unreliable). Undefined on older rows. */
  courseSource?: "sheet" | "metadata";
  batchId?: string;
  /** When the item (or its spreadsheet row) last arrived, whichever is later. */
  receivedAt?: Date;
  /** Set by the solutions pipeline. Undefined on items it never ran on. */
  pipeline?: PipelineDoc;
  showcase: boolean;
  priorStatus?: string;
  reviewNote?: string;
  source: "sample" | "upload";
  uploadId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
};

export type SectionDoc = { kind: SectionKind; md: string; html: string };

export type SolutionDoc = {
  itemId: string;
  version: number;
  sections: SectionDoc[];
  author: string;
  note?: string;
  createdAt: Date;
  /** When this version was released to review; unset while it is held (stage `ready`, or a draft). */
  releasedAt?: Date;
  /** The pipeline run that wrote this version (lets a resumed run finish its own write). */
  runId?: string;
  /** Written for a question since re-sent with changed content: never released by any path. */
  staleAt?: Date;
};

export type ActivityDoc = {
  itemId: string;
  version?: number;
  type: "verdict" | "comment" | "revision" | "stage" | "upload";
  verdict?: Verdict;
  /** For type "stage": the stage set (rows before 2026-11-17 only name it in `body`). */
  stage?: Stage;
  body?: string;
  username: string;
  name: string;
  role: Role;
  createdAt: Date;
};

export type UploadDoc = {
  filename: string;
  storedAs: string;
  size: number;
  kind: "qti" | "sheet";
  username: string;
  itemIds: string[];
  messages: string[];
  createdAt: Date;
};

export type BatchRow = { itemId: string; subject?: string; course?: string; showcase?: boolean };

/** One spreadsheet upload. batchId is the sheet Upload's _id. `rows` keeps every parsed row so one for an item not uploaded yet applies when it arrives. */
export type BatchDoc = {
  batchId: string;
  filename: string;
  itemIds: string[];
  rows: BatchRow[];
  receivedAt: Date;
  uploadedBy: string;
  /** For information only: when the first item of the batch was held as sample. The gate is the sample invariant (pipeline/release.ts). */
  sampledAt?: Date;
  /** The per-batch guard of the release / sample top-up: one caller at a time, taken over when stale. */
  releasing?: { owner: string; at: Date };
  /** Why nothing of the batch can be released (and since when); unset once it can. */
  blockedWhy?: string;
  blockedAt?: Date;
  /** "batch_in_review" was suggested for the batch (once). */
  inReviewSuggestedAt?: Date;
};

/**
 * One send-back ("Fix solution") from the client's reviewer, recorded by the run that picks it up (one per
 * item and version: unique index). The run proposes the cause from the note (proposedBy "model", unconfirmed);
 * a session confirms it (run.ts confirmLesson). Cause "item" is only ever set by a person: the fault was in the
 * client's item, not ours, so it is not counted as a send-back caused by us. Internal: never shown to the client.
 */
export type LessonDoc = {
  itemId: string;
  /** The solution version the reviewer sent back. */
  version: number;
  /** The reviewer's note as plain text (splitNote(...).plain), full length. */
  note: string;
  cause: "answer" | "working" | "format" | "style" | "item" | "other";
  proposedBy: "model" | "session";
  confirmed: boolean;
  /** The rule a session made from the lesson, when it made one. */
  ruleId?: string;
  createdAt: Date;
};

/** Heartbeats of the server jobs (pipeline/heartbeat.ts): one document per job, upserted. */
export type HeartbeatDoc = { _id: string; at: Date };

/** A named lock with an expiry (the hourly release job). */
export type LockDoc = { _id: string; owner: string; expiresAt: Date };

export type OutboxDoc = {
  kind: "batch_received" | "items_need_data" | "keys_queried" | "course_missing" | "batch_in_review" | "sample_requested";
  to: ("julie" | "vance" | "markus")[];
  subject: string;
  bodyMd: string;
  itemIds: string[];
  batchId?: string;
  createdAt: Date;
  draftedAt?: Date;
};

/** One published version of an item's animated solution (files under assets/<itemId>/animated/v<version>/). Owner review only until released. */
export type AnimationStatus = "review" | "fixing" | "accepted" | "released";
export type AnimationDoc = {
  itemId: string;
  version: number;
  entry: string;
  height: number;
  voice?: string;
  status: AnimationStatus;
  notes?: string;
  /** Flags (animflags _id) this version was made to fix. */
  addresses: string[];
  createdAt: Date;
  createdBy: string;
};

/** A problem the owner flagged while watching one version of an animated solution. */
export type AnimFlagStatus = "open" | "fixed" | "confirmed" | "reopened";
export type AnimFlagDoc = {
  itemId: string;
  version: number;
  /** Player position when flagged; null when the page had no esPlayer (legacy prototypes). */
  step: number | null;
  line: number | null;
  timeMs: number | null;
  comment: string;
  spoken: boolean;
  /** File names under DATA_DIR/animflags/<flagId>/ ("1.png", …). */
  shots: string[];
  status: AnimFlagStatus;
  fixedInVersion?: number;
  reply?: string;
  /** Set on the open flag created by a Reopen: the earlier flag it continues. */
  reopenOf?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

type Models = {
  Lesson: Model<LessonDoc>;
  Heartbeat: Model<HeartbeatDoc>;
  Lock: Model<LockDoc>;
  Run: Model<RunDoc>;
  Outbox: Model<OutboxDoc & { openKey?: string }>;
  Batch: Model<BatchDoc>;
  User: Model<UserDoc>;
  Session: Model<SessionDoc>;
  Item: Model<ItemDoc>;
  Solution: Model<SolutionDoc>;
  Activity: Model<ActivityDoc>;
  Upload: Model<UploadDoc>;
  Animation: Model<AnimationDoc>;
  AnimFlag: Model<AnimFlagDoc>;
};

type Cache = { conn: Connection | null; promise: Promise<Connection> | null; models: Models | null };

declare global {
  // eslint-disable-next-line no-var
  var keystoneDb: Cache | undefined;
}

const cache: Cache = global.keystoneDb ?? { conn: null, promise: null, models: null };
global.keystoneDb = cache;

/** KEYSTONE_READONLY=1 (set by the pipeline script for every dry run, before the first connection). */
export function isReadOnly(): boolean {
  return process.env.KEYSTONE_READONLY === "1";
}

/**
 * The one place the connection options come from. Read-only: mongoose creates no
 * collection and no index on connect (autoCreate / autoIndex off for every model; no
 * schema here sets either, so the connection's setting is the one that applies).
 * Writing runs and the app keep the defaults (indexes built on connect).
 */
export function connectOptions(): { dbName: string; bufferCommands: false; autoIndex?: false; autoCreate?: false } {
  return { dbName: KEYSTONE_DB, bufferCommands: false, ...(isReadOnly() ? { autoIndex: false as const, autoCreate: false as const } : {}) };
}

export const READ_ONLY_MESSAGE = "read-only run: database writes are disabled (KEYSTONE_READONLY=1)";
const WRITE_QUERY_OPS = ["updateOne", "updateMany", "deleteOne", "deleteMany", "findOneAndUpdate", "findOneAndDelete", "findOneAndReplace", "replaceOne"];

/** Belt for read-only mode: every write entry point of a model fails loudly instead of landing. */
function blockWrites(schema: Schema) {
  const stop = function (next: (err?: Error) => void) {
    next(new Error(READ_ONLY_MESSAGE));
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  schema.pre(WRITE_QUERY_OPS as any, stop as any);
  schema.pre(["updateOne", "deleteOne"] as any, { document: true, query: false }, stop as any);
  schema.pre("save", stop as any);
  schema.pre("insertMany", stop as any);
  schema.pre("bulkWrite" as any, stop as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

function defineModels(conn: Connection): Models {
  const User = new Schema<UserDoc>({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
    lastLoginAt: Date,
    passwordChangedAt: Date,
  });
  const Session = new Schema<SessionDoc>({
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    createdAt: { type: Date, default: () => new Date() },
  });
  const Option = new Schema<OptionDoc>({ label: String, html: String, md: String }, { _id: false });
  const Item = new Schema<ItemDoc>({
    itemId: { type: String, required: true, unique: true },
    subject: String,
    course: String,
    grade: Number,
    itemType: String,
    topic: String,
    standards: [String],
    key: String,
    evelynAnswer: String,
    keySource: String,
    questionHtml: String,
    questionMd: String,
    options: [Option],
    interactions: { type: Schema.Types.Mixed },
    keys: { type: Schema.Types.Mixed },
    castleRockSolutionHtml: String,
    qti: {
      type: new Schema(
        {
          apip: String,
          metadata: String,
          resources: [String],
          passages: [new Schema({ file: String, xml: String }, { _id: false })],
        },
        { _id: false },
      ),
      required: false,
    },
    player: {
      type: new Schema({ entry: String, voice: String, height: Number, note: String, attachedAt: Date }, { _id: false }),
      required: false,
    },
    stage: { type: String, index: true },
    keyQuery: {
      type: new Schema({ ourAnswer: String, workingHtml: String, raisedAt: Date, reviewerReason: String, answeredAt: Date }, { _id: false }),
      required: false,
    },
    version: { type: Number, default: 0 },
    releasedVersion: Number,
    releasedAnswer: String,
    courseSource: String,
    batchId: String,
    receivedAt: Date,
    pipeline: {
      type: new Schema(
        {
          flags: [String], passedAt: Date, releaseAt: Date, heldFor: String, answerToConfirm: Boolean, runId: String, wroteStage: String,
          releaseClaim: { type: new Schema({ owner: String, at: Date, releasedAt: Date }, { _id: false }), required: false },
          timerReleasedAt: Date, heldWhy: String,
          fixNote: String, fixRequestedAt: Date, sentBackBy: String, seenAt: Date, resentAt: Date, questionChangedAt: Date,
        },
        { _id: false },
      ),
      required: false,
    },
    showcase: { type: Boolean, default: false },
    priorStatus: String,
    reviewNote: String,
    source: String,
    uploadId: String,
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    lastActivityAt: { type: Date, default: () => new Date() },
  });
  const Section = new Schema<SectionDoc>({ kind: String, md: String, html: String }, { _id: false });
  const Solution = new Schema<SolutionDoc>({
    itemId: { type: String, required: true },
    version: { type: Number, required: true },
    sections: [Section],
    author: String,
    note: String,
    createdAt: { type: Date, default: () => new Date() },
    releasedAt: Date,
    runId: String,
    staleAt: Date,
  });
  Solution.index({ itemId: 1, version: 1 }, { unique: true });
  const Activity = new Schema<ActivityDoc>({
    itemId: { type: String, required: true, index: true },
    version: Number,
    type: String,
    verdict: String,
    stage: String,
    body: String,
    username: String,
    name: String,
    role: String,
    createdAt: { type: Date, default: () => new Date() },
  });
  const Upload = new Schema<UploadDoc>({
    filename: String,
    storedAs: String,
    size: Number,
    kind: String,
    username: String,
    itemIds: [String],
    messages: [String],
    createdAt: { type: Date, default: () => new Date() },
  });
  const Batch = new Schema<BatchDoc>({
    batchId: { type: String, required: true, unique: true },
    filename: String,
    itemIds: [String],
    rows: [new Schema({ itemId: String, subject: String, course: String, showcase: Boolean }, { _id: false })],
    receivedAt: { type: Date, default: () => new Date() },
    uploadedBy: String,
    sampledAt: Date,
    releasing: { type: new Schema({ owner: String, at: Date }, { _id: false }), required: false },
    blockedWhy: String,
    blockedAt: Date,
    inReviewSuggestedAt: Date,
  });
  const Lock = new Schema<LockDoc>({ _id: { type: String, required: true }, owner: String, expiresAt: Date });
  // openKey = "<kind>|<batchId>" while a suggestion is open, removed when drafted; the unique index
  // is what stops two concurrent suggest() calls from creating two open suggestions.
  const Outbox = new Schema<OutboxDoc & { openKey?: string }>({
    kind: { type: String, required: true },
    to: [String],
    subject: String,
    bodyMd: String,
    itemIds: [String],
    batchId: String,
    createdAt: { type: Date, default: () => new Date() },
    draftedAt: Date,
    openKey: String,
  });
  Outbox.index({ kind: 1, batchId: 1, draftedAt: 1 });
  Outbox.index({ openKey: 1 }, { unique: true, sparse: true });
  const Run = new Schema<RunDoc>({
    itemId: { type: String, required: true },
    runId: { type: String, required: true },
    startedAt: Date,
    finishedAt: Date,
    mode: String,
    startedFrom: { type: Schema.Types.Mixed },
    steps: { type: Schema.Types.Mixed, default: [] },
    corrections: { type: Number, default: 0 },
    cause: String,
    result: String,
    wouldBe: String,
    flags: [String],
    cost: { type: Number, default: 0 },
    assetsChecked: Boolean,
    dryRun: Boolean,
    error: String,
    intent: { type: Schema.Types.Mixed },
    suggested: Boolean,
    filesNotSent: [String],
    ownWriteLanded: Boolean,
    warnings: [String],
    failedAttempts: Number,
  });
  Run.index({ itemId: 1, runId: 1 }, { unique: true });
  Run.index({ itemId: 1, startedAt: -1 });
  const Lesson = new Schema<LessonDoc>({
    itemId: { type: String, required: true },
    version: { type: Number, required: true },
    note: String,
    cause: { type: String, required: true },
    proposedBy: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    ruleId: String,
    createdAt: { type: Date, default: () => new Date() },
  });
  Lesson.index({ itemId: 1, version: 1 }, { unique: true });
  const Heartbeat = new Schema<HeartbeatDoc>({ _id: { type: String, required: true }, at: { type: Date, required: true } }, { versionKey: false });
  const Animation = new Schema<AnimationDoc>({
    itemId: { type: String, required: true },
    version: { type: Number, required: true },
    entry: { type: String, default: "solution.html" },
    height: Number,
    voice: String,
    status: { type: String, required: true, default: "review" },
    notes: String,
    addresses: { type: [String], default: [] },
    createdAt: { type: Date, default: () => new Date() },
    createdBy: String,
  });
  Animation.index({ itemId: 1, version: 1 }, { unique: true });
  const AnimFlag = new Schema<AnimFlagDoc>({
    itemId: { type: String, required: true },
    version: { type: Number, required: true },
    step: { type: Number, default: null },
    line: { type: Number, default: null },
    timeMs: { type: Number, default: null },
    comment: { type: String, default: "" },
    spoken: { type: Boolean, default: false },
    shots: { type: [String], default: [] },
    status: { type: String, required: true, default: "open" },
    fixedInVersion: Number,
    reply: String,
    reopenOf: String,
    createdBy: String,
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  });
  AnimFlag.index({ itemId: 1, version: 1 });
  AnimFlag.index({ status: 1 });
  if (isReadOnly()) for (const schema of [Lesson, Heartbeat, Lock, Run, Outbox, Batch, User, Session, Item, Solution, Activity, Upload, Animation, AnimFlag]) blockWrites(schema as Schema);
  return {
    Lesson: conn.model<LessonDoc>("Lesson", Lesson, "lessons"),
    Heartbeat: conn.model<HeartbeatDoc>("Heartbeat", Heartbeat, "heartbeats"),
    Lock: conn.model<LockDoc>("Lock", Lock, "locks"),
    Run: conn.model<RunDoc>("Run", Run, "runs"),
    Outbox: conn.model<OutboxDoc & { openKey?: string }>("Outbox", Outbox, "outbox"),
    Batch: conn.model<BatchDoc>("Batch", Batch, "batches"),
    User: conn.model<UserDoc>("User", User, "users"),
    Session: conn.model<SessionDoc>("Session", Session, "sessions"),
    Item: conn.model<ItemDoc>("Item", Item, "items"),
    Solution: conn.model<SolutionDoc>("Solution", Solution, "solutions"),
    Activity: conn.model<ActivityDoc>("Activity", Activity, "activity"),
    Upload: conn.model<UploadDoc>("Upload", Upload, "uploads"),
    Animation: conn.model<AnimationDoc>("Animation", Animation, "animations"),
    AnimFlag: conn.model<AnimFlagDoc>("AnimFlag", AnimFlag, "animflags"),
  };
}

export async function ks(): Promise<Models> {
  if (cache.models) return cache.models;
  if (!cache.promise) {
    const uri = process.env.KEYSTONE_MONGODB_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error("KEYSTONE_MONGODB_URI / MONGODB_URI not configured");
    cache.promise = mongoose
      .createConnection(uri, connectOptions())
      .asPromise();
  }
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
  cache.models = defineModels(cache.conn);
  return cache.models;
}

export async function closeKs() {
  if (cache.conn) await cache.conn.close();
  cache.conn = null;
  cache.promise = null;
  cache.models = null;
}
