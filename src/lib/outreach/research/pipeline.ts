// Orchestrates one ResearchJob: discovery -> per-candidate research ->
// anti-fabrication gate -> insert as staged Lead. All state lives on the
// job doc so a restart resumes cleanly. Per-candidate errors never kill
// the job; 3 consecutive errors, the cost cap, or a cancel do.
import { connectDB } from "@/lib/db";
import { Lead } from "@/models/Lead";
import { ResearchJob, type IResearchJob, type ICandidate } from "@/models/ResearchJob";
import { callWithToolLoop, extractJson, type CallModel } from "./claude";
import { discoveryParams, candidateParams, type ResearchedLead } from "./prompts";
import { priceUsageUsd, costCapUsd, type UsageLike } from "./cost";
import { verifyEmailPublished } from "./verify-email";
import { validateLeadRows, insertLeads } from "../import-leads";
import { enrichLead, type ChainOutcome } from "../enrich/chain";
import type { EnrichInput } from "../enrich/types";

export interface PipelineDeps {
  call: CallModel;
  fetchFn?: typeof fetch;
  enrich?: (input: EnrichInput) => Promise<ChainOutcome>;
}

export function researchedToLeadRow(
  r: ResearchedLead,
  opts: { segment: string; jobId: string; emailVerified: boolean }
): Record<string, unknown> {
  const linkedinOk = r.linkedinUrl && r.sourceUrls.includes(r.linkedinUrl);
  const emailKept = opts.emailVerified && !!r.email;
  return {
    company: r.company,
    segment: opts.segment,
    about: r.about,
    whyFit: r.whyFit,
    useCaseHypothesis: r.useCaseHypothesis,
    website: r.website,
    source: r.source || `research-job:${opts.jobId}`,
    decisionMaker: {
      name: r.decisionMakerName,
      title: r.decisionMakerTitle,
      ...(linkedinOk ? { linkedinUrl: r.linkedinUrl, linkedinSource: "research" } : {}),
      ...(emailKept ? { email: r.email, emailSource: "published" } : {}),
      emailVerified: emailKept,
    },
    currentDraft: { channel: "email", subject: r.draftSubject, body: r.draftBody },
    linkedinDraft: r.inmailSubject && r.inmailBody ? { subject: r.inmailSubject, body: r.inmailBody } : null,
    contactFormDraft: r.contactFormBody ? { body: r.contactFormBody } : null,
    contactPageUrl: r.contactPageUrl || undefined,
    notes: `Researched by job ${opts.jobId}. Sources: ${r.sourceUrls.join(", ")}`,
  };
}

export interface CandidateOutcome {
  outcome: "inserted" | "no_email" | "discarded" | "error";
  row?: Record<string, unknown>;
  note?: string;
}

// Research one candidate. DB-free: returns the mapped row (or a discard/
// error outcome); the caller validates, dedupes, and saves.
export async function runCandidate(
  candidate: { company: string; website: string },
  job: { segment: string; niche: string; jobId: string },
  deps: PipelineDeps,
  onUsage: (u: UsageLike) => void
): Promise<CandidateOutcome> {
  try {
    const msg = await callWithToolLoop(
      deps.call,
      candidateParams({
        segment: job.segment, niche: job.niche,
        company: candidate.company, website: candidate.website,
      }),
      onUsage
    );
    const r = extractJson(msg) as ResearchedLead;

    if (!r.decisionMakerName && !r.email) {
      return { outcome: "discarded", note: "no real decision-maker found" };
    }

    let emailVerified = false;
    let note: string | undefined;
    if (r.email && r.emailSourceUrl) {
      emailVerified = await verifyEmailPublished(r.email, r.emailSourceUrl, deps.fetchFn ?? fetch);
      if (!emailVerified) note = `email ${r.email} not verified at ${r.emailSourceUrl} — stripped`;
    } else if (r.email && !r.emailSourceUrl) {
      note = `email ${r.email} had no source URL — stripped`;
    } else {
      note = "no published email found";
    }

    const row = researchedToLeadRow(r, {
      segment: job.segment, jobId: job.jobId, emailVerified,
    }) as Record<string, unknown> & {
      decisionMaker: {
        name: string; title: string;
        linkedinUrl?: string; email?: string; emailVerified: boolean;
        emailSource?: string; emailProvider?: string; linkedinSource?: string;
        linkedinProvider?: string;
      };
    };
    let outcome: CandidateOutcome["outcome"] = emailVerified ? "inserted" : "no_email";

    // Auto-enrich: only when we have a real person and are missing either
    // channel. Never lets an enrichment failure fail the candidate — this
    // whole block is best-effort on top of an already-valid row.
    if (r.decisionMakerName && (!row.decisionMaker.email || !row.decisionMaker.linkedinUrl)) {
      let websiteDomain: string | undefined;
      try {
        websiteDomain = new URL(candidate.website).hostname;
      } catch {
        websiteDomain = undefined;
      }
      if (websiteDomain) {
        try {
          const enrich = deps.enrich ?? enrichLead;
          const { result } = await enrich({
            name: r.decisionMakerName,
            title: r.decisionMakerTitle,
            company: candidate.company,
            websiteDomain,
          });
          if (result) {
            if (!row.decisionMaker.email && result.email) {
              row.decisionMaker.email = result.email;
              row.decisionMaker.emailSource = "vendor";
              row.decisionMaker.emailVerified = false;
              row.decisionMaker.emailProvider = result.provider;
              if (outcome === "no_email") {
                outcome = "inserted";
                note = `email via ${result.provider}`;
              }
            }
            if (!row.decisionMaker.linkedinUrl && result.linkedinUrl) {
              row.decisionMaker.linkedinUrl = result.linkedinUrl;
              row.decisionMaker.linkedinSource = "vendor";
              row.decisionMaker.linkedinProvider = result.provider;
            }
          }
        } catch {
          // Enrichment is best-effort on top of an already-valid research
          // result — a vendor/network hiccup must never fail the candidate.
        }
      }
    }

    return { outcome, row, note };
  } catch (e) {
    return { outcome: "error", note: e instanceof Error ? e.message : String(e) };
  }
}

// Full job run. Claims nothing itself — the worker sets status: "running"
// before calling. Safe to re-enter after a crash: only "pending" candidates
// are processed.
export async function processJob(jobId: string, deps: PipelineDeps): Promise<void> {
  await connectDB();
  const job = (await ResearchJob.findById(jobId)) as IResearchJob | null;
  if (!job) return;

  const addUsage = async (u: UsageLike) => {
    job.costUsd += priceUsageUsd(u);
    job.tokens.input += (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0);
    job.tokens.output += u.output_tokens ?? 0;
  };

  try {
    // Phase 1: discovery (skipped on resume if candidates already exist)
    if (job.candidates.length === 0) {
      const existing = await Lead.find({ segment: job.segment }, { company: 1 }).lean();
      const msg = await callWithToolLoop(
        deps.call,
        discoveryParams({
          segment: job.segment, niche: job.niche ?? "", region: job.region ?? "",
          wanted: Math.min(25, Math.ceil(job.count * 1.5)),
          excludeCompanies: existing.map((l) => l.company as string),
        }),
        (u) => { void addUsage(u); }
      );
      const parsed = extractJson(msg) as { candidates: Array<{ company: string; website: string }> };
      job.candidates = parsed.candidates.map((c) => ({
        company: c.company, website: c.website, status: "pending" as const,
      })) as unknown as ICandidate[];
      // Lease heartbeat — renewed each candidate (and here, after discovery)
      // so a crashed process's job is re-claimable after LEASE_MS, not a
      // full job duration.
      job.claimedAt = new Date();
      await job.save();
    }

    // Phase 2: per-candidate research
    let consecutiveErrors = 0;
    for (const candidate of job.candidates) {
      if (candidate.status !== "pending") continue;
      if (job.progress.inserted >= job.count) break;

      // Re-read status for cancel awareness (route flips it to "cancelled")
      const fresh = await ResearchJob.findById(jobId, { status: 1 }).lean() as { status: string } | null;
      if (fresh?.status === "cancelled") { job.status = "cancelled"; await job.save(); return; }

      if (job.costUsd >= costCapUsd()) {
        // Guarded write: don't clobber a cancel that landed after the last
        // per-candidate check — a job already flipped to "cancelled" stays
        // "cancelled".
        await ResearchJob.updateOne(
          { _id: job._id, status: "running" },
          { $set: { status: "aborted_cost" } }
        );
        return;
      }

      const out = await runCandidate(
        { company: candidate.company, website: candidate.website },
        { segment: job.segment, niche: job.niche ?? "", jobId: String(job._id) },
        deps,
        (u) => { void addUsage(u); }
      );

      if (out.outcome === "error") {
        consecutiveErrors++;
        candidate.status = "error";
        candidate.note = out.note;
        job.progress.errors++;
        if (consecutiveErrors >= 3) {
          job.status = "failed";
          job.error = `3 consecutive candidate errors; last: ${out.note}`;
          await job.save();
          return;
        }
      } else if (out.outcome === "discarded") {
        consecutiveErrors = 0;
        candidate.status = "discarded";
        candidate.note = out.note;
        job.progress.discarded++;
      } else {
        consecutiveErrors = 0;
        const { docs, counts } = validateLeadRows([out.row]);
        if (counts.invalid > 0) {
          candidate.status = "discarded";
          candidate.note = `schema-invalid: ${counts.errors[0]}`;
          job.progress.discarded++;
        } else {
          const inserted = await insertLeads(docs);
          if (inserted.skippedDupes > 0) {
            candidate.status = "dupe";
            candidate.note = "already in pipeline";
            job.progress.skippedDupes++;
          } else {
            candidate.status = out.outcome === "inserted" ? "inserted" : "no_email";
            candidate.note = out.note;
            if (out.outcome === "inserted") job.progress.inserted++;
            else { job.progress.inserted++; job.progress.noEmail++; }
          }
        }
      }
      // Lease heartbeat — renewed each candidate so a crashed process's job
      // is re-claimable after LEASE_MS, not a full job duration.
      job.claimedAt = new Date();
      await job.save();
    }

    // Guarded write: don't clobber a cancel that landed after the last
    // per-candidate check — a job already flipped to "cancelled" stays
    // "cancelled".
    await ResearchJob.updateOne(
      { _id: job._id, status: "running" },
      { $set: { status: "done" } }
    );
  } catch (e) {
    job.status = "failed";
    job.error = e instanceof Error ? e.message : String(e);
    await job.save();
  }
}
