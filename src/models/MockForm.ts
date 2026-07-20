import mongoose, { Schema, Document } from 'mongoose';

/**
 * MockForm — a full-length mock exam form (e.g. a Digital SAT practice
 * test) assembled from ProblemBank items (bankScope: 'mock').
 *
 * A form is organized into sections (e.g. Reading & Writing, Math), each
 * of which has one or more modules (e.g. adaptive module 1 / module 2)
 * containing an ordered list of item ids.
 */
export interface IMockForm extends Document {
  /** Stable form id, e.g. 'dsat-form-a' | 'fixture-form-a'. */
  formId: string;
  /** Blueprint registry key this form is scored/paced against. */
  examKey: string;
  /** Engine topics this form serves, e.g. ['digital-sat']. */
  topicIds: string[];
  /** Human-readable label, e.g. 'SAT Practice Test A'. */
  label: string;
  status: 'draft' | 'live';
  sections: Array<{
    sectionId: string;
    modules: Array<{ moduleId: string; itemIds: string[] }>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MockFormModuleSchema = new Schema(
  {
    moduleId: { type: String, required: true },
    itemIds: [{ type: String, required: true }],
  },
  { _id: false }
);

const MockFormSectionSchema = new Schema(
  {
    sectionId: { type: String, required: true },
    modules: { type: [MockFormModuleSchema], required: true },
  },
  { _id: false }
);

const MockFormSchema = new Schema<IMockForm>(
  {
    formId: { type: String, required: true, trim: true },
    examKey: { type: String, required: true },
    topicIds: { type: [String], required: true },
    label: { type: String, required: true },
    status: { type: String, required: true, enum: ['draft', 'live'] },
    sections: { type: [MockFormSectionSchema], required: true },
  },
  { timestamps: true }
);

MockFormSchema.index({ topicIds: 1, status: 1 });
MockFormSchema.index({ formId: 1 }, { unique: true });

export const MockForm =
  mongoose.models.MockForm ||
  mongoose.model<IMockForm>('MockForm', MockFormSchema);
