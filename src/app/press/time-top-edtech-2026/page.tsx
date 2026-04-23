import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.evelynlearning.com";
const PAGE_PATH = "/press/time-top-edtech-2026";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${SITE_URL}/press/time-top-edtech-2026/og-image.png`;
const PUBLISHED_AT = "2026-04-22";
const TIME_ARTICLE_URL =
  "https://time.com/article/2026/04/22/america-top-edtech-companies-2026/";

export const metadata: Metadata = {
  title:
    "Evelyn Learning Named One of TIME's Top EdTech Companies of 2026 | Evelyn Learning",
  description:
    "Evelyn Learning has been recognized by TIME and Statista as one of America's Top EdTech Companies of 2026, selected from 250 leading firms based on financial strength and industry impact.",
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Evelyn Learning",
    title:
      "Evelyn Learning Named One of TIME's Top EdTech Companies of 2026",
    description:
      "Recognized by TIME and Statista as one of America's Top EdTech Companies of 2026 — selected from 250 leading firms based on financial strength and industry impact.",
    publishedTime: `${PUBLISHED_AT}T00:00:00.000Z`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Evelyn Learning — Recognized by TIME as one of America's Top EdTech Companies of 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Evelyn Learning Named One of TIME's Top EdTech Companies of 2026",
    description:
      "Recognized by TIME and Statista as one of America's Top EdTech Companies of 2026.",
    images: [OG_IMAGE],
  },
};

function NewsArticleJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline:
      "Evelyn Learning Named One of TIME's Top EdTech Companies of 2026",
    datePublished: PUBLISHED_AT,
    image: [OG_IMAGE],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": PAGE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Evelyn Learning",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type RankingRow = {
  rank: number;
  company: string;
  hq: string;
  score: string;
  highlight?: boolean;
};

const topTen: RankingRow[] = [
  { rank: 1, company: "Duolingo", hq: "Pennsylvania", score: "95.5" },
  { rank: 2, company: "Coursera", hq: "California", score: "91.6" },
  {
    rank: 3,
    company: "Superhuman (formerly Grammarly)",
    hq: "California",
    score: "88.6",
  },
  { rank: 4, company: "ClassDojo", hq: "California", score: "88.1" },
  { rank: 5, company: "Udemy", hq: "California", score: "87.3" },
  {
    rank: 6,
    company: "Class Technologies",
    hq: "District of Columbia",
    score: "87.0",
  },
  { rank: 7, company: "Frontline", hq: "Pennsylvania", score: "86.7" },
  { rank: 8, company: "Learneo", hq: "California", score: "86.6" },
  {
    rank: 9,
    company: "Evelyn Learning",
    hq: "California",
    score: "86.0",
    highlight: true,
  },
  { rank: 10, company: "Age of Learning", hq: "California", score: "85.7" },
];

const pillars = [
  {
    title: "Teacher DNA",
    body: "Every Evelyn employee has taught before — it's a hiring requirement, not a marketing line.",
  },
  {
    title: "AI trained by teachers",
    body: "Our models learn from curriculum and educator feedback — not just scraped from the web.",
  },
  {
    title: "Built for outcomes",
    body: "86% of students using Evelyn content improve their scores.",
  },
];

export default function TimeTopEdtech2026Page() {
  return (
    <>
      <NewsArticleJsonLd />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(122, 42, 142, 0.35) 0%, transparent 50%),
                                radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            }}
          />
        </div>

        <div className="container-wide relative py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand-styled "badge" — text only, no external marks */}
            <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm px-8 py-6 mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-300">
                Recognition · April 2026
              </span>
              <span className="font-heading text-2xl md:text-3xl font-bold text-white">
                Top EdTech Companies of 2026
              </span>
              <span className="text-sm text-slate-300">
                United States · Ranked by TIME and Statista
              </span>
            </div>

            {/* Rank callout */}
            <div className="mb-10 flex items-baseline justify-center gap-4 md:gap-6">
              <span
                className="font-heading font-bold leading-none bg-gradient-to-br from-primary-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
                style={{ fontSize: "clamp(5rem, 16vw, 11rem)" }}
              >
                #9
              </span>
              <span className="font-heading text-2xl md:text-4xl font-semibold text-slate-300">
                of 250
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Evelyn Learning Named One of TIME&apos;s Top EdTech Companies of
              2026
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Ranked #9 of 250 in TIME&apos;s America&apos;s Top EdTech
              Companies 2026 — alongside Duolingo, Coursera, Grammarly, Udemy,
              and ClassDojo.
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-400">
              Published April 22, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Lead paragraph */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
              Evelyn Learning has been recognized by{" "}
              <span className="font-semibold text-slate-900">TIME</span> and{" "}
              <span className="font-semibold text-slate-900">Statista</span>{" "}
              as one of America&apos;s Top EdTech Companies of 2026 — a list
              evaluating 250 leading U.S. EdTech companies based on{" "}
              <span className="font-semibold">financial strength (70%)</span>{" "}
              and{" "}
              <span className="font-semibold">industry impact (30%)</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Top 10 ranking */}
      <section className="bg-white border-t border-slate-100">
        <div className="container-wide pb-16 md:pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
                The ranking · Top 10
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                Evelyn Learning at #9
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-4 sm:px-6 w-16">
                      Rank
                    </th>
                    <th scope="col" className="px-4 py-4 sm:px-6">
                      Company
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-6 py-4"
                    >
                      Headquarters
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-4 sm:px-6 text-right w-20"
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topTen.map((row) => (
                    <tr
                      key={row.rank}
                      className={
                        row.highlight
                          ? "bg-primary-50 border-l-4 border-primary-500"
                          : "bg-white"
                      }
                    >
                      <td
                        className={`px-4 py-4 sm:px-6 font-heading text-lg ${
                          row.highlight
                            ? "font-bold text-primary-700"
                            : "text-slate-500"
                        }`}
                      >
                        {row.rank}
                      </td>
                      <td
                        className={`px-4 py-4 sm:px-6 ${
                          row.highlight
                            ? "font-bold text-primary-700"
                            : "font-medium text-slate-900"
                        }`}
                      >
                        {row.company}
                        {row.highlight && (
                          <span className="ml-2 align-middle inline-flex items-center rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                            That&apos;s us
                          </span>
                        )}
                        <span className="block md:hidden text-xs text-slate-500 mt-0.5">
                          {row.hq}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-slate-600">
                        {row.hq}
                      </td>
                      <td
                        className={`px-4 py-4 sm:px-6 text-right tabular-nums ${
                          row.highlight
                            ? "font-bold text-primary-700"
                            : "text-slate-700"
                        }`}
                      >
                        {row.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Source: TIME &amp; Statista, America&apos;s Top EdTech Companies
              2026 (published April 22, 2026). Data reproduced for reference;
              see{" "}
              <a
                href={TIME_ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-700"
              >
                the TIME article
              </a>{" "}
              for the full ranking.
            </p>
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Why this matters
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              What this recognition reflects
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm"
              >
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="bg-white">
        <div className="container-wide py-16 md:py-20">
          <figure className="max-w-3xl mx-auto">
            <svg
              className="w-12 h-12 text-primary-300 mb-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-2xl md:text-3xl font-heading text-slate-900 leading-snug">
              When we started Evelyn in 2013, we made an unusual bet: that the
              future of education wouldn&apos;t be won by the best AI company
              or the best content company — but by the one that could do both,
              deeply. This recognition validates that conviction.
            </blockquote>
            <figcaption className="mt-6 text-slate-600">
              <span className="font-semibold text-slate-900">Praveen Tyagi</span>
              {" — "}Founder, Evelyn Learning
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Read the article CTA */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700 text-white">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Read the full story
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              See the complete list of America&apos;s Top EdTech Companies of
              2026 in TIME.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={TIME_ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-slate-100 transition-all shadow-lg"
              >
                Read the article on TIME
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Press contact */}
      <section className="bg-slate-50">
        <div className="container-wide py-16">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
                Press contact
              </span>
              <h2 className="font-heading text-2xl font-bold text-slate-900 mt-2 mb-4">
                Media inquiries
              </h2>
              <p className="text-slate-600 mb-6">
                For interview requests, additional commentary, or background on
                Evelyn Learning&apos;s work, please reach out.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:info@evelynlearning.com"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@evelynlearning.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Contact Evelyn
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Trademark disclaimer */}
            <p className="mt-8 text-xs text-slate-500 text-center leading-relaxed">
              TIME and Statista are trademarks of their respective owners.
              Evelyn Learning&apos;s inclusion in this ranking does not imply
              endorsement.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
