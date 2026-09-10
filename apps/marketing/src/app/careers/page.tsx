import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Zap,
  Users,
  GraduationCap,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Evelyn Learning team in San Francisco. Open roles in AI/ML, infrastructure, AI research, and design engineering.",
};

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive medical, dental, and vision coverage plus wellness programs",
  },
  {
    icon: Zap,
    title: "Flexible Hours",
    description: "An in-person team at our San Francisco office, with flexible working hours",
  },
  {
    icon: GraduationCap,
    title: "Learning & Growth",
    description: "Professional development budget and learning opportunities",
  },
  {
    icon: Users,
    title: "Great Team",
    description: "Work with passionate educators and technologists",
  },
];

// Every opening is on-site at the San Francisco office. This block is shown
// under each role and applies to all of them, so it lives in one place.
const eligibility = [
  "This position is on-site at our San Francisco, CA office (5 days a week). Remote or hybrid arrangements are not available for this role.",
  "Candidates must currently reside in the United States, within commuting distance of San Francisco or willing to relocate at their own expense before the start date. Relocation assistance is not provided.",
  "Candidates must be legally authorized to work in the United States on a permanent basis. We are unable to sponsor or take over sponsorship of an employment visa (H-1B, OPT/CPT, TN, O-1, etc.) now or in the future.",
  "Interviews are conducted in person at our San Francisco office; the final round includes an on-site working session with the team.",
];

type Opening = {
  title: string;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
};

const openings: Opening[] = [
  {
    title: "AI/ML Engineer",
    department: "Technology",
    location: "San Francisco, CA (On-site)",
    type: "Full-time",
    summary:
      "Own the intelligence layer behind our voice tutor, content-generation pipelines, and assessment engines. You will design the prompts, tool schemas, evaluation harnesses, and model-routing logic that turn frontier LLMs into a dependable teacher for K-12 and higher-ed students, and ship that work to production every week.",
    responsibilities: [
      "Design, build, and ship LLM-powered features end to end: prompt and tool-schema design, structured output contracts, guardrails, and fallbacks across multiple model providers.",
      "Build and maintain the evaluation harnesses (LLM-as-judge, scripted scenario replays, regression corpora) that decide whether a pedagogy or prompt change is safe to deploy.",
      "Own model routing and cost instrumentation: choose the right model per task, measure quality vs. latency vs. spend, and defend those decisions with data.",
      "Improve the real-time tutoring loop: speech-to-text and text-to-speech integration, turn-taking, interruption handling, and whiteboard-grounded explanations.",
      "Build content-generation pipelines (lesson plans, problem banks, rubrics, answer verification) with automated quality gates, and scale them across grades and subjects.",
      "Instrument production sessions, triage failures from real student transcripts, root-cause them, and land fixes with tests that keep them fixed.",
      "Partner with curriculum specialists to encode pedagogy (scaffolding, misconception handling, mastery signals) into system behavior rather than one-off prompt patches.",
    ],
    requirements: [
      "4+ years of professional software engineering experience, including 2+ years shipping LLM- or ML-backed features to production users.",
      "Strong TypeScript and Node.js; comfortable in a Next.js codebase and with Python for data and evaluation tooling.",
      "Hands-on experience with at least two of: Anthropic, OpenAI, Google, or open-weight model APIs, including tool use / function calling and streaming.",
      "Experience designing evaluation systems for non-deterministic outputs and using them to gate releases.",
      "Working knowledge of speech pipelines (STT/TTS, WebSockets, audio buffering) or a strong desire to learn them quickly.",
      "Solid grounding in ML fundamentals: embeddings, retrieval, fine-tuning trade-offs, and when not to use them.",
      "A track record of debugging production systems from logs and traces, and of writing clear post-incident analyses.",
      "Bachelor's degree in Computer Science, Engineering, Mathematics, or equivalent practical experience.",
    ],
    niceToHave: [
      "Experience in education technology, tutoring products, or assessment design.",
      "Familiarity with MongoDB, Redis, and event-driven architectures.",
      "Published work, open-source contributions, or talks on LLM evaluation, agents, or speech interfaces.",
    ],
  },
  {
    title: "Lead Infrastructure Engineer",
    department: "Technology",
    location: "San Francisco, CA (On-site)",
    type: "Full-time",
    summary:
      "Lead the platform that runs our voice tutor, learning portals, and content pipelines. You will own reliability, deployment, observability, cost, and security across a multi-app Node.js/Next.js stack backed by MongoDB, and set the engineering standards the rest of the team builds on.",
    responsibilities: [
      "Own production end to end: provisioning, deployment pipelines, process management, TLS and edge configuration, backups, and disaster recovery.",
      "Design and run the observability stack (structured logging, metrics, tracing, alerting) so that incidents are detected before students notice them.",
      "Harden the platform: secrets management, least-privilege access, network isolation, dependency and vulnerability management, and audit trails.",
      "Build the internal deploy tooling and pre-deploy gates (type-check, tests, build verification, environment-drift checks) and keep them fast and trustworthy.",
      "Scale real-time workloads: WebSocket audio streaming, LLM and speech vendor traffic, rate limiting, and queueing under bursty load.",
      "Own infrastructure cost: instrument vendor and compute spend, set budgets, and drive down cost per tutoring session without hurting quality.",
      "Mentor engineers on operational excellence, run blameless post-mortems, and turn recurring incidents into permanent fixes.",
    ],
    requirements: [
      "7+ years of software or infrastructure engineering experience, including 3+ years owning production reliability for a customer-facing product.",
      "Deep Linux fluency and hands-on experience operating Node.js services at scale (pm2/systemd, nginx or similar reverse proxies, TLS, DNS, CDNs).",
      "Strong experience with MongoDB (replica sets, indexing, backup/restore, migrations) or a comparable document database.",
      "Proficiency with infrastructure-as-code and CI/CD tooling (Terraform/Ansible, GitHub Actions or equivalent) and with containerization.",
      "Proven track record designing monitoring and alerting that finds real problems with a low false-positive rate.",
      "Security-minded by default: you have implemented secrets rotation, access controls, and vulnerability management in a real production environment.",
      "Excellent written communication; you document runbooks and decisions so that others can operate what you built.",
      "Bachelor's degree in Computer Science, Engineering, or equivalent practical experience.",
    ],
    niceToHave: [
      "Experience with real-time audio or WebRTC infrastructure.",
      "Experience with FERPA, COPPA, or SOC 2 compliance programs in an education or healthcare context.",
      "Prior experience as a technical lead or engineering manager for a small platform team.",
    ],
  },
  {
    title: "AI Research Engineer",
    department: "Research",
    location: "San Francisco, CA (On-site)",
    type: "Full-time",
    summary:
      "Run the experiments that decide how our tutor teaches. You will study real tutoring sessions, form hypotheses about pedagogy, learner modeling, and model behavior, test them rigorously, and turn the winners into production systems together with the engineering team.",
    responsibilities: [
      "Design and run controlled experiments on tutoring behavior: scaffolding strategies, misconception handling, pacing, recap and review policies, and mastery estimation.",
      "Build learner-model research: evidence logging, per-objective skill estimates, spaced-review scheduling, and validation against downstream outcomes.",
      "Develop and maintain evaluation datasets and LLM-judge rubrics that measure teaching quality, not just answer correctness.",
      "Prototype new capabilities (multimodal whiteboard understanding, spoken-math parsing, adaptive problem generation) and hand off production-ready specifications.",
      "Benchmark models and prompting strategies across quality, latency, and cost, and publish internal reports with clear recommendations.",
      "Analyze production transcripts at scale to find failure modes, quantify them, and prioritize fixes with engineering.",
      "Stay current with the research literature in AI for education, LLM evaluation, and speech, and translate it into concrete experiments.",
    ],
    requirements: [
      "MS or PhD in Computer Science, Machine Learning, Learning Sciences, or a related field, or equivalent research experience.",
      "3+ years of applied research or research engineering experience with language models, including hands-on prompt, tool-use, and evaluation work.",
      "Strong Python skills for experimentation and analysis; enough TypeScript to read production code and ship small changes.",
      "Solid statistics: experimental design, hypothesis testing, and the discipline to avoid fooling yourself with noisy metrics.",
      "Experience building evaluation pipelines for open-ended generation (LLM-as-judge, human-rating protocols, inter-rater reliability).",
      "Ability to write clearly for both researchers and engineers, and to turn findings into specifications others can build.",
      "A genuine interest in how people learn and in measuring whether a tutor actually helps.",
    ],
    niceToHave: [
      "Background in intelligent tutoring systems, knowledge tracing, or item response theory.",
      "Publications or open-source work on LLM evaluation, agents, or educational AI.",
      "Experience with speech or multimodal models.",
    ],
  },
  {
    title: "Design Engineer",
    department: "Product",
    location: "San Francisco, CA (On-site)",
    type: "Full-time",
    summary:
      "Design and build the interfaces students and teachers actually use: the voice-tutor session screen, the interactive whiteboard, practice and mock-exam players, and the learning portals. You will own both the visual design and the front-end implementation, and you care as much about how something feels at 60 fps as how it looks in Figma.",
    responsibilities: [
      "Own the end-to-end design and implementation of student- and teacher-facing UI in React, Next.js, and Tailwind, from concept to polished production code.",
      "Design real-time interaction patterns for voice tutoring: captions synced to speech, turn-taking cues, interruption affordances, and stage/presence layouts.",
      "Build and refine the whiteboard experience: rendering of math, diagrams, and handwriting-style annotations; student marks; replay and export.",
      "Establish and maintain our design system (tokens, components, motion, accessibility) and keep it consistent across marketing, portals, and the tutor.",
      "Prototype quickly with real data and real sessions, run usability sessions with students and teachers, and iterate on what you learn.",
      "Make everything accessible and responsive: keyboard navigation, screen readers, reduced motion, low-bandwidth and mobile constraints.",
      "Partner with AI and content engineers so that what the model produces (equations, cards, layouts) renders beautifully and legibly.",
    ],
    requirements: [
      "4+ years of experience shipping production web interfaces where you owned both the design and the code.",
      "Expert React and TypeScript; strong CSS and layout fundamentals; comfortable with Next.js and Tailwind.",
      "A portfolio demonstrating strong visual and interaction design judgment, ideally including complex or real-time interfaces.",
      "Experience with canvas or SVG rendering, animation, and performance profiling in the browser.",
      "Working knowledge of accessibility standards (WCAG 2.2) and how to implement them without compromising the design.",
      "Ability to work directly from ambiguous problems to shipped features, and to write clear design rationale.",
      "Bachelor's degree in Design, Human-Computer Interaction, Computer Science, or equivalent practical experience.",
    ],
    niceToHave: [
      "Experience rendering math (KaTeX/MathJax) or building educational or drawing tools.",
      "Experience with audio-driven UI, WebSockets, or streaming interfaces.",
      "Familiarity with Figma-to-code workflows and design tokens.",
    ],
  },
];

function JobSection({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
        {heading}
      </h4>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CareersPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1">Join Our Team</h1>
            <p className="mt-4 text-lg text-gray-600">
              Help us transform education through innovative content and
              technology. We are always looking for passionate individuals to
              join our growing team.
            </p>
            <p className="mt-3 text-base text-gray-600">
              All current openings are full-time, on-site roles at our San
              Francisco, CA office and are open to candidates already based in
              the United States who are authorized to work here without
              sponsorship.
            </p>
          </div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="bg-white">
        <div className="container-wide">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/site/team.jpg"
              alt="Evelyn Learning Team"
              width={1400}
              height={400}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Why Work With Us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              At Evelyn Learning, we believe in creating an environment where
              talented people can do their best work.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Open Positions</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Explore our current openings and find your perfect role. Every
              role below is based at our San Francisco office.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {openings.map((job) => (
              <details
                key={job.title}
                className="group rounded-xl border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <summary className="flex cursor-pointer list-none flex-col gap-4 md:flex-row md:items-center md:justify-between [&::-webkit-details-marker]:hidden">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                      {job.title}
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
                    </h3>
                    <p className="mt-1 text-gray-600">{job.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400 group-open:hidden">
                      Click to view responsibilities and requirements
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="btn-primary whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </summary>

                <div className="mt-6 grid gap-8 border-t border-gray-100 pt-6 md:grid-cols-2">
                  <JobSection
                    heading="What you will do"
                    items={job.responsibilities}
                  />
                  <div className="space-y-6">
                    <JobSection
                      heading="What we are looking for"
                      items={job.requirements}
                    />
                    <JobSection heading="Nice to have" items={job.niceToHave} />
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                    Location and eligibility
                  </h4>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-gray-600">
                    {eligibility.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-gray-500">
                    Applications that do not meet the location and work
                    authorization requirements above will not be considered.
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white">
            Do not See Your Role?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            We are always interested in hearing from talented individuals based
            in the San Francisco Bay Area. Send us your resume and let us know
            how you can contribute.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
