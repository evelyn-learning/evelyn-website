/**
 * Branding / metadata contract for the voice tutor engine.
 *
 * The tutor engine itself is generic — it knows nothing about Evelyn
 * Learning, contact addresses, or session policies. A `TutorBranding`
 * record is injected at session-build time and surfaces inside the
 * brain's system prompt as a META block.
 *
 * Replication targets that swap this out:
 *   - D2C retail (default Evelyn branding — see ./evelyn.ts)
 *   - B2B API integrations (partner supplies branding via API request)
 *   - White-label deployments (per-tenant branding loaded from config)
 *
 * Keep fields generic. Anything that would only ever apply to one
 * deployment belongs in `extras` (free-form key/value), NOT as a
 * first-class field.
 */
export interface TutorBranding {
  /** Display name of the operator behind the tutor (e.g. "Evelyn Learning"). */
  productName: string;
  /** Short identity sentence: who/what this tutor is. */
  identity: string;
  /** One-liner summary of how it works pedagogically. */
  methodology: string;
  /** What the student can do to start a session. */
  howToStart: string;
  /** What the student can do to end a session. */
  howToExit: string;
  /** Subjects / scope offered, expressed for student-facing speech. */
  scope: string;
  /** Typical session length / cap statement. */
  sessionLength: string;
  /** What makes this product distinct from generic chat assistants. */
  differentiator: string;
  /** How to reach the operator for more info (email / URL / phone). */
  contact: string;
  /** Optional extras for deployment-specific facts (school name, etc.). */
  extras?: Record<string, string>;
}
