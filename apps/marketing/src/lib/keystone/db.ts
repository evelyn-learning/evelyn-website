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

export type OptionDoc = { label: string; html: string; md?: string };

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
};

type Models = {
  Batch: Model<BatchDoc>;
  User: Model<UserDoc>;
  Session: Model<SessionDoc>;
  Item: Model<ItemDoc>;
  Solution: Model<SolutionDoc>;
  Activity: Model<ActivityDoc>;
  Upload: Model<UploadDoc>;
};

type Cache = { conn: Connection | null; promise: Promise<Connection> | null; models: Models | null };

declare global {
  // eslint-disable-next-line no-var
  var keystoneDb: Cache | undefined;
}

const cache: Cache = global.keystoneDb ?? { conn: null, promise: null, models: null };
global.keystoneDb = cache;

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
    version: { type: Number, default: 0 },
    releasedVersion: Number,
    releasedAnswer: String,
    courseSource: String,
    batchId: String,
    receivedAt: Date,
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
  });
  return {
    Batch: conn.model<BatchDoc>("Batch", Batch, "batches"),
    User: conn.model<UserDoc>("User", User, "users"),
    Session: conn.model<SessionDoc>("Session", Session, "sessions"),
    Item: conn.model<ItemDoc>("Item", Item, "items"),
    Solution: conn.model<SolutionDoc>("Solution", Solution, "solutions"),
    Activity: conn.model<ActivityDoc>("Activity", Activity, "activity"),
    Upload: conn.model<UploadDoc>("Upload", Upload, "uploads"),
  };
}

export async function ks(): Promise<Models> {
  if (cache.models) return cache.models;
  if (!cache.promise) {
    const uri = process.env.KEYSTONE_MONGODB_URI || process.env.MONGODB_URI;
    if (!uri) throw new Error("KEYSTONE_MONGODB_URI / MONGODB_URI not configured");
    cache.promise = mongoose
      .createConnection(uri, { dbName: KEYSTONE_DB, bufferCommands: false })
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
