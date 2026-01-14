import { Metadata } from "next";
import Link from "next/link";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Interview } from "@/models";
import { formatDate } from "@/lib/utils";
import { Play, ExternalLink, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "Ed-Insights Interviews",
  description:
    "Watch our Ed-Insights interview series featuring conversations with education leaders, innovators, and experts sharing their insights on the future of learning.",
};

async function getInterviews() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    const interviews = await Interview.find().sort({ episode: -1 }).lean();
    return JSON.parse(JSON.stringify(interviews));
  } catch {
    return [];
  }
}

export default async function InterviewsPage() {
  const interviews = await getInterviews();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              Ed-Insights
            </span>
            <h1 className="mt-2 heading-1">Expert Interviews</h1>
            <p className="mt-4 text-lg text-gray-600">
              Candid conversations with education leaders, innovators, and
              experts sharing their insights on transforming learning
              experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Interviews Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {interviews.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview: any) => (
                <article
                  key={interview._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Video Thumbnail */}
                  <a
                    href={interview.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video bg-gradient-to-br from-primary-100 to-secondary-100"
                  >
                    {interview.youtubeId && (
                      <img
                        src={`https://img.youtube.com/vi/${interview.youtubeId}/maxresdefault.jpg`}
                        alt={interview.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                      <div className="rounded-full bg-white/90 p-3 transition-transform group-hover:scale-110">
                        <Play className="h-6 w-6 text-primary-500" />
                      </div>
                    </div>
                    <span className="absolute left-4 top-4 rounded bg-primary-500 px-2 py-1 text-xs font-bold text-white">
                      Episode {interview.episode}
                    </span>
                  </a>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-500">
                      {interview.title}
                    </h2>

                    {/* Guest Info */}
                    <div className="mt-4 flex items-center gap-3">
                      {interview.guest.image ? (
                        <img
                          src={interview.guest.image}
                          alt={interview.guest.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-500">
                          {interview.guest.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {interview.guest.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {interview.guest.title}
                          {interview.guest.company &&
                            `, ${interview.guest.company}`}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                      {interview.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatDate(interview.publishedAt)}
                      </span>
                      <div className="flex gap-2">
                        {interview.guest.linkedIn && (
                          <a
                            href={interview.guest.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-primary-500"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        <a
                          href={interview.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-500"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No interviews available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
