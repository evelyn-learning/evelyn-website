"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormCaptcha } from "./FormCaptcha";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Map URL params to human-readable subjects
const SUBJECT_MAP: Record<string, string> = {
  // General inquiries
  'integration': 'Integration Inquiry',
  'demo': 'Request a Demo',
  'security': 'Security & Compliance Inquiry',

  // Services
  'services': 'Professional Services Inquiry',
  'ai-readiness': 'AI Readiness Assessment',
  'implementation': 'Implementation & Integration Services',
  'ethics-governance': 'AI Ethics & Governance Consulting',
  'training': 'Faculty & Staff Training',
  'managed-services': 'Managed AI Services',
  'custom-ai': 'Custom AI Development',
  'content': 'Content Services',

  // Research & Case Studies
  'research': 'Research Inquiry',
  'research-report': 'Research Report Request',
  'research-partnership': 'Research Partnership Inquiry',
  'whitepaper': 'White Paper Request',
  'industry-report': 'Industry Report Request',
  'case-study': 'Case Study Inquiry',

  // Products
  'essay-ai': 'AI Essay Scoring & Feedback',
  'homework-bot': '24/7 AI Homework Helper',
  'test-generator': 'AI Practice Test Generator',
  'tutor-copilot': 'AI Tutoring Co-Pilot',
  'math-solver': 'AI Math Solver',
  'content-authoring': 'Content Authoring AI',
  'plagiarism-detection': 'Plagiarism & AI Detection',
  'reading-comprehension': 'Reading Comprehension AI',
  'adaptive-learning': 'Adaptive Learning Engine',
  'language-learning': 'Language Learning AI',
  'analytics-dashboard': 'Student Analytics Dashboard',
  'virtual-labs': 'Virtual Lab Simulations',
  'curriculum-designer': 'AI Curriculum Designer',
  'accessibility-ai': 'Content Accessibility AI',
  'proctoring-suite': 'AI Proctoring Suite',
  'student-success-predictor': 'Student Success Predictor',
  'course-creator-studio': 'AI Course Creator Studio',
  'corporate-training': 'Corporate Training AI',
  'admissions-assistant': 'AI Admissions Assistant',
  'textbook-digitizer': 'Textbook Digitizer',
  'parent-engagement': 'Parent Engagement Portal',
  'career-pathways': 'Career Pathways AI',
  'research-assistant': 'Research Assistant AI',
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaVerified = useCallback((verified: boolean) => {
    setIsCaptchaVerified(verified);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Pre-fill form based on URL params
  useEffect(() => {
    const product = searchParams.get('product');
    const subject = searchParams.get('subject');
    const inquiry = searchParams.get('inquiry');
    const demo = searchParams.get('demo');
    const paper = searchParams.get('paper');

    if (product) {
      const productName = SUBJECT_MAP[product] || product;
      const subjectText = demo === 'true'
        ? `Demo Request: ${productName}`
        : `Inquiry: ${productName}`;
      setValue('subject', subjectText);
    } else if (inquiry) {
      // Handle inquiry param (used in services, research, case studies links)
      const inquiryName = SUBJECT_MAP[inquiry] || inquiry.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      setValue('subject', inquiryName);

      // Also add context to message if it's a whitepaper request
      if (paper) {
        const paperName = SUBJECT_MAP[paper] || paper.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        setValue('message', `I'm interested in downloading the white paper: "${paperName}"\n\nPlease send me access to this resource.`);
      }
    } else if (subject) {
      const subjectText = SUBJECT_MAP[subject] || subject;
      setValue('subject', subjectText);
    } else if (demo === 'true') {
      setValue('subject', 'Request a Demo');
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      setStatus("success");
      reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message"
      );
    }
  };

  if (status === "success") {
    return (
      <div className="mt-8 rounded-lg bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold text-green-800">
          Message Sent Successfully!
        </h3>
        <p className="mt-2 text-green-600">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-green-700 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      {status === "error" && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className={cn(
              "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              errors.name ? "border-red-300" : "border-gray-200"
            )}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className={cn(
              "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              errors.email ? "border-red-300" : "border-gray-200"
            )}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="phone"
            className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="+1 (234) 567-890"
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company / Organization
          </label>
          <input
            {...register("company")}
            type="text"
            id="company"
            className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Acme Inc."
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700"
        >
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          {...register("subject")}
          type="text"
          id="subject"
          className={cn(
            "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            errors.subject ? "border-red-300" : "border-gray-200"
          )}
          placeholder="How can we help?"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          className={cn(
            "mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
            errors.message ? "border-red-300" : "border-gray-200"
          )}
          placeholder="Tell us about your project or inquiry..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Captcha */}
      <FormCaptcha
        onVerified={handleCaptchaVerified}
        storageKey="contact_form_captcha"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading" || !isCaptchaVerified}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>

      {!isCaptchaVerified && (
        <p className="text-center text-sm text-gray-500">
          Please complete the security check above to send your message.
        </p>
      )}
    </form>
  );
}
