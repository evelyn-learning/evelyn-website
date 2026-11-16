import mongoose, { Schema, type Connection, type Model } from "mongoose";
import { KEYSTONE_DB, type Role, type SectionKind, type Stage } from "./config";

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
  /** Castle Rock's own worked solution from the QTI export, for reference. */
  castleRockSolutionHtml?: string;
  stage: Stage;
  version: number;
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
};

export type ActivityDoc = {
  itemId: string;
  version?: number;
  type: "verdict" | "comment" | "revision" | "stage" | "upload";
  verdict?: "approved" | "changes";
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

type Models = {
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
    castleRockSolutionHtml: String,
    stage: { type: String, index: true },
    version: { type: Number, default: 0 },
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
  });
  Solution.index({ itemId: 1, version: 1 }, { unique: true });
  const Activity = new Schema<ActivityDoc>({
    itemId: { type: String, required: true, index: true },
    version: Number,
    type: String,
    verdict: String,
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
  return {
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
