"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@core/utils";
import { FormCaptcha } from "./FormCaptcha";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(1, "Message is required"),
  reason: z.enum(["product_inquiry", "demo_request", "partnership", "careers", "support", "other"]),
  product: z.string().optional(),
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
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const reason = watch("reason");

  // Pre-fill form based on URL params
  useEffect(() => {
    const product = searchParams.get('product');
    const subject = searchParams.get('subject');
    const inquiry = searchParams.get('inquiry');
    const demo = searchParams.get('demo');
    const paper = searchParams.get('paper');
    const segment = searchParams.get('segment');

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

    // Solutions segment landing pages (/solutions/[segment]) link here as a
    // fallback CTA when no booking-call URL is configured. There's no
    // ContactSubmission field for this, so — same approach as the
    // whitepaper `paper` param above — stamp it into the message body as a
    // machine-readable tag the admin view (and a future filter) can key off.
    if (segment) {
      setValue('message', `[segment: ${segment}]\n\n`);
    }

    // Structured intent (spec §6). CTA links carry ?product= and/or
    // ?demo=true; those set the select so the operator never types intent.
    const reasonParam = searchParams.get('reason');
    if (reasonParam) setValue('reason', (reasonParam === 'demo' ? 'demo_request' : reasonParam) as ContactFormData['reason']);
    else if (demo === 'true') setValue('reason', 'demo_request');
    else if (product) setValue('reason', 'product_inquiry');
    if (product) setValue('product', product);
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

      // Spec §6: the ContactSubmission row is written for every reason
      // (including careers) — only the lead is skipped server-side. Careers
      // submitters still get sent on to the careers page instead of seeing
      // the normal success state.
      if (data.reason === "careers") {
        window.location.href = "/careers";
        return;
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

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          What is this about? <span className="text-red-500">*</span>
        </label>
        <select
          {...register("reason")}
          id="reason"
          defaultValue=""
          className={cn("mt-1 block w-full rounded-lg border px-4 py-3 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500", errors.reason ? "border-red-300" : "border-gray-200")}
        >
          <option value="" disabled>Select one</option>
          <option value="product_inquiry">A product inquiry</option>
          <option value="demo_request">Request a demo</option>
          <option value="partnership">Partnership or white-label</option>
          <option value="support">Support for an existing account</option>
          <option value="careers">Careers / job application</option>
          <option value="other">Something else</option>
        </select>
        {errors.reason && <p className="mt-1 text-sm text-red-500">Please choose a reason</p>}
        <input type="hidden" {...register("product")} />
      </div>
      {reason === "careers" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Applying for a role? Please use our <a href="/careers" className="font-semibold underline">careers page</a> so your application reaches the right team.
        </div>
      )}

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
