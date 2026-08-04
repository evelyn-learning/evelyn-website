import { ExternalLink } from "lucide-react";

/**
 * Client-story block shown on the four academic /solutions segments
 * (nursing, test-prep-academies, schools, homeschool-charters — gated by
 * `showCrimsora` in src/data/solutions.ts). Factual-only, per the cross-promo
 * design doc's guardrail (docs/superpowers/specs/
 * 2026-08-04-crimsora-evelyn-cross-promotion-design.md, amendment A5): the
 * paragraph below is approved verbatim copy. No metrics, no quotes, no
 * testimonials — nothing beyond what's verifiably live on crimsora.com.
 */
export default function CrimsoraClientStory() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-100">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">
            Client story
          </p>
          <p className="text-xl md:text-2xl font-medium text-slate-900 mb-8">
            Crimsora runs its consumer AP, SAT, ACT and High School tutoring
            product on Evelyn Learning&apos;s Voice Tutor — live voice +
            whiteboard sessions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://crimsora.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2"
            >
              See it live
              <ExternalLink className="w-4 h-4" />
            </a>
            {/* A secondary "Read the client story" link to /showcase/crimsora
                was removed here — that route doesn't exist yet and 404s in
                production. Re-add once the separate cross-promo plan
                (docs/superpowers/plans/2026-08-04-crimsora-evelyn-cross-promotion.md)
                ships that page. */}
          </div>
        </div>
      </div>
    </section>
  );
}
