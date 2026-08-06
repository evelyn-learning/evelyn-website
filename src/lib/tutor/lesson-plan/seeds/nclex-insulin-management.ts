/**
 * NCLEX-RN — Diabetes & Insulin Management: Timing, and DKA vs HHS.
 *
 * Clinical reasoning around insulin pharmacokinetics (onset/peak/duration)
 * and the two major hyperglycemic emergencies. The through-line: insulin
 * safety is a TIMING problem — hypoglycemia risk tracks the peak-action
 * window, not just the dose.
 *
 * Source: standard nursing pharmacology references (e.g. ATI, Lippincott
 * Pharmacology, Lewis Medical-Surgical Nursing) — approximate/conservative
 * ranges used throughout; no fabricated stats.
 */

import type { LessonPlan } from '../types';

export const SEED_NCLEX_INSULIN_MANAGEMENT: LessonPlan = {
  id: 'evelyn.testprep.nclex.insulin-management.v1',
  title: 'Diabetes & Insulin Management: Timing, and DKA vs HHS',
  curriculum: 'NCSBN',
  grade: 'nursing',
  subject: 'test-prep',
  topic: 'nclex-rn',
  locale: 'en',
  los: [
    {
      id: 'nclex.insulin-timing-dka-hhs',
      description: 'Compare the onset, peak, and duration of the major insulin types; identify the hypoglycemia risk window from that profile; and distinguish DKA from HHS by onset speed, glucose level, ketosis/acidosis, and typical patient.',
      standard: 'NCLEX-RN',
    },
  ],
  prerequisites: ['nclex.endocrine-assessment'],
  followUps: ['nclex.diabetes-patient-education', 'nclex.fluid-electrolyte-balance'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Ground the lesson in a concrete near-miss scenario the learner must explain using timing, not just "insulin lowers blood sugar."',
      script: 'A patient receives rapid-acting insulin right before lunch. Lunch gets delayed — a family emergency, a procedure, whatever — and the tray never comes. Two hours later you find the patient diaphoretic, shaky, and confused. What happened, and could you have predicted exactly WHEN this would happen just from knowing which insulin was given?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-insulin-timing',
      kind: 'concept',
      goal: 'Build the onset/peak/duration profile for each insulin category and have the learner place each on a shared timeline before confirming.',
      keyIdeas: [
        'RAPID-ACTING (lispro, aspart, glulisine): onset ~10-15 min, peak ~1-2 hr, duration ~3-5 hr. Given WITH meals — timed so the peak lines up with the glucose rise from eating.',
        'SHORT-ACTING / REGULAR insulin: onset ~30 min-1 hr, peak ~2-4 hr, duration ~5-8 hr. Given roughly 30 minutes before a meal (slower onset than rapid-acting, so it needs the head start).',
        'INTERMEDIATE-ACTING (NPH): onset ~1-2 hr, peak ~4-12 hr (broad, variable peak — a real clinical risk factor since the peak is harder to predict), duration ~12-18 hr. Often dosed twice daily.',
        'LONG-ACTING (glargine, detemir): onset ~1-2 hr, ESSENTIALLY NO PRONOUNCED PEAK (relatively flat, steady release), duration ~20-24 hr. Designed to cover baseline/basal insulin needs, not meals.',
        'PATTERN to place on the timeline: the shorter and faster the onset, the sharper and earlier the peak, and the shorter the total duration — rapid-acting is a sharp early spike, long-acting is a long flat line, NPH and regular sit in between.',
        'CLINICAL RULE embedded in the naming: rapid- and short-acting insulins are "mealtime/bolus" insulins (matched to food); intermediate- and long-acting are "basal" insulins (background coverage, independent of meals).',
      ],
      vocabulary: [
        { term: 'onset', definition: 'how soon after administration the insulin begins lowering blood glucose.' },
        { term: 'peak', definition: 'the time of maximum insulin effect — and therefore the time of greatest hypoglycemia risk.' },
        { term: 'basal insulin', definition: 'long-acting insulin providing steady background coverage between meals and overnight, without a pronounced peak.' },
      ],
      suggestedTools: ['show_table'],
      prescribedRender: {
        tool: 'show_table',
        params: {
          headers: ['Insulin Type', 'Onset', 'Peak', 'Duration'],
          rows: [
            ['Rapid-acting (lispro, aspart, glulisine)', '10-15 min', '1-2 hr', '3-5 hr'],
            ['Short-acting (Regular)', '30 min-1 hr', '2-4 hr', '5-8 hr'],
            ['Intermediate-acting (NPH)', '1-2 hr', '4-12 hr (broad, variable)', '12-18 hr'],
            ['Long-acting (glargine, detemir)', '1-2 hr', 'no pronounced peak', '20-24 hr'],
          ],
        },
      },
      estimatedMinutes: 3,
    },
    {
      id: 'concept-hook-resolution',
      kind: 'concept',
      goal: 'Return to the hook and connect the peak-action window directly to nursing actions around meal timing and hypoglycemia management.',
      keyIdeas: [
        'RESOLVING THE HOOK: rapid-acting insulin peaks at roughly 1-2 hours. The patient found diaphoretic and confused TWO HOURS after a missed meal is squarely inside that peak window — insulin was still driving glucose down with no food to counteract it. This is textbook hypoglycemia timed exactly to the drug\'s pharmacokinetics.',
        'NURSING ACTIONS around timing: verify the meal tray is actually present/being eaten BEFORE giving a rapid- or short-acting (mealtime) insulin — never give it and walk away assuming the meal will follow. If a meal will be delayed or skipped, HOLD the mealtime dose and notify the provider rather than giving it on schedule.',
        'MONITORING: check blood glucose at the times that matter — before meals, and around each insulin\'s expected peak, especially for insulins with a broad/unpredictable peak like NPH.',
        'TREATING HYPOGLYCEMIA (glucose typically <70 mg/dL, though nursing action thresholds may be facility-specific): if the patient is ALERT and can swallow, give 15-20 g of fast-acting oral carbohydrate (e.g., glucose tablets, juice), recheck glucose in 15 minutes, repeat if still low ("rule of 15"). If the patient is UNCONSCIOUS or unable to swallow safely, do NOT give anything by mouth — give IV dextrose (e.g., D50) or IM/subcutaneous glucagon per protocol.',
        'HOLD PARAMETERS: many facilities hold a scheduled insulin dose and notify the provider if the pre-dose glucose is below a set threshold (commonly around 70 mg/dL) — always confirm current glucose before administering, not just the scheduled time.',
      ],
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 2.5,
    },
    {
      id: 'concept-dka-vs-hhs',
      kind: 'concept',
      goal: 'Contrast DKA and HHS across onset speed, glucose range, ketosis/acidosis, typical patient, and mental status.',
      keyIdeas: [
        'ONSET SPEED: DKA develops rapidly — often over hours. HHS develops slowly — typically over days, which is part of why it\'s often more severe by the time it\'s caught (more time for profound dehydration to build).',
        'GLUCOSE RANGE: DKA is usually >250 mg/dL (often in the 250-800 range). HHS is markedly higher, typically >600 mg/dL and sometimes much higher — extreme hyperglycemia is the hallmark.',
        'KETONES / ACIDOSIS: DKA has significant ketone production and metabolic acidosis (low pH, low bicarbonate, Kussmaul respirations, fruity/acetone breath) because the body has essentially NO insulin and switches to fat breakdown for fuel. HHS has minimal-to-no ketosis and no significant acidosis, because enough residual insulin is present to prevent significant fat breakdown — it just isn\'t enough to control glucose.',
        'TYPICAL PATIENT: DKA classically occurs in TYPE 1 diabetes (absolute insulin deficiency), though it can occur in type 2 under severe physiologic stress. HHS classically occurs in TYPE 2 diabetes, often older adults, frequently precipitated by infection, dehydration, or a missed diagnosis.',
        'MENTAL STATUS: both can impair mental status, but HHS tends to produce MORE profound neurologic changes (confusion progressing to coma) because of the extreme glucose level and resulting serum osmolality/dehydration; DKA\'s presentation is dominated more by the acidosis (Kussmaul breathing, GI symptoms) alongside variable mental status.',
        'SHARED MANAGEMENT PRIORITIES: both are treated with IV fluids first (correct dehydration), then IV insulin, with careful potassium monitoring — insulin drives potassium INTO cells, so a patient can look normokalemic or even hyperkalemic at presentation and then drop dangerously low once insulin therapy starts.',
      ],
      suggestedTools: ['comparison_table'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-iv-insulin',
      kind: 'misconception_check',
      question: 'A student assumes any insulin can be given IV in an emergency as long as the dose is adjusted. Is that accurate?',
      commonErrors: [
        {
          answer: 'Yes, any insulin type can be given IV if needed.',
          misconception: 'Assuming route flexibility is the same across all insulin types.',
          correctsTo: 'No — ONLY REGULAR (short-acting) insulin is approved for IV administration, which is exactly why it\'s the insulin used in DKA/HHS IV drips and sliding-scale IV protocols. Rapid-acting, NPH, and long-acting insulins are given subcutaneously only. NPH in particular must NEVER be given IV — its cloudy, suspension-based formulation (versus regular insulin\'s clear solution) is part of what makes it unsafe for IV use and part of why nursing texts drill "clear before cloudy" when drawing up mixed doses.',
        },
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'misconception-long-acting-peak',
      kind: 'misconception_check',
      question: 'A student reasons that because long-acting insulin (glargine) "covers 24 hours," it must have one big peak in the middle of that window, similar to NPH but longer. True or false?',
      commonErrors: [
        {
          answer: 'True, glargine has a pronounced mid-cycle peak.',
          misconception: 'Assuming longer duration implies a proportionally larger, more pronounced peak, by analogy to NPH.',
          correctsTo: 'False. Long-acting insulins like glargine and detemir are specifically designed to release relatively steadily with NO PRONOUNCED PEAK — that flat profile is the whole point, since basal insulin is meant to provide constant background coverage without a hypoglycemia-risk window like mealtime insulins have. NPH is the outlier here BECAUSE it does have a broad, less predictable peak (~4-12 hr), which is precisely why NPH carries more hypoglycemia risk than long-acting basal insulins and why patients on NPH need more deliberately timed monitoring.',
        },
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Rapid-acting: onset ~10-15 min, peak ~1-2 hr, duration ~3-5 hr — given with meals.',
        'Regular (short-acting): onset ~30 min-1 hr, peak ~2-4 hr, duration ~5-8 hr.',
        'NPH (intermediate): onset ~1-2 hr, broad peak ~4-12 hr, duration ~12-18 hr.',
        'Long-acting (glargine/detemir): onset ~1-2 hr, no pronounced peak, duration ~20-24 hr.',
        'Hypoglycemia risk tracks the PEAK window — verify meals before mealtime insulin, hold and notify if a meal is delayed.',
        'DKA: fast onset, glucose >250, ketosis/acidosis present, classically type 1. HHS: slow onset, glucose >600+, minimal ketosis/acidosis, classically type 2, more profound mental status changes.',
      ],
      estimatedMinutes: 0.3,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Once IV insulin therapy starts for DKA or HHS, serum potassium often drops even if it started high or normal. Given what insulin does at the cellular level, why does that happen — and what does it mean for nursing monitoring during treatment?',
      hint: 'Insulin activates the Na+/K+-ATPase pump, driving potassium from the blood INTO cells alongside glucose — it doesn\'t remove potassium from the body, it just relocates it. That means serial potassium checks (and potassium replacement in the IV fluids once levels start dropping) are essential throughout DKA/HHS treatment, not just at admission.',
      estimatedMinutes: 0.2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
