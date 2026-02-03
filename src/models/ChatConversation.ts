import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChatConversation extends Document {
  sessionId: string;
  messages: IChatMessage[];
  userInfo?: {
    name?: string;
    email?: string;
  };
  status: "active" | "offline_message" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatConversationSchema = new Schema<IChatConversation>(
  {
    sessionId: { type: String, required: true, unique: true },
    messages: { type: [ChatMessageSchema], default: [] },
    userInfo: {
      name: { type: String },
      email: { type: String },
    },
    status: {
      type: String,
      enum: ["active", "offline_message", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

ChatConversationSchema.index({ status: 1, createdAt: -1 });
ChatConversationSchema.index({ sessionId: 1 });

export const ChatConversation =
  mongoose.models.ChatConversation ||
  mongoose.model<IChatConversation>("ChatConversation", ChatConversationSchema);
