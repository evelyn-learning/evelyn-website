import { Metadata } from "next";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Speaker } from "@/models";
import { Linkedin, ExternalLink, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Speakers Hall of Fame",
  description:
    "Meet the distinguished speakers who have shared their expertise through our Ed-Confabs webinars and Ed-Insights interviews.",
};

async function getSpeakers() {
  if (!isDBConfigured()) return [];
  try {
    await connectDB();
    const speakers = await Speaker.find().sort({ year: -1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(speakers));
  } catch {
    return [];
  }
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers();

  // Group speakers by year
  const speakersByYear = speakers.reduce((acc: any, speaker: any) => {
    if (!acc[speaker.year]) {
      acc[speaker.year] = [];
    }
    acc[speaker.year].push(speaker);
    return acc;
  }, {});

  const years = Object.keys(speakersByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 heading-1">Speakers Hall of Fame</h1>
            <p className="mt-4 text-lg text-gray-600">
              Celebrating the distinguished educators, innovators, and thought
              leaders who have shared their expertise through our programs.
            </p>
          </div>
        </div>
      </section>

      {/* Speakers by Year */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {years.length > 0 ? (
            <div className="space-y-16">
              {years.map((year) => (
                <div key={year}>
                  <div className="mb-8 flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-primary-500">
                      {year}
                    </h2>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {speakersByYear[year].map((speaker: any) => (
                      <div
                        key={speaker._id}
                        className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                      >
                        {/* Avatar */}
                        <div className="mb-4 flex justify-center">
                          {speaker.image ? (
                            <img
                              src={speaker.image}
                              alt={speaker.name}
                              className="h-24 w-24 rounded-full object-cover ring-4 ring-primary-50"
                            />
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-500 ring-4 ring-primary-50">
                              {speaker.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="text-center">
                          <h3 className="font-bold text-gray-900">
                            {speaker.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {speaker.title}
                            {speaker.company && (
                              <>
                                <br />
                                <span className="text-gray-500">
                                  {speaker.company}
                                </span>
                              </>
                            )}
                          </p>
                        </div>

                        {/* Bio */}
                        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                          {speaker.bio}
                        </p>

                        {/* Links */}
                        <div className="mt-4 flex items-center justify-center gap-3">
                          {speaker.linkedIn && (
                            <a
                              href={speaker.linkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-primary-100 hover:text-primary-500"
                            >
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                          {speaker.contentUrl && (
                            <a
                              href={speaker.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-100"
                            >
                              {speaker.contentType === "webinar"
                                ? "Watch Webinar"
                                : speaker.contentType === "interview"
                                ? "Watch Interview"
                                : "View Content"}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-600">
                No speakers in the Hall of Fame yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Become a Speaker CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide">
          <div className="rounded-2xl bg-primary-500 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Interested in Speaking?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-100">
              We are always looking for passionate educators and industry experts
              to share their insights. If you would like to contribute to our
              webinar or interview series, we would love to hear from you.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-500 transition-colors hover:bg-gray-100"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
