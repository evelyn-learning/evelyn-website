import { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Globe,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Evelyn Learning - over 20 years of experience in educational content development, AI-powered learning solutions, and curriculum expertise.",
};

const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive for excellence in every piece of content we create, ensuring accuracy and pedagogical effectiveness.",
  },
  {
    icon: Eye,
    title: "Innovation",
    description:
      "We embrace cutting-edge technologies including AI to deliver modern, engaging learning experiences.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description:
      "We maintain the highest ethical standards in all our partnerships and content development practices.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We work closely with our clients, understanding their unique needs to deliver tailored solutions.",
  },
];

const milestones = [
  { year: "2003", event: "Evelyn Learning founded in New Delhi, India" },
  { year: "2008", event: "Expanded services to US educational publishers" },
  { year: "2012", event: "Launched digital content development division" },
  { year: "2018", event: "Opened Bay Area office in California" },
  { year: "2022", event: "Introduced AI-powered content solutions" },
  { year: "2024", event: "Serving 500+ clients across 50+ countries" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="heading-1">About Evelyn Learning</h1>
            <p className="mt-4 text-lg text-gray-600">
              For over two decades, we have been at the forefront of educational
              content innovation, helping institutions and organizations
              transform the way they teach and learn.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-primary-100 bg-primary-50 p-8">
              <Target className="h-12 w-12 text-primary-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="mt-4 text-gray-700">
                To empower educational institutions, publishers, and
                organizations with innovative content solutions that enhance
                learning outcomes and make quality education accessible to all.
              </p>
            </div>

            <div className="rounded-2xl border border-secondary-100 bg-secondary-50 p-8">
              <Eye className="h-12 w-12 text-secondary-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Our Vision
              </h2>
              <p className="mt-4 text-gray-700">
                To be the global leader in educational content development,
                recognized for our commitment to quality, innovation, and the
                transformative impact of our solutions on learners worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="heading-2">Our Story</h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Founded in 2003, Evelyn Learning began with a simple yet
                  powerful vision: to bridge the gap between educational content
                  needs and innovative solutions that truly make a difference in
                  learners lives.
                </p>
                <p>
                  What started as a small team of passionate educators and
                  content specialists has grown into a global organization
                  serving publishers, educational institutions, and corporations
                  across more than 50 countries.
                </p>
                <p>
                  Today, we combine deep educational expertise with cutting-edge
                  AI technology to deliver content solutions that are not just
                  informative, but transformative.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-primary-500">
                        {milestone.year}
                      </span>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="heading-2">Our Core Values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              These principles guide everything we do, from how we develop
              content to how we build relationships with our clients.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-500 py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">20+</div>
              <div className="mt-1 text-primary-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="mt-1 text-primary-100">Clients Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">1M+</div>
              <div className="mt-1 text-primary-100">Content Items</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="mt-1 text-primary-100">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide text-center">
          <h2 className="heading-2">Ready to Work With Us?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Discover how Evelyn Learning can help you achieve your educational
            content goals. Let us start a conversation.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
