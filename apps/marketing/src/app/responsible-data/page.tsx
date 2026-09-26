import { Metadata } from "next";
import Link from "next/link";

// Public policy page for ELS Corp's human-data collection programme (AI
// training data). Deliberately outside the product navigation: it is a policy
// document referenced from partner and vendor applications, not a service
// page. Every practice stated here was confirmed true by the policy owner on
// 2026-09-26 before publication; do not add commitments that are not in place.

export const metadata: Metadata = {
  title: "Responsible Data Collection Policy",
  description:
    "How ELS Corp collects human data for AI training: informed opt-in consent, participant control, redaction of sensitive content, fair compensation, and strict use limits.",
  alternates: { canonical: "https://evelynlearning.com/responsible-data" },
};

const LAST_UPDATED = "September 26, 2026";
const POLICY_VERSION = "1.0";

export default function ResponsibleDataPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 py-16">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
              ELS Corp · Human data for AI training
            </p>
            <h1 className="heading-1">Responsible Data Collection Policy</h1>
            <p className="mt-4 text-gray-600">
              Version {POLICY_VERSION} · Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl prose prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-primary-600">
            <h2>1. Scope</h2>
            <p>
              ELS Corp, doing business as Evelyn Learning (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;), collects consented human data that is used to train and evaluate
              artificial-intelligence systems. This policy governs every such collection we run,
              including screen and computer-use recordings, knowledge and expert-task data, and
              video collections, whether delivered to a client or used in our own research.
            </p>
            <p>
              It applies to all of our staff, contractors, and collection tooling, and it sits
              alongside our{" "}
              <Link href="/privacy">Privacy Policy</Link> and{" "}
              <Link href="/security">Security &amp; Compliance</Link> statements, which cover our
              website and products.
            </p>

            <h2>2. Principles</h2>
            <ul>
              <li>
                <strong>Informed consent.</strong> Nobody is recorded without understanding what is
                captured, why, and how to stop.
              </li>
              <li>
                <strong>Participant control.</strong> Participants decide when collection runs and
                what stays out of it.
              </li>
              <li>
                <strong>Data minimisation.</strong> We collect what the task needs and remove what
                it does not.
              </li>
              <li>
                <strong>Fair compensation.</strong> Participants are paid, and the terms are clear
                before they enrol.
              </li>
              <li>
                <strong>Security and segregation.</strong> Each client&apos;s data is held apart and
                reached only by the people who need it.
              </li>
              <li>
                <strong>Accountability.</strong> A named owner is responsible for this policy, and
                every collection is run against it.
              </li>
            </ul>

            <h2>3. Informed, opt-in consent</h2>
            <p>
              Participation is voluntary and opt-in. Before any recording starts, each participant
              is shown, in plain language, what our desktop application captures (for example
              screen content, keystrokes, and mouse activity during a task), what it is used for,
              who will receive it, and how compensation works. Consent is recorded before
              collection begins and can be withdrawn at any time.
            </p>
            <p>
              The application gives participants direct control while it runs: it shows clearly
              when recording is active, and it provides pause and stop controls that the
              participant can use at any moment without giving a reason.
            </p>

            <h2>4. Who participates</h2>
            <ul>
              <li>All participants are adults, aged 18 or over.</li>
              <li>Identity is verified when a participant enrols.</li>
              <li>
                Compensation is disclosed up front, before enrolment, and paid for completed work as
                agreed.
              </li>
              <li>
                Participants may be segmented by education or professional background so that tasks
                match their expertise; that segmentation is used for task assignment, not to profile
                or evaluate individuals.
              </li>
            </ul>

            <h2>5. What we exclude or redact</h2>
            <p>
              Participants can exclude specific applications and windows from collection so that
              personal or unrelated activity is never captured. In addition, before any data is
              delivered, we redact sensitive content that is not part of the task, including
              passwords and credentials, payment and banking details, and personal messages.
            </p>

            <h2>6. Withdrawal and deletion</h2>
            <p>
              A participant can stop taking part at any time. On a verified request, we delete the
              participant&apos;s recorded data from our systems within 30 days and confirm that the
              deletion is complete. Where data has already been delivered to a client under
              contract, we notify the client of the withdrawal so that the same deletion can be
              applied downstream.
            </p>

            <h2>7. How data is handled and secured</h2>
            <ul>
              <li>Each client&apos;s dataset is stored separately from every other client&apos;s.</li>
              <li>Access is limited to named staff who need it for the engagement.</li>
              <li>
                Data collected for one client is not reused for another without explicit consent.
              </li>
              <li>Data is encrypted in transit and stored on access-controlled infrastructure.</li>
              <li>
                Delivery to a client happens through agreed, access-controlled channels, never
                through public links.
              </li>
            </ul>

            <h2>8. Use limits</h2>
            <p>
              Data collected under this policy is supplied only for the AI-training or evaluation
              purpose agreed in the relevant contract. We do not sell participant data to third
              parties, we do not use it to profile, monitor, or evaluate the participants who
              produced it, and we do not use it for advertising.
            </p>

            <h2>9. Legal basis</h2>
            <p>
              We collect data in accordance with the data-protection and privacy laws that apply in
              each jurisdiction where collection takes place, and we design each collection to meet
              the stricter of those requirements and our own principles above. Where a client
              engagement carries additional legal or contractual requirements, those are applied to
              that collection in full.
            </p>

            <h2>10. Governance and contact</h2>
            <p>
              This policy is owned by our Chief Executive Officer and is reviewed whenever we
              introduce a new collection type. Participants, clients, and anyone else with a
              question or concern about a collection can write to{" "}
              <a href="mailto:info@evelynlearning.com?subject=Responsible%20data%20collection">
                info@evelynlearning.com
              </a>
              . We respond to every request, and withdrawal and deletion requests are handled as
              described in section 6.
            </p>
            <p>
              Clients evaluating our data services can request a sample collection and our consent
              documentation through the same address.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
