/**
 * Which partners get the 2026-10-19 teaching round (GreenApple T6 + T7).
 *
 * Three behaviours, all in TEXT-mode sessions only (a voice request is the
 * pre-existing one byte for byte):
 *   1. A wrong answer at ANY step, not only to the whole problem, is answered
 *      without its result: the answer check renders no correct value, the
 *      reply names the step where the student's working goes wrong without
 *      its result, and the server's reveal guard (whole-answer-reveal.ts) is
 *      armed for every high-confidence "incorrect" check
 *      (verdict-precheck-shared.ts `WRONG_STEP_NO_REVEAL_RULE`).
 *   2. A false claim that answers none of the questions (a stated
 *      misconception) is judged by the check and corrected, not passed over
 *      (`FALSE_CLAIM_RULE`).
 *   3. The homework problem ledger: each listed problem is OPEN or SOLVED, as
 *      recorded from the check's own finding that the student stated a
 *      problem's complete final answer (lesson-plan/homework-ledger.ts); the
 *      `<homework_session>` block shows it and the brain is told to trust it
 *      over its memory, including when it closes the session.
 *
 * WHY A PARTNER LIST (not a global flag): the shared engine serves Crimsora,
 * evelyntutor, GameClass and Kanzoo; the GAC release rule is that anything
 * reaching main is inert for them until it has been measured for them. These
 * behaviours only narrow what the tutor says (no result stated, a false claim
 * not left standing, no return to a finished problem), so reading the
 * UNVERIFIED partner claim of the embed token is acceptable — a forged claim
 * changes nothing but the forger's own tutor (embed-token.ts
 * `embedTokenPartnerClaim`).
 *
 *   TUTOR_NO_REVEAL_LEDGER_PARTNERS
 *     unset         ⇒ the default list below (GreenApple) — ON for GAC with no
 *                     env change, per the default-ON rule, and for nobody else
 *     'off' or ''   ⇒ nobody
 *     'a,b'         ⇒ those partner ids (trimmed, case-insensitive)
 *     '*'           ⇒ every text session, with or without a partner
 */

export const NO_REVEAL_LEDGER_PARTNERS_ENV = 'TUTOR_NO_REVEAL_LEDGER_PARTNERS';
export const NO_REVEAL_LEDGER_DEFAULT_PARTNERS: readonly string[] = ['greenapple'];

export function noRevealLedgerForPartner(
  partnerId: string | null | undefined,
  env: Record<string, string | undefined> = process.env,
): boolean {
  const raw = env[NO_REVEAL_LEDGER_PARTNERS_ENV];
  const list = raw === undefined
    ? [...NO_REVEAL_LEDGER_DEFAULT_PARTNERS]
    : raw.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  if (list.length === 0 || (list.length === 1 && list[0] === 'off')) return false;
  if (list.includes('*')) return true;
  const id = (partnerId ?? '').trim().toLowerCase();
  return !!id && list.includes(id);
}
