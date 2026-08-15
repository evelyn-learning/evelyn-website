/**
 * Backfill TutorSession.location for sessions recorded BEFORE geo capture
 * shipped (2026-07-19). Those docs stored no clientIp, so the location is
 * recovered by time-joining against the demo-analytics visit that brought
 * the student to /tutor: demosessions (productId 'voice-tutor') carry a
 * full ip-api location per visit.
 *
 * Join rule (deliberately conservative — wrong geo is worse than no geo):
 *   - only tutorsessions with NO location and source != 'embed' (embed
 *     sessions run on partner sites; they have no demosession visit)
 *   - candidate demo visits: voice-tutor demosessions with a location,
 *     started between 30min before and 1min after the tutor session start
 *     (the visit begins on page load, the voice session some minutes later)
 *   - a match is applied ONLY when exactly one candidate visit exists for
 *     the session AND that visit isn't the unique candidate of any other
 *     tutorsession in the same window (no ambiguous sharing)
 *
 * Applied docs get locationSource:'demo-visit-join' so backfilled geo is
 * distinguishable from directly-captured geo forever.
 *
 * Usage (on the prod box):
 *   npx tsx scripts/backfill-tutorsession-locations.ts          # dry run
 *   npx tsx scripts/backfill-tutorsession-locations.ts --apply
 */
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const WINDOW_BEFORE_MS = 30 * 60_000;
const WINDOW_AFTER_MS = 60_000;

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(process.env.MONGODB_URI);
  const tutorSessions = mongoose.connection.collection('tutorsessions');
  const demoSessions = mongoose.connection.collection('demosessions');

  const targets = await tutorSessions
    .find(
      { location: { $exists: false }, source: { $ne: 'embed' } },
      { projection: { sessionId: 1, startedAt: 1, source: 1 } },
    )
    .sort({ startedAt: 1 })
    .toArray();

  const visits = await demoSessions
    .find(
      { productId: 'voice-tutor', location: { $exists: true } },
      { projection: { sessionId: 1, startedAt: 1, location: 1 } },
    )
    .sort({ startedAt: 1 })
    .toArray();

  // sessionId -> unique candidate visit (null = ambiguous/none)
  const candidateOf = new Map<string, (typeof visits)[number] | null>();
  // visit sessionId -> how many tutorsessions claim it as unique candidate
  const claimCount = new Map<string, number>();

  for (const t of targets) {
    const ts = new Date(t.startedAt as string | Date).getTime();
    if (!Number.isFinite(ts)) { candidateOf.set(t.sessionId, null); continue; }
    const inWindow = visits.filter((v) => {
      const vs = new Date(v.startedAt as string | Date).getTime();
      return vs >= ts - WINDOW_BEFORE_MS && vs <= ts + WINDOW_AFTER_MS;
    });
    if (inWindow.length === 1) {
      candidateOf.set(t.sessionId, inWindow[0]);
      claimCount.set(inWindow[0].sessionId, (claimCount.get(inWindow[0].sessionId) ?? 0) + 1);
    } else {
      candidateOf.set(t.sessionId, null);
    }
  }

  let matched = 0, ambiguous = 0, none = 0, applied = 0;
  for (const t of targets) {
    const v = candidateOf.get(t.sessionId);
    if (!v) { none++; continue; }
    if ((claimCount.get(v.sessionId) ?? 0) > 1) { ambiguous++; continue; }
    matched++;
    const loc = v.location as { city?: string; regionName?: string; countryCode?: string; region?: string; country?: string };
    // demosessions store ip-api's raw shape; tutorsessions use {city, region, country(code)}
    const mapped = {
      ...(loc.city ? { city: loc.city } : {}),
      ...(loc.regionName ? { region: loc.regionName } : {}),
      ...(loc.countryCode ? { country: loc.countryCode } : {}),
    };
    if (Object.keys(mapped).length === 0) { none++; matched--; continue; }
    console.log(`${APPLY ? 'APPLY' : 'match'}  ${t.sessionId}  ${new Date(t.startedAt as string | Date).toISOString()}  <-  ${v.sessionId}  ${JSON.stringify(mapped)}`);
    if (APPLY) {
      await tutorSessions.updateOne(
        { sessionId: t.sessionId, location: { $exists: false } },
        { $set: { location: mapped, locationSource: 'demo-visit-join' } },
      );
      applied++;
    }
  }

  console.log(`\ntargets=${targets.length}  matched=${matched}  ambiguous-skipped=${ambiguous}  no-candidate=${none}  applied=${applied}${APPLY ? '' : '  (dry run — pass --apply to write)'}`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
