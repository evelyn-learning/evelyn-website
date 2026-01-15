import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  LineChart,
  MessageSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Services",
  description:
    "Leverage cutting-edge AI technology for content creation, assessment generation, and personalized learning experiences.",
};

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content Generation",
    description:
      "Generate high-quality educational content at scale using advanced language models and subject matter expertise.",
  },
  {
    icon: Target,
    title: "Automated Assessment Creation",
    description:
      "Create diverse, standards-aligned assessments automatically with AI-driven question generation.",
  },
  {
    icon: LineChart,
    title: "Personalized Learning Paths",
    description:
      "Adaptive learning systems that customize content delivery based on individual learner needs and progress.",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Tutoring",
    description:
      "AI-powered tutoring systems that provide real-time feedback and support to learners.",
  },
];

const benefits = [
  "Faster content development cycles",
  "Consistent quality at scale",
  "Personalized learner experiences",
  "Data-driven content optimization",
  "Reduced production costs",
  "24/7 learner support capabilities",
];

export default function AIServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white">
                <Brain className="h-7 w-7" />
              </div>
              <h1 className="mt-6 heading-1">AI Services</h1>
              <p className="mt-4 text-lg text-gray-600">
                Leverage cutting-edge artificial intelligence to transform your
                educational content development process. From automated content
                generation to personalized learning experiences.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="btn-primary">
                  Explore AI Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/site/ai-services.webp"
                alt="AI-Powered Educational Solutions"
                width={600}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">AI Capabilities</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Our AI solutions are built on the latest advances in machine
              learning and natural language processing.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-100 bg-white p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Harness the Power of AI?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Discover how our AI solutions can revolutionize your educational
            content strategy.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
          >
            Schedule a Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
