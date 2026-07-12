/**
 * AP US History — CED Unit 4.2-4.4: The Age of Jefferson.
 *
 * Period-4 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale). Covers the "Revolution of 1800" as a peaceful transfer of
 * power between parties, Jefferson's limited-government creed and its
 * tension with his actual governing choices, the Marshall Court, the
 * Louisiana Purchase, the embargo, the War of 1812, the Era of Good
 * Feelings, the Monroe Doctrine, and the Missouri Compromise.
 *
 * Anchor text: Thomas Jefferson, First Inaugural Address (1801) —
 * evelyn.passage.apush-jefferson-inaugural.v1. Teaching point is
 * Jefferson's stated creed of union and frugal government, set against
 * the pragmatic expansion of federal power he himself carried out as
 * president (quoted only as the short excerpt already seeded).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_JEFFERSON_ERA: LessonPlan = {
  id: 'evelyn.ap.apush.jefferson-era.v1',
  title: 'U4.2 The Age of Jefferson',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.jefferson-era',
      description:
        "Explain the causes and effects of the 'Revolution of 1800,' Jefferson's actual governing record against his strict-constructionist creed (the Louisiana Purchase, the Marshall Court, the embargo), and the political and diplomatic developments of the War of 1812 through the Missouri Compromise.",
      standard: 'AP-APUSH-4.2',
    },
  ],
  prerequisites: ['apush.constitution-ratification', 'apush.new-republic'],
  followUps: ['apush.market-revolution'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the 1800 transfer of power feel genuinely uncertain, then set up the puzzle of a strict constructionist making the biggest land deal in presidential history.',
      script:
        "In 1800, Thomas Jefferson's Democratic-Republicans defeated John Adams's Federalists in a bitter, personal campaign — and then something almost unprecedented in the world happened: the losing party handed over power peacefully. No coup, no civil war, just an orderly transfer between two parties that genuinely despised each other. Jefferson called it a 'revolution' in the true sense of the word — a real change of direction, not just a change of faces. But here's the puzzle: Jefferson had spent the 1790s arguing that the federal government could ONLY use the specific powers the Constitution explicitly listed. Then, within his first term, he doubled the size of the country in a purchase the Constitution never mentioned at all. Today we're tracing what happens when a president's philosophy runs into the practical business of governing.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-jefferson-era',
      kind: 'concept',
      goal: "Explain the Revolution of 1800, the Marshall Court's early rulings, the Louisiana Purchase, the embargo, the War of 1812, and the Era of Good Feelings through the Monroe Doctrine and Missouri Compromise.",
      keyIdeas: [
        "THE \"REVOLUTION OF 1800\": Jefferson's election over incumbent John Adams marked the first peaceful transfer of power between rival political parties in the young republic. Jefferson's own inaugural address downplayed the bitterness of the campaign, insisting \"We are all Republicans, we are all Federalists\" — framing the transition as a return to shared union rather than a partisan conquest.",
        "JEFFERSON'S CREED VS. HIS PRACTICE: as a candidate, Jefferson championed STRICT CONSTRUCTION (the federal government may exercise only powers explicitly granted) and a \"frugal Government\" that mostly leaves people alone. In practice, Jefferson governed more pragmatically than his creed suggested — most dramatically in the Louisiana Purchase, where he set aside his own constitutional doubts because the strategic and commercial value of the territory outweighed them.",
        'THE MARSHALL COURT: Chief Justice John Marshall (appointed by Adams, serving 1801-1835) used a series of rulings to expand federal judicial power. Marbury v. Madison (1803) established JUDICIAL REVIEW — the Supreme Court\'s power to strike down acts of Congress it finds unconstitutional — ironically ruling against the Jefferson administration\'s own interest in the specific case while cementing the Court\'s long-term authority. McCulloch v. Maryland (1819) upheld the constitutionality of the national bank under loose construction and ruled states could not tax federal institutions, reinforcing federal supremacy over the states.',
        "THE LOUISIANA PURCHASE (1803): Jefferson bought the Louisiana Territory from France for roughly $15 million, doubling the size of the United States and securing control of the Mississippi River and the port of New Orleans. The purchase had NO explicit constitutional authorization for acquiring foreign territory — a direct contradiction of Jefferson's strict-constructionist principles, which he acknowledged privately but proceeded with anyway given the strategic opportunity.",
        "THE EMBARGO AND THE WAR OF 1812: Jefferson's Embargo Act (1807) tried to punish Britain and France for interfering with American shipping by halting nearly all American exports — it devastated the American economy far more than it hurt Europe and was deeply unpopular, especially in New England. Continued British impressment of American sailors and interference with trade eventually led to the War of 1812 (1812-1815) under Jefferson's successor Madison; the war ended in a strategic stalemate (Treaty of Ghent, 1814, restored prewar boundaries) but produced a surge of American nationalism.",
        "THE ERA OF GOOD FEELINGS AND THE MONROE DOCTRINE: the postwar collapse of the Federalist Party left Monroe's Democratic-Republicans dominant, and the label \"Era of Good Feelings\" (1817-1825) reflected this reduced overt partisan conflict. In his 1823 annual message, Monroe articulated the MONROE DOCTRINE: the Americas were closed to future European colonization, and any European attempt to interfere in the Western Hemisphere would be viewed as a threat to the United States — a bold assertion of hemispheric influence despite the young nation's still-limited military power to enforce it.",
        "THE MISSOURI COMPROMISE (1820): the \"good feelings\" masked a sharpening sectional divide. Missouri's request to enter the Union as a slave state threatened the balance between free and slave states in the Senate. Henry Clay's compromise admitted Missouri as a slave state and Maine as a free state (preserving the balance) and drew a line at 36°30' latitude across the remaining Louisiana Territory, prohibiting slavery north of it. Thomas Jefferson, by then retired, privately called the crisis \"a fire bell in the night\" — a warning of the deeper sectional conflict over slavery that the compromise only postponed.",
      ],
      vocabulary: [
        {
          term: 'strict construction',
          definition:
            "the interpretive view that the federal government may exercise only the powers explicitly granted by the Constitution; Jefferson's stated creed, though his own Louisiana Purchase departed from it in practice.",
        },
        {
          term: 'judicial review',
          definition:
            "the power, established by Marbury v. Madison (1803), of the Supreme Court to strike down acts of Congress or the executive that it finds unconstitutional.",
        },
        {
          term: 'Louisiana Purchase',
          definition:
            "Jefferson's 1803 purchase of the Louisiana Territory from France for roughly $15 million, doubling the size of the United States despite no explicit constitutional authorization for acquiring foreign territory.",
        },
        {
          term: 'Monroe Doctrine',
          definition:
            "the principle, announced by President Monroe in 1823, that the Americas were closed to future European colonization and that European interference in the Western Hemisphere would be considered a threat to the United States.",
        },
        {
          term: 'Missouri Compromise',
          definition:
            "the 1820 agreement admitting Missouri as a slave state and Maine as a free state, and prohibiting slavery north of 36°30' latitude in the remaining Louisiana Territory, to preserve the Senate's free/slave-state balance.",
        },
      ],
      passageId: 'evelyn.passage.apush-jefferson-inaugural.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-jefferson-inaugural',
      kind: 'worked_example',
      problem:
        "Analyze this excerpt from Jefferson's First Inaugural Address (March 4, 1801): \"We are all Republicans, we are all Federalists. If there be any among us who would wish to dissolve this Union or to change its republican form, let them stand undisturbed as monuments of the safety with which error of opinion may be tolerated where reason is left free to combat it.\" ... \"Still one thing more, fellow-citizens -- a wise and frugal Government, which shall restrain men from injuring one another, shall leave them otherwise free to regulate their own pursuits of industry and improvement, and shall not take from the mouth of labor the bread it has earned.\" What is Jefferson arguing, and how does his later presidency complicate it?",
      steps: [
        'SOURCE IT FIRST. Thomas Jefferson, March 4, 1801 — delivered just after one of the most bitter, personal presidential campaigns in the young republic\'s history, and the first time power passed from one party to a rival party.',
        'IDENTIFY THE FIRST CLAIM. "We are all Republicans, we are all Federalists" is a deliberate healing gesture: Jefferson tells a divided country that party labels matter less than shared national loyalty, and that even the losing side\'s "error of opinion" should be tolerated, not suppressed, because reason will correct it over time.',
        'IDENTIFY THE SECOND CLAIM. "a wise and frugal Government" states Jefferson\'s governing creed in miniature: government\'s job is mainly to stop people from harming one another, then get out of the way and leave individuals free to pursue their own labor and improvement — a limited, restrained vision of federal power.',
        "CONNECT TO STRICT CONSTRUCTION. This frugal-government creed is the rhetorical expression of the strict-constructionist philosophy Jefferson had championed against Hamilton in the 1790s: government should do little, and only what it is clearly authorized to do.",
        "COMPLICATE IT WITH THE RECORD. Within two years, Jefferson would purchase the Louisiana Territory — doubling the nation's size — with no explicit constitutional authorization for acquiring foreign land, setting aside his own stated doubts because the strategic opportunity (control of the Mississippi and New Orleans) was too valuable to pass up. The 'frugal Government' of the inaugural did not prevent Jefferson from expanding federal action dramatically when he judged it necessary.",
        'STATE THE LINK TO THE COURSE THESIS. The passage shows Jefferson stating an ideal of union and restrained government at the start of his presidency; his own record over the next eight years shows that ideal repeatedly bending to practical governance — a tension between creed and practice that runs through the whole Jeffersonian era, from the Louisiana Purchase to the Embargo Act.',
      ],
      answer:
        "In his First Inaugural, Jefferson makes two connected arguments: that partisan division should not override shared national loyalty (\"we are all Republicans, we are all Federalists\"), and that good government should be \"wise and frugal\" — restraining people from harming each other but otherwise leaving them free, a restrained vision consistent with his strict-constructionist philosophy. His actual presidency complicates this: the Louisiana Purchase (1803) doubled the nation's size with no explicit constitutional basis for acquiring foreign territory, a use of federal power Jefferson himself privately doubted was authorized but pursued anyway because of its strategic value. The inaugural states an ideal of restrained, unifying government; the record shows that ideal repeatedly yielding to pragmatic decisions once Jefferson held the office himself.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE way Jefferson's actual presidency departed from his strict-constructionist creed. (b) Briefly explain ONE specific consequence of the Louisiana Purchase or the Embargo Act. (c) Briefly explain ONE way the Marshall Court expanded federal power during this period.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine departure from Jefferson\'s stated strict-constructionist creed — most commonly the Louisiana Purchase (acquiring foreign territory with no explicit constitutional authorization) or the Embargo Act (an assertive use of federal economic power). No credit for a vague statement ("Jefferson was inconsistent") with no specific policy named.',
            modelResponse:
              "Jefferson purchased the Louisiana Territory from France in 1803, doubling the size of the United States, even though the Constitution nowhere explicitly authorizes the federal government to acquire foreign territory — a clear departure from the strict-constructionist principle he had championed as a candidate.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate consequence of the Louisiana Purchase (e.g. U.S. control of the Mississippi River and New Orleans, doubling of national territory) or the Embargo Act (e.g. severe damage to the American economy, especially in New England, while barely affecting Britain or France). No credit for a vague or unsupported consequence.",
            modelResponse:
              "The Embargo Act of 1807, intended to punish Britain and France by halting American exports, instead devastated the American economy — especially New England's shipping industry — far more than it hurt either European power, making it deeply unpopular and eventually leading to its repeal.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the Marshall Court expanded federal power — e.g. Marbury v. Madison (1803) establishing judicial review, or McCulloch v. Maryland (1819) upholding the national bank and federal supremacy over state taxation. No credit for a vague or unsupported claim.',
            modelResponse:
              "In Marbury v. Madison (1803), Chief Justice John Marshall's Court established the principle of judicial review — the Supreme Court's power to strike down acts of Congress it finds unconstitutional — dramatically expanding the judiciary's role as a check on the other branches.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-strict-constructionist-jefferson',
      kind: 'misconception_check',
      question:
        "True or false: Jefferson governed as a strict constructionist throughout his presidency, consistently limiting federal power to only what the Constitution explicitly authorized.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming a politician's stated philosophy as a candidate predicts every decision they make in office, rather than checking the actual governing record against the stated creed.",
          correctsTo:
            "FALSE. Jefferson campaigned on strict construction and a 'frugal Government,' but his actual presidency repeatedly departed from that creed when practical circumstances demanded it. The clearest example is the Louisiana Purchase (1803): the Constitution contains no explicit provision authorizing the federal government to acquire foreign territory, and Jefferson privately acknowledged the constitutional problem — but proceeded anyway because doubling the nation's size and securing the Mississippi and New Orleans was too strategically valuable to forgo. The Embargo Act (1807) likewise used sweeping federal power over trade. AP US History rewards checking a leader's actual record against their stated principles, not assuming consistency.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The \"Revolution of 1800\" was the first peaceful transfer of power between rival parties — Jefferson's inaugural framed it as a return to union, not a partisan conquest.",
        "Jefferson's strict-constructionist creed did not survive contact with the presidency: the Louisiana Purchase (1803) had no explicit constitutional basis, and the Embargo Act (1807) used sweeping federal power over trade.",
        "The Marshall Court expanded federal judicial power: Marbury v. Madison (1803) established judicial review; McCulloch v. Maryland (1819) upheld the bank and federal supremacy over states.",
        "The War of 1812 ended in stalemate (Treaty of Ghent, 1814) but produced a surge of nationalism, feeding the Era of Good Feelings and Monroe's 1823 hemispheric-influence doctrine.",
        "The Missouri Compromise (1820) preserved the free/slave-state Senate balance and drew the 36°30' line — a postponement of sectional conflict Jefferson himself called \"a fire bell in the night.\"",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.2-4.4',
    cedTitle: 'The Age of Jefferson',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-jefferson-inaugural.v1',
        chapter: '1801',
        note: "Jefferson's First Inaugural Address — the union-and-frugal-government creed set against his later governing record.",
      },
    ],
  },
};
