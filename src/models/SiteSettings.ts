import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  // Contact Information
  contactEmail: string;
  contactPhone: string;
  emergencySupport: string;
  responseTime: string;
  businessHours: string;
  offices: string[];
  demoLink: string;

  // Company Information
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  differentiators: string[];
  stats: Array<{ label: string; value: string }>;

  // Security & Compliance
  securityCertifications: string[];
  securityDescription: string;

  // Integrations
  lmsPlatforms: string[];
  integrationCapabilities: string[];

  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    // Contact Information
    contactEmail: {
      type: String,
      default: "info@evelynlearning.com",
    },
    contactPhone: {
      type: String,
      default: "+1 (302) 212-0975",
    },
    emergencySupport: {
      type: String,
      default:
        "For critical technical issues, text +1 (302) 212-0975 for emergency support",
    },
    responseTime: {
      type: String,
      default:
        "We typically respond within 2 hours during business hours, and within 24 hours for all inquiries",
    },
    businessHours: {
      type: String,
      default: "Monday - Friday: 8:00 AM - 5:00 PM PST",
    },
    offices: {
      type: [String],
      default: ["San Francisco, CA", "New Delhi, India"],
    },
    demoLink: {
      type: String,
      default: "https://calendar.app.google/zzMeoZAgYCatWN8Y6",
    },

    // Company Information
    companyName: {
      type: String,
      default: "Evelyn Learning",
    },
    companyTagline: {
      type: String,
      default: "AI-Powered Learning Solutions for Education",
    },
    companyDescription: {
      type: String,
      default:
        "Evelyn Learning provides enterprise-grade AI solutions for education. We offer 24 AI-powered learning products across 8 categories, plus comprehensive implementation services. Our solutions are white-label ready, FERPA/COPPA/GDPR compliant, and designed by educators for data-driven learning outcomes.",
    },
    differentiators: {
      type: [String],
      default: [
        "300+ educators on our team who understand pedagogy, not just technology",
        "24 AI products with live demos available",
        "100% white-label ready - students never see our brand",
        "Deployment in less than 1 week",
        "24/7 support included",
        "Enterprise-grade security: FERPA, COPPA, GDPR, SOC 2 Type II compliant",
      ],
    },
    stats: {
      type: [{ label: String, value: String }],
      default: [
        { label: "AI Products", value: "24" },
        { label: "Enterprise clients", value: "500+" },
        { label: "Educators trained", value: "10K+" },
        { label: "Uptime SLA", value: "99.9%" },
      ],
    },

    // Security & Compliance
    securityCertifications: {
      type: [String],
      default: [
        "FERPA (Family Educational Rights and Privacy Act)",
        "COPPA (Children's Online Privacy Protection Act)",
        "GDPR (General Data Protection Regulation)",
        "SOC 2 Type II",
        "WCAG 2.1 AA (Accessibility)",
        "CCPA (California Consumer Privacy Act)",
      ],
    },
    securityDescription: {
      type: String,
      default:
        "Enterprise-grade security with AES-256 encryption at rest, TLS 1.3 for data in transit. All data stays within your control. We're built for education institutions that trust us with their most sensitive information.",
    },

    // Integrations
    lmsPlatforms: {
      type: [String],
      default: [
        "Canvas",
        "Blackboard",
        "Moodle",
        "Google Classroom",
        "Schoology",
        "Brightspace (D2L)",
      ],
    },
    integrationCapabilities: {
      type: [String],
      default: [
        "LTI 1.3 Compliant",
        "REST API Access",
        "Single Sign-On (SSO) - SAML 2.0 and OAuth 2.0",
        "Webhook support",
        "Grade passback",
        "Deep linking",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

/**
 * Get site settings (creates default if none exist)
 */
export async function getSiteSettings(): Promise<ISiteSettings> {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}
