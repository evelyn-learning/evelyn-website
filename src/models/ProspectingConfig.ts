import mongoose, { Schema, Document } from "mongoose";

export interface IProspectCandidate {
  businessName: string;
  websiteUrl: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactFormUrl?: string;
  discoveredAt: Date;
  status: 'discovered' | 'processing' | 'demo_created' | 'failed';
  errorMessage?: string;
  showcaseSlug?: string; // Link to created showcase site
}

export interface IProspectingConfig extends Document {
  // Configuration
  seedConcept: string;
  maxDrafts: number;
  isActive: boolean;

  // Business type preferences
  businessTypes: string[]; // e.g., ['test-prep', 'tutoring', 'college-consulting']

  // Outreach settings
  outreachEmailTemplate: string;
  outreachContactFormTemplate: string;
  autoOutreachOnActivate: boolean;

  // Queue management
  candidates: IProspectCandidate[];

  // Stats
  totalDiscovered: number;
  totalDemosCreated: number;
  totalOutreachSent: number;

  // Timestamps
  lastProspectingRun?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProspectCandidateSchema = new Schema({
  businessName: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  location: String,
  contactEmail: String,
  contactPhone: String,
  contactFormUrl: String,
  discoveredAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['discovered', 'processing', 'demo_created', 'failed'],
    default: 'discovered',
  },
  errorMessage: String,
  showcaseSlug: String,
});

const ProspectingConfigSchema = new Schema<IProspectingConfig>(
  {
    // Configuration
    seedConcept: {
      type: String,
      default: '',
    },
    maxDrafts: {
      type: Number,
      default: 15,
      min: 1,
      max: 50,
    },
    isActive: {
      type: Boolean,
      default: false,
    },

    // Business type preferences
    businessTypes: {
      type: [String],
      default: ['test-prep', 'tutoring', 'college-consulting'],
    },

    // Outreach settings
    outreachEmailTemplate: {
      type: String,
      default: `Subject: We built you a free website demo - {{businessName}}

Hi there,

I came across {{businessName}} and was impressed by what you're doing for students. I wanted to show you what a modern, AI-powered website could look like for your business.

I've created a free demo website just for you:
{{demoUrl}}

Access Code: {{accessCode}}

This demo includes:
• A modern, mobile-friendly design
• AI-powered chat widget trained on your services
• Staff portal for managing content
• Practice test generator and homework helper tools

The demo is available for 14 days. If you like what you see, we can launch it on your own domain.

No obligation - just wanted to share what's possible!

Best regards,
The Evelyn Learning Team
info@evelynlearning.com
+1 (302) 212-0975`,
    },
    outreachContactFormTemplate: {
      type: String,
      default: `Hi! I came across {{businessName}} and created a free demo website to show you what a modern, AI-powered site could look like for your tutoring business.

Check it out here: {{demoUrl}}
Access Code: {{accessCode}}

No strings attached - just thought you might find it interesting!

- Evelyn Learning Team`,
    },
    autoOutreachOnActivate: {
      type: Boolean,
      default: false, // Manual trigger for safety
    },

    // Queue management
    candidates: [ProspectCandidateSchema],

    // Stats
    totalDiscovered: { type: Number, default: 0 },
    totalDemosCreated: { type: Number, default: 0 },
    totalOutreachSent: { type: Number, default: 0 },

    // Timestamps
    lastProspectingRun: Date,
  },
  {
    timestamps: true,
  }
);

// Ensure only one config document exists (singleton pattern)
ProspectingConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      seedConcept: '',
      isActive: false,
    });
  }
  return config;
};

export const ProspectingConfig =
  mongoose.models.ProspectingConfig ||
  mongoose.model<IProspectingConfig>("ProspectingConfig", ProspectingConfigSchema);
