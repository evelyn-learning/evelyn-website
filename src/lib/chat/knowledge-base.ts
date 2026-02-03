/**
 * Knowledge Base for Evelyn Learning Chat Widget
 *
 * This module builds the AI system prompt from centralized data sources:
 * - Products: /src/data/products.ts (single source of truth)
 * - Services: /src/data/services.ts (single source of truth)
 * - Site Settings: MongoDB (editable via admin)
 * - Custom Q&A: MongoDB (editable via admin)
 */

import { productCategories, getAllProducts } from "@/data/products";
import { services } from "@/data/services";
import type { ISiteSettings } from "@/models/SiteSettings";

// Plain settings data type (without Mongoose Document properties)
type SiteSettingsData = {
  contactEmail: string;
  contactPhone: string;
  emergencySupport: string;
  responseTime: string;
  businessHours: string;
  offices: string[];
  demoLink: string;
  companyName: string;
  companyTagline: string;
  companyDescription: string;
  differentiators: string[];
  stats: Array<{ label: string; value: string }>;
  securityCertifications: string[];
  securityDescription: string;
  lmsPlatforms: string[];
  integrationCapabilities: string[];
  updatedAt?: Date;
};

// Default settings used when database is not available
const defaultSettings: SiteSettingsData = {
  contactEmail: "info@evelynlearning.com",
  contactPhone: "+1 (302) 212-0975",
  emergencySupport:
    "For critical technical issues, text +1 (302) 212-0975 for emergency support",
  responseTime:
    "We typically respond within 24 hours for all inquiries",
  businessHours: "Monday - Friday: 8:00 AM - 5:00 PM PST",
  offices: ["San Francisco, CA", "New Delhi, India"],
  demoLink: "https://calendar.app.google/zzMeoZAgYCatWN8Y6",
  companyName: "Evelyn Learning",
  companyTagline: "AI-Powered Learning Solutions for Education",
  companyDescription:
    "Evelyn Learning provides enterprise-grade AI solutions for education. We offer 24 AI-powered learning products across 8 categories, plus comprehensive implementation services. Our solutions are white-label ready, FERPA/COPPA/GDPR compliant, and designed by educators for data-driven learning outcomes.",
  differentiators: [
    "300+ educators on our team who understand pedagogy, not just technology",
    "24 AI products with live demos available",
    "100% white-label ready - students never see our brand",
    "Deployment in less than 1 week",
    "24/7 support included",
    "Enterprise-grade security: FERPA, COPPA, GDPR, SOC 2 Type II compliant",
  ],
  stats: [
    { label: "AI Products", value: "24" },
    { label: "Enterprise clients", value: "500+" },
    { label: "Educators trained", value: "10K+" },
    { label: "Uptime SLA", value: "99.9%" },
  ],
  securityCertifications: [
    "FERPA (Family Educational Rights and Privacy Act)",
    "COPPA (Children's Online Privacy Protection Act)",
    "GDPR (General Data Protection Regulation)",
    "SOC 2 Type II",
    "WCAG 2.1 AA (Accessibility)",
    "CCPA (California Consumer Privacy Act)",
  ],
  securityDescription:
    "Enterprise-grade security with AES-256 encryption at rest, TLS 1.3 for data in transit. All data stays within your control. We're built for education institutions that trust us with their most sensitive information.",
  lmsPlatforms: [
    "Canvas",
    "Blackboard",
    "Moodle",
    "Google Classroom",
    "Schoology",
    "Brightspace (D2L)",
  ],
  integrationCapabilities: [
    "LTI 1.3 Compliant",
    "REST API Access",
    "Single Sign-On (SSO) - SAML 2.0 and OAuth 2.0",
    "Webhook support",
    "Grade passback",
    "Deep linking",
  ],
  updatedAt: new Date(),
};

/**
 * Build products section from centralized data
 */
function buildProductsSection(): string {
  return productCategories
    .map(
      (cat) =>
        `**${cat.name}** (${cat.description}):\n${cat.products
          .map((p) => `  - ${p.title}: ${p.tagline}`)
          .join("\n")}`
    )
    .join("\n\n");
}

/**
 * Build services section from centralized data
 */
function buildServicesSection(): string {
  return services
    .map((s) => `- **${s.title}**: ${s.description}`)
    .join("\n");
}

/**
 * Build FAQ section from product and service FAQs
 */
function buildFAQSection(): string {
  const allProducts = getAllProducts();

  // Get a sample of FAQs from products (first FAQ from each product)
  const productFAQSamples = allProducts
    .filter((p) => p.faqs.length > 0)
    .slice(0, 8)
    .map((p) => `Q: ${p.faqs[0].question}\nA: ${p.faqs[0].answer}`);

  // Get first FAQ from each service
  const serviceFAQSamples = services
    .filter((s) => s.faqs.length > 0)
    .map((s) => `Q: ${s.faqs[0].question}\nA: ${s.faqs[0].answer}`);

  // Common general FAQs
  const generalFAQs = [
    {
      question: "How long does implementation take?",
      answer:
        "Most implementations are completed in less than 1 week. Our products are designed for rapid deployment with minimal IT involvement. For custom integrations or complex enterprise deployments, we'll provide a detailed timeline during our initial consultation.",
    },
    {
      question: "Do you offer white-label solutions?",
      answer:
        "Yes! All 24 of our products are 100% white-label ready. Your students will see your branding, colors, and logo—never ours. This is included at no extra cost.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Our pricing is customized based on your institution's size, the products you need, and your deployment preferences. Contact us for a personalized quote.",
    },
  ];

  const generalFAQStrings = generalFAQs.map(
    (f) => `Q: ${f.question}\nA: ${f.answer}`
  );

  return [...generalFAQStrings, ...productFAQSamples.slice(0, 4), ...serviceFAQSamples.slice(0, 3)].join(
    "\n\n"
  );
}

/**
 * Builds the system prompt for the chat bot
 *
 * @param siteSettings - Settings from database (or uses defaults)
 * @param customQAPairs - Custom Q&A pairs from database
 */
export function buildSystemPrompt(
  siteSettings?: Partial<SiteSettingsData> | null,
  customQAPairs?: { question: string; answer: string }[]
): string {
  // Merge provided settings with defaults
  const settings: SiteSettingsData = { ...defaultSettings, ...siteSettings };

  const productsSection = buildProductsSection();
  const servicesSection = buildServicesSection();
  const faqSection = buildFAQSection();

  // Build custom Q&A section if provided
  const customQASection = customQAPairs?.length
    ? `\n## Additional Q&A\n${customQAPairs
        .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
        .join("\n\n")}`
    : "";

  return `You are Evelyn, a helpful AI assistant for ${settings.companyName}. You help visitors learn about our AI-powered educational products and services.

## Your Personality & Response Style
- Be helpful, professional, and knowledgeable
- Use a friendly, conversational tone—like chatting with a helpful colleague
- **Keep responses concise**: Aim for 3-5 sentences for most questions
- Don't overwhelm with information—give key points first, then offer to elaborate
- End with a brief follow-up question when appropriate

**Formatting - USE MARKDOWN BOLD:**
- Use **bold** (double asterisks) for product names, service names, and key terms
- Example: "Our **AI Essay Scoring** product provides instant feedback..."
- Example: "We offer **Custom AI Development** services..."
- This helps users scan and find important information quickly

**For broad questions like "What products/services do you offer?":**
- Give a brief SUMMARY, not a full list (e.g., "We have 24 AI products across 8 categories including **tutoring**, **assessment**, **content creation**, and **analytics**")
- Ask what area interests them rather than listing everything
- Example: "We offer AI tools for **tutoring**, **assessment**, **content authoring**, and **student analytics**. What challenge are you looking to solve?"

## Company Overview
${settings.companyName} - ${settings.companyTagline}

${settings.companyDescription}

**Key Differentiators:**
${settings.differentiators.map((d) => `- ${d}`).join("\n")}

**Company Stats:**
${settings.stats.map((s) => `- ${s.label}: ${s.value}`).join("\n")}

## Contact Information
- **Email:** ${settings.contactEmail}
- **Phone:** ${settings.contactPhone}
- **Contact Page:** https://evelynlearning.com/contact (for inquiries, quotes, or job applications)
- **Schedule a Meeting:** https://calendar.app.google/wy1ke4xc69Cv1GpX6 (30-minute call)
- **Business Hours:** ${settings.businessHours}
- **Offices:** ${settings.offices.join(", ")}
- **Response Time:** ${settings.responseTime}
- **Emergency Support:** ${settings.emergencySupport}
- **Demo Scheduling:** ${settings.demoLink}

## Products (${getAllProducts().length} AI Products across ${productCategories.length} Categories)

${productsSection}

## Services

${servicesSection}

## Security & Compliance
${settings.securityDescription}

**Certifications:** ${settings.securityCertifications.join(", ")}

## Integrations
**Supported LMS Platforms:** ${settings.lmsPlatforms.join(", ")}

**Technical Capabilities:** ${settings.integrationCapabilities.join(", ")}

## Frequently Asked Questions

${faqSection}
${customQASection}

## Guidelines for Responses

**CRITICAL - Response Approach:**
- Keep responses conversational and focused (aim for 50-150 words)
- NEVER try to list all products or all services—summarize categories instead
- For broad questions: summarize + ask a clarifying question to narrow down
- For specific questions: give a direct, complete answer
- It's better to have a back-and-forth conversation than to front-load everything

**Topic-Specific Guidelines:**
- **Pricing:** Say pricing is customized and suggest the contact page (https://evelynlearning.com/contact) or emailing ${settings.contactEmail}
- **Demos:** Share the demo link (${settings.demoLink}) or mention live demos on https://evelynlearning.com/products
- **Scheduling a call:** Share the meeting link: https://calendar.app.google/wy1ke4xc69Cv1GpX6
- **Jobs:** Direct to https://evelynlearning.com/contact
- **Technical details:** Give the highlights, offer to connect them with our team for specifics
- **Contact info:** Mention email (${settings.contactEmail}), phone (${settings.contactPhone}), and contact page. Keep it brief.
- **Urgent issues:** Text ${settings.contactPhone} for critical tech issues

**IMPORTANT - Always use full URLs so they appear as clickable links:**
- Contact page: https://evelynlearning.com/contact
- Products page: https://evelynlearning.com/products
- Schedule meeting: https://calendar.app.google/wy1ke4xc69Cv1GpX6
- Demo scheduling: ${settings.demoLink}

Remember: You represent ${settings.companyName}. Be helpful and conversational, not encyclopedic. Guide the conversation naturally.`;
}

// Re-export types for convenience
export type { SiteSettingsData };
