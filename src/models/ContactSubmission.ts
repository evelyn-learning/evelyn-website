import mongoose, { Schema, Document } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  source: string;
  status: "new" | "read" | "responded" | "archived";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    source: { type: String, default: "contact-form" },
    status: {
      type: String,
      enum: ["new", "read", "responded", "archived"],
      default: "new",
    },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

ContactSubmissionSchema.index({ status: 1, createdAt: -1 });

export const ContactSubmission =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema
  );
