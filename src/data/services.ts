/**
 * Centralized Service Data
 * Single source of truth for:
 * - Services page listing
 * - Chat widget knowledge base
 * - GEO FAQs for AI crawlers
 * - JSON-LD structured data
 */

import type { FAQItem } from "@/components/ui/FAQ";
import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Cpu,
  Settings,
  Shield,
  GraduationCap,
  Server,
  FileText,
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  highlights: string[];
  faqs: FAQItem[];
}

export const services: Service[] = [
  {
    id: "ai-readiness",
    title: "AI Readiness Assessment",
    description:
      "Evaluate your data, infrastructure, and processes to create a strategic AI implementation roadmap.",
    icon: Compass,
    color: "from-blue-500 to-indigo-600",
    highlights: ["Gap analysis", "Roadmap development", "ROI projection"],
    faqs: [
      {
        question: "What is an AI Readiness Assessment?",
        answer:
          "An AI Readiness Assessment evaluates your organization's data infrastructure, processes, and capabilities to create a strategic AI implementation roadmap. We identify opportunities, assess risks, and provide clear ROI projections for AI initiatives.",
      },
      {
        question: "How long does the assessment process take?",
        answer:
          "A typical assessment takes 4-6 weeks, including discovery workshops, technical evaluation, analysis, and roadmap development. Expedited assessments are available for organizations with urgent timelines.",
      },
      {
        question: "What does the assessment cover?",
        answer:
          "We evaluate data quality and accessibility, technology infrastructure, organizational readiness, use case prioritization, skills gaps, change management needs, and develop implementation roadmaps with ROI projections.",
      },
      {
        question: "Who should participate in the assessment?",
        answer:
          "We engage stakeholders across IT, academic leadership, faculty, and operations. This ensures comprehensive input and builds buy-in for AI initiatives across the organization.",
      },
      {
        question: "What deliverables will we receive?",
        answer:
          "You'll receive an executive summary, detailed assessment report, gap analysis matrix, prioritized use case list, implementation roadmap, and financial projections. All materials are presentation-ready for board or leadership review.",
      },
      {
        question:
          "Is the assessment applicable to all types of educational organizations?",
        answer:
          "Yes, we've conducted assessments for K-12 districts, universities, EdTech companies, publishers, corporate training departments, and nonprofit education organizations. Our methodology adapts to your specific context.",
      },
    ],
  },
  {
    id: "custom-ai",
    title: "Custom AI Development",
    description:
      "Bespoke AI solutions built for your specific business needs, content, and pedagogical approach.",
    icon: Cpu,
    color: "from-purple-500 to-primary-600",
    highlights: ["Model fine-tuning", "White-label products", "API development"],
    faqs: [
      {
        question: "What types of custom AI solutions do you develop?",
        answer:
          "We build bespoke AI products including intelligent tutoring systems, content generation engines, assessment platforms, chatbots, recommendation systems, and analytics solutions—all tailored to your specific educational context and pedagogical approach.",
      },
      {
        question: "Can you fine-tune AI models on our content?",
        answer:
          "Yes, we specialize in fine-tuning language models on your curriculum, brand voice, and subject matter. This creates AI that truly understands your content and matches your institutional style.",
      },
      {
        question: "Do you offer white-label AI products?",
        answer:
          "Absolutely. We develop AI solutions that are fully branded as your own. Students and users see your name, your design, and your interface—never ours.",
      },
      {
        question: "What is the typical development timeline?",
        answer:
          "Simple integrations take 2-4 weeks. Custom products typically take 3-6 months from discovery to deployment. We use agile methodology with regular demos and iteration.",
      },
      {
        question:
          "How do you ensure the AI aligns with our educational philosophy?",
        answer:
          "Our team of 300+ educators works alongside engineers throughout development. We ensure AI behavior matches your pedagogical values, whether that's Socratic questioning, mastery-based progression, or other approaches.",
      },
      {
        question: "What ongoing support is provided after development?",
        answer:
          "We offer maintenance agreements including model updates, performance monitoring, bug fixes, and feature enhancements. Many clients transition to our managed services for ongoing operations.",
      },
    ],
  },
  {
    id: "implementation",
    title: "Implementation & Integration",
    description:
      "Full deployment services including API integration, data migration, SSO setup, and LMS connectors.",
    icon: Settings,
    color: "from-orange-500 to-red-600",
    highlights: ["LMS integration", "Data migration", "SSO configuration"],
    faqs: [
      {
        question: "What does AI implementation include?",
        answer:
          "Full deployment services including technical integration, data migration, SSO configuration, LMS connectors, user training, change management, and go-live support. We handle everything needed for successful adoption.",
      },
      {
        question: "Which LMS platforms do you integrate with?",
        answer:
          "We have deep expertise with Canvas, Blackboard, Moodle, D2L Brightspace, Google Classroom, and Schoology. Our team can integrate with virtually any LMS using LTI standards or custom APIs.",
      },
      {
        question: "How do you handle data migration?",
        answer:
          "We map your existing data to the new system, handle transformation and cleanup, and validate accuracy before cutover. Historical data is preserved and accessible in the new environment.",
      },
      {
        question: "What about Single Sign-On (SSO)?",
        answer:
          "We configure SSO with all major identity providers including Okta, Azure AD, Google Workspace, SAML, and OAuth. Users access AI tools seamlessly with existing credentials.",
      },
      {
        question: "Do you provide training for our staff?",
        answer:
          "Comprehensive training is included—administrator training, faculty workshops, and train-the-trainer programs. We also provide documentation, video tutorials, and ongoing support.",
      },
      {
        question: "How long does implementation typically take?",
        answer:
          "Simple integrations take 2-4 weeks. Complex multi-system implementations with data migration typically take 2-4 months. We provide detailed project plans with clear milestones.",
      },
    ],
  },
  {
    id: "ethics-governance",
    title: "AI Ethics & Governance",
    description:
      "Develop responsible AI policies, bias auditing frameworks, and transparency practices.",
    icon: Shield,
    color: "from-emerald-500 to-teal-600",
    highlights: ["Policy development", "Bias auditing", "Compliance frameworks"],
    faqs: [
      {
        question: "Why is AI ethics important in education?",
        answer:
          "Educational AI directly impacts students—their privacy, their opportunities, and their learning. Ethical AI governance ensures fairness, transparency, and responsible use of AI in these high-stakes contexts.",
      },
      {
        question: "What does your ethics and governance service include?",
        answer:
          "We help develop AI policies, conduct bias audits, create transparency frameworks, train staff on responsible AI use, and establish governance committees. The goal is sustainable, ethical AI adoption.",
      },
      {
        question: "How do you audit AI for bias?",
        answer:
          "We analyze AI outputs across demographic groups, test for discriminatory patterns, evaluate training data representation, and recommend remediation strategies. Regular audits ensure ongoing fairness.",
      },
      {
        question: "What compliance frameworks do you address?",
        answer:
          "We help organizations meet FERPA, COPPA, GDPR, state privacy laws, and emerging AI regulations. Our policies are designed to anticipate and adapt to evolving requirements.",
      },
      {
        question: "How do you help with transparency and explainability?",
        answer:
          "We develop communication strategies for AI disclosure, create explainability documentation, and design interfaces that help users understand AI decisions and limitations.",
      },
      {
        question: "Can you help establish an AI governance committee?",
        answer:
          "Yes, we assist with committee charter development, member selection guidance, meeting frameworks, and ongoing consulting to ensure effective AI oversight.",
      },
    ],
  },
  {
    id: "training",
    title: "Faculty & Staff Training",
    description:
      "Train educators on AI tools, prompt engineering, AI-enhanced pedagogy, and academic integrity.",
    icon: GraduationCap,
    color: "from-pink-500 to-rose-600",
    highlights: ["Workshops", "Certification programs", "Train-the-trainer"],
    faqs: [
      {
        question: "What faculty training programs do you offer?",
        answer:
          "We provide workshops on AI tool usage, prompt engineering for educators, AI-enhanced pedagogy, academic integrity in the AI age, and creating AI-ready assignments. Programs range from half-day introductions to multi-week certifications.",
      },
      {
        question: "Can training be customized for our institution?",
        answer:
          "Absolutely. We tailor content to your specific AI tools, teaching contexts, and institutional priorities. Training uses your curriculum examples and addresses your faculty's actual questions.",
      },
      {
        question: "Do you offer train-the-trainer programs?",
        answer:
          "Yes, we prepare internal champions to lead ongoing AI professional development. These programs include materials, facilitation guides, and ongoing support for your trainers.",
      },
      {
        question: "What about student AI literacy training?",
        answer:
          "We develop curriculum for teaching students responsible AI use, critical evaluation of AI outputs, and ethical considerations. Materials are available for various grade levels.",
      },
      {
        question: "How is training delivered?",
        answer:
          "Options include on-site workshops, live virtual sessions, self-paced online modules, or hybrid approaches. We recommend interactive formats for maximum engagement and practical skill building.",
      },
      {
        question: "What support is available after training?",
        answer:
          "Participants receive reference materials, ongoing access to resources, and follow-up Q&A sessions. Extended support packages include coaching and implementation assistance.",
      },
    ],
  },
  {
    id: "managed-services",
    title: "Managed AI Services",
    description:
      "Ongoing hosting, monitoring, model updates, and support for long-term AI success.",
    icon: Server,
    color: "from-slate-600 to-slate-800",
    highlights: ["24/7 monitoring", "Model updates", "Dedicated support"],
    faqs: [
      {
        question: "What are Managed AI Services?",
        answer:
          "Ongoing hosting, monitoring, maintenance, and support for your AI solutions. We handle infrastructure, security, updates, and troubleshooting—so your team can focus on using AI, not managing it.",
      },
      {
        question: "What SLAs do you offer?",
        answer:
          "We offer 99.9% uptime guarantees with defined response times for different issue severities. SLAs are customizable based on your operational requirements.",
      },
      {
        question: "How do you handle AI model updates?",
        answer:
          "We continuously monitor model performance, implement improvements, and deploy updates with minimal disruption. You always have access to the latest capabilities.",
      },
      {
        question: "What security measures are in place?",
        answer:
          "Enterprise-grade security including encryption at rest and in transit, SOC 2 compliance, regular penetration testing, and 24/7 security monitoring. We maintain FERPA and COPPA compliance.",
      },
      {
        question: "Do you provide 24/7 support?",
        answer:
          "Yes, our support team is available around the clock for critical issues. Regular support requests are handled during business hours with guaranteed response times.",
      },
      {
        question: "Can we eventually bring services in-house?",
        answer:
          "Absolutely. We support knowledge transfer and can train your team to take over operations. Many clients start with managed services and transition to self-management as they build internal capabilities.",
      },
    ],
  },
  {
    id: "content",
    title: "Content Transformation",
    description:
      "Convert legacy content from PDFs, print, and old LMS formats to modern, AI-enhanced experiences.",
    icon: FileText,
    color: "from-teal-500 to-cyan-600",
    highlights: [
      "Format conversion",
      "Content modernization",
      "Accessibility compliance",
    ],
    faqs: [
      {
        question: "What is Content Transformation?",
        answer:
          "We convert legacy educational content—PDFs, print materials, old LMS courses—into modern, AI-enhanced digital learning experiences. This includes digitization, accessibility remediation, and interactive enhancements.",
      },
      {
        question: "What source formats can you work with?",
        answer:
          "We process print textbooks, PDFs, Word documents, PowerPoints, legacy LMS exports (Blackboard, older Canvas), SCORM packages, and virtually any educational content format.",
      },
      {
        question: "How do you ensure accessibility compliance?",
        answer:
          "All transformed content meets WCAG 2.1 AA standards. We add alt text, ensure proper structure, fix color contrast, and test with assistive technologies.",
      },
      {
        question: "Can you add interactivity to existing content?",
        answer:
          "Yes, we enhance content with auto-generated quizzes, discussion prompts, embedded multimedia, and interactive elements—transforming passive content into active learning experiences.",
      },
      {
        question: "What is the typical turnaround time?",
        answer:
          "Timeline depends on content volume and complexity. A typical course conversion takes 2-4 weeks. Large textbook digitization projects may take 4-8 weeks. We provide detailed estimates after content review.",
      },
      {
        question: "Do you maintain the original content's accuracy?",
        answer:
          "Absolutely. Subject matter experts review all transformed content for accuracy. We preserve your intellectual property while enhancing delivery format and engagement.",
      },
    ],
  },
];

// Helper function to get a service by ID
export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

// Helper function to get FAQs for a service
export function getServiceFAQs(serviceId: string): FAQItem[] {
  return getServiceById(serviceId)?.faqs || [];
}

// For backward compatibility with existing GEO FAQ imports
export const serviceFAQs: Record<string, FAQItem[]> = Object.fromEntries(
  services.map((service) => [service.id, service.faqs])
);
