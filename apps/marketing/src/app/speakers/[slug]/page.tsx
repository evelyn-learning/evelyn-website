import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB, isDBConfigured } from "@core/db";
import { Speaker } from "@/models";
import {
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  ArrowLeft,
  Video,
  Mic,
  Calendar,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all speakers (enables sitemap discovery)
export async function generateStaticParams() {
  if (!isDBConfigured()) {
    return [];
  }

  try {
    await connectDB();
    const speakers = await Speaker.find().select("slug").lean();
    return speakers.map((s) => ({
      slug: s.slug,
    }));
  } catch (error) {
    console.warn("Could not fetch speakers for static generation:", error);
    return [];
  }
}

async function getSpeaker(slug: string) {
  if (!isDBConfigured()) return null;
  await connectDB();
  const speaker = await Speaker.findOne({ slug }).lean();
  return speaker ? JSON.parse(JSON.stringify(speaker)) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await getSpeaker(slug);

  if (!speaker) {
    return { title: "Speaker Not Found" };
  }

  const title = speaker.company
    ? `${speaker.name} — ${speaker.title}, ${speaker.company}`
    : `${speaker.name} — ${speaker.title}`;

  return {
    title,
    description: speaker.bio,
    openGraph: {
      title,
      description: speaker.bio,
      type: "profile",
      ...(speaker.image && { images: [{ url: speaker.image }] }),
    },
  };
}

function ContentTypeBadge({ contentType }: { contentType: string }) {
  if (contentType === "webinar") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600">
        <Video className="h-3.5 w-3.5" />
        Ed-Confabs Webinar Speaker
      </span>
    );
  }
  if (contentType === "interview") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1 text-sm font-medium text-secondary-600">
        <Mic className="h-3.5 w-3.5" />
        Ed-Insights Interview Guest
      </span>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600">
        <Video className="h-3.5 w-3.5" />
        Webinar Speaker
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-50 px-3 py-1 text-sm font-medium text-secondary-600">
        <Mic className="h-3.5 w-3.5" />
        Interview Guest
      </span>
    </div>
  );
}

export default async function SpeakerPage({ params }: Props) {
  const { slug } = await params;
  const speaker = await getSpeaker(slug);

  if (!speaker) {
    notFound();
  }

  return (
    <>
      {/* Back navigation */}
      <section className="bg-gray-50 py-4">
        <div className="container-wide">
          <Link
            href="/speakers"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Speakers
          </Link>
        </div>
      </section>

      {/* Speaker Profile */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 md:py-16">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              {speaker.image ? (
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-primary-100 md:h-40 md:w-40"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary-100 text-4xl font-bold text-primary-500 ring-4 ring-primary-50 md:h-40 md:w-40 md:text-5xl">
                  {speaker.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
              )}

              {/* Name & Title */}
              <h1 className="mt-6 text-3xl font-bold text-gray-900 md:text-4xl">
                {speaker.name}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {speaker.title}
                {speaker.company && (
                  <>
                    {" "}
                    at{" "}
                    <span className="font-medium text-gray-700">
                      {speaker.company}
                    </span>
                  </>
                )}
              </p>

              {/* Content type badge */}
              <div className="mt-4">
                <ContentTypeBadge contentType={speaker.contentType} />
              </div>

              {/* Year */}
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                {speaker.year}
              </div>

              {/* Social links */}
              <div className="mt-6 flex items-center gap-3">
                {speaker.linkedIn && (
                  <a
                    href={speaker.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2.5 text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-500"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {speaker.twitter && (
                  <a
                    href={speaker.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2.5 text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-500"
                    aria-label="Twitter profile"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {speaker.website && (
                  <a
                    href={speaker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gray-100 p-2.5 text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-500"
                    aria-label="Personal website"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900">About</h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              {speaker.bio.split("\n\n").map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Content link */}
            {speaker.contentUrl && (
              <div className="mt-8">
                <a
                  href={speaker.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  {speaker.contentType === "webinar"
                    ? "Watch Webinar"
                    : speaker.contentType === "interview"
                    ? "Watch Interview"
                    : "View Content"}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* More from Evelyn Learning */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900">
              More from Evelyn Learning
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/webinars"
                className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 transition-colors group-hover:bg-primary-200">
                  <Video className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Ed-Confabs Webinars
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Monthly expert panel discussions
                  </p>
                </div>
              </Link>
              <Link
                href="/interviews"
                className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 transition-colors group-hover:bg-secondary-200">
                  <Mic className="h-5 w-5 text-secondary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Ed-Insights Interviews
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    One-on-one conversations with leaders
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
