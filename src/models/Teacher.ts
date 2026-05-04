import mongoose, { Schema, Document } from 'mongoose';

export interface IGoogleAuth {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  connectedEmail: string;
  connectedAt: Date;
}

export interface ITeacher extends Document {
  email: string;
  name?: string;
  googleAuth?: IGoogleAuth;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleAuthSchema = new Schema<IGoogleAuth>(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
    connectedEmail: { type: String, required: true },
    connectedAt: { type: Date, required: true },
  },
  { _id: false }
);

const TeacherSchema = new Schema<ITeacher>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: { type: String },
    googleAuth: { type: GoogleAuthSchema, required: false, default: undefined },
  },
  { timestamps: true }
);

export const Teacher =
  (mongoose.models.Teacher as mongoose.Model<ITeacher>) ||
  mongoose.model<ITeacher>('Teacher', TeacherSchema);
