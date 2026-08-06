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

export interface PipelineDeps {
  call: CallModel;
  fetchFn?: typeof fetch;
}

export function researchedToLeadRow(
  r: ResearchedLead,
  opts: { segment: string; jobId: string; emailVerified: boolean }
): Record<string, unknown> {
  const linkedinOk = r.linkedinUrl && r.sourceUrls.includes(r.linkedinUrl);
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
      ...(linkedinOk ? { linkedinUrl: r.linkedinUrl } : {}),
      ...(opts.emailVerified && r.email ? { email: r.email } : {}),
      emailVerified: opts.emailVerified && !!r.email,
    },
    currentDraft: { channel: "email", subject: r.draftSubject, body: r.draftBody },
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
    });
    return { outcome: emailVerified ? "inserted" : "no_email", row, note };
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
        job.status = "aborted_cost";
        await job.save();
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
      await job.save();
    }

    job.status = "done";
    await job.save();
  } catch (e) {
    job.status = "failed";
    job.error = e instanceof Error ? e.message : String(e);
    await job.save();
  }
}
