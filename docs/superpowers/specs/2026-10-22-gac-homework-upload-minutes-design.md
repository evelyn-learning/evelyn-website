# GAC homework — upload billed as tutoring minutes

Date: 2026-10-22. Owner: Praveen ("Upload billing: yes build it"; 1 tutoring minute per PROBLEM on the sheet). Academy worktree `gac-29oct` (`/Users/luke/Dev/academy/.claude/worktrees/gac-29oct`, HEAD `25ac4090`). Engine unchanged.

## Why

Preparing an uploaded sheet costs real money per problem (two or three solve calls plus a figure build, ≈ $0.07–0.10 each) and today none of it reaches the student's minutes, the program pool, the admin cost column or the daily email. The partner is billed on tutoring minutes, so the upload is billed as minutes too.

## What

**Rate.** `UPLOAD_SECONDS_PER_PROBLEM = 60`: every problem on a sheet costs one tutoring minute, charged once per set when the engine reports the build done (`buildDone`), whatever each problem's build outcome (a problem that ended `unverified` still ran its solves). A 10-problem sheet charges 10 minutes.

**Where the minutes land.** The student's fair-use ledger row (`UsageLedger`, the same `(userId, period)` row the heartbeat tick and the gate use, resolved by the same `periodFor` rule) gains `uploadSecondsUsed`. Everywhere the ledger's used seconds are read, "used" is `voiceSecondsUsed + uploadSecondsUsed`: the mint gate and time box (`readStatus` / `gateFairUse` / `remainingFor`), the student's usage summary, the program pool (`poolUsedSeconds` sums both), the admin usage roster, and the daily usage report. Trial users (`isTrialId`) have no ledger and are not charged. Exempt users' rows still record the seconds (they are excluded from the pool sum exactly as today).

**Idempotence.** `HomeworkSet` gains `buildBilledAt?: Date` and `buildBilledSeconds?: number`. The charge is a compare-and-set on `{ _id, buildBilledAt: { $exists: false } }`; only the request that wins writes the ledger `$inc`. Concurrent polls, re-kicks and a later refresh never double-charge.

**Admin visibility.** The admin usage roster row gains `uploadSeconds` (this period's `uploadSecondsUsed`), and `usedSeconds` includes it. The pilot roster's Cost bills upload seconds at the TEXT rate (`rosterCostUsd` gains an optional `upload` seconds input) and shows "incl. N min uploads" under the cost when non-zero. The daily usage report rows gain `uploadSeconds`; `totalMinutes` and each row's minutes include it; the pool figures follow `poolUsedSeconds`.

**Out of scope.** Gating the upload itself when the student is out of minutes (an upload can push a student over the cap; the next session start is refused as today). Deleted-student usage lines. The dev-portal / engine partner pool.

## Acceptance

Upload a 10-problem sheet as the GAC test student; once the list shows every card ready, the admin usage roster shows 10 more used minutes for that student (`uploadSeconds` 600) and the cost column up by 10 × the text rate; the daily report JSON row carries `uploadSeconds: 600`; re-opening the list changes nothing.
