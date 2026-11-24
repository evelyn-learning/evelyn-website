/**
 * EdConsult Solutions (ECS) — AI-literacy demo for educators: Chapter 2 of Kathi Kersznowski's "The Educator's
 * Guidebook for Teaching AI Literacy and Ethics" (2025), "AI as a Helper – But You're Still the Author".
 *
 * Licensed material: the author's release is held by ECS (James Salvo, 2026-11-14). Scenario text, discussion
 * questions, talking points and the three reflection questions are the book's own words (printed pp. 38–48), kept as
 * written; the short spoken versions are ours, to be replaced by ECS's own condensed wording when it arrives. The flow, the
 * participant's role and the takeaway follow ECS's "Human in the Loop" handoff (2026-11-14).
 *
 * The welcome, the lead-in to the cases, the board points and the closing words answer ECS's review of three
 * sessions (2026-11-17). Their wording here is OURS, a stand-in: ECS writes the welcome (60–90 words spoken, 120 at
 * most) and agrees the lead-in and closing with us before it is shown to anyone else.
 *
 * A private plan: reachable by id only (store.ts PRIVATE_PLANS), never listed in any catalogue or picker.
 */
import type { LessonPlan } from '../types';
import type { DiscussionMeta } from '../../v2/discussion';

const discussion: DiscussionMeta = {
  kind: 'discussion',
  participant: 'a K–12 educator taking part as an adult learner, exploring their own thinking about AI and student writing. They are not rehearsing a class discussion, and you are not playing students',
  orientation: 'Writing with AI is uncharted territory for students and for educators. AI can be a powerful helper for brainstorming, organising, fixing grammar and polishing drafts, and it also raises real questions about who owns the work, what counts as authentic writing, and how to stay honest. The conversation uses two contrasting cases to explore where AI supports a student\'s thinking and where it may replace the intellectual work that is the learning, so the educator can put their own view into words.',
  cases: [
    {
      id: 'revision-assistant',
      title: 'The Revision Assistant',
      focus: 'AI feedback and editing support',
      spoken: 'Kelly finishes a story and asks an AI chatbot how to make it better. It suggests stronger verbs and smoother links between ideas, and she picks the suggestions that fit, drops the ones that don\'t, and keeps her own voice.',
      glance: ['Kelly wrote her story herself, then asked AI for advice', 'AI suggested stronger verbs and smoother links', 'She chose which suggestions to keep, in her own voice'],
      scenario: 'Kelly finishes writing her story for class but wants to make it even better. She copies her story and asks an AI chatbot to give her advice on how to improve it. The AI suggests using stronger action words like "ran" instead of "went" and adding words that help the story flow more smoothly between ideas. Kelly reads the suggestions carefully and decides which ones make her story clearer and which ones don\'t fit her style. She changes some parts but keeps her own voice in the story.',
      questions: ['Did Kelly still write her story?', 'How is this different from letting AI write for her?', 'Why is it important to review and choose what changes to make?', 'What kinds of AI suggestions are most helpful for improving writing?'],
      talkingPoints: ['AI can serve as a valuable revision tool when students maintain control over decisions', 'The key is selective implementation of suggestions rather than automatic acceptance', 'Students learn more when they evaluate AI feedback critically', 'This approach helps students develop their own editing and revision skills'],
    },
    {
      id: 'misleading-rewrite',
      title: 'The Misleading Rewrite',
      focus: 'When AI overwrites student voice',
      spoken: 'Diego isn\'t happy with his rough draft, so he asks an AI to "make it better" and it rewrites the whole story. It no longer sounds like him, and his teacher wonders whether he really wrote it.',
      glance: ['Diego asked AI to "make it better"', 'AI rewrote his whole story', 'It no longer sounds like him, and his teacher wonders who wrote it'],
      scenario: 'Diego writes a rough draft for his story, but he\'s not very happy with it. He decides to ask an AI chatbot to "make it better" by rewriting the whole story. The AI changes a lot of words and sentences, making the story sound very different from Diego\'s usual way of writing. When Diego reads it, he feels like it doesn\'t sound like his own story anymore. His teacher reads the new draft and wonders if Diego really wrote it himself or if someone else did the work.',
      questions: ['What do we lose when we let AI take over our voice?', 'How do you know if a piece of writing is still "yours"?', 'What could Diego have done instead?', 'Why is maintaining your writing voice important?'],
      talkingPoints: ['Student voice is a crucial component of authentic writing', 'Extensive AI rewriting can mask a student\'s actual writing ability', 'Teachers can often detect when writing doesn\'t match a student\'s typical voice and style', 'Learning to improve one\'s own voice is more valuable than adopting AI\'s voice'],
    },
    {
      id: 'revision-assistant-deeper',
      title: 'The Revision Assistant (older students)',
      focus: 'When AI assistance becomes AI dependency',
      spoken: 'An older Kelly writes a history research paper with AI at every step: topics, outline, transitions, sources and feedback on her draft. The words are hers, but nearly every decision along the way was shaped by the AI.',
      glance: ['An older Kelly, writing a history research paper', 'AI at every step: topic, outline, sources, feedback', 'Her own words, but AI shaped nearly every decision'],
      scenario: 'Kelly is working on a research paper for her history class. She uses an AI tool at every step — first to brainstorm possible topics, then to create a detailed outline. As she writes, the AI suggests smoother transitions between paragraphs and recommends credible sources to include. After completing a draft, Kelly asks the AI for in-depth feedback and revises her paper accordingly. Although the final paper is written in her own words, nearly every part of her process has been shaped and guided by AI suggestions.',
      questions: ['When you submit a college essay, should you mention if you used AI feedback?', 'At what point does AI assistance become AI dependency?', 'How can students maintain ownership during extensive AI-guided revision?'],
      talkingPoints: ['Extensive AI guidance can prevent students from developing independent research and writing skills', 'College-level writing requires students to demonstrate their own analytical and organizational abilities', 'Heavy AI assistance may require disclosure in academic settings', 'Students should be able to replicate their writing process without AI support'],
    },
    {
      id: 'misleading-rewrite-deeper',
      title: 'The Misleading Rewrite (older students)',
      focus: 'Writing that no longer matches the student',
      spoken: 'Over a semester, an older Diego hands in essays far stronger than anything he shows in class discussion or other work. His teacher notices the gap and wonders how much of the work is really his.',
      glance: ['An older Diego, over a semester of essays', 'Far stronger than his class work and discussion', 'His teacher wonders how much of it is his'],
      scenario: 'Over the course of the semester, Diego submits several essays for his English class. Each essay shows big improvements in writing style, vocabulary, and ideas… much more advanced than what Diego usually demonstrates in class discussions and on other assignments. His teacher notices that the essays don\'t seem to match Diego\'s known writing skills. The sudden leap in quality raises questions about whether Diego wrote the essays himself or relied heavily on AI tools without fully understanding or contributing to the work.',
      questions: ['What might explain the big improvements in Diego\'s essays compared to his class participation?', 'How can relying too much on AI tools affect a student\'s learning and growth?', 'What should a teacher do if they suspect a student is not doing their own work?'],
      talkingPoints: ['Sudden, dramatic improvements in student work may indicate overreliance on AI or other outside help', 'Writing is a skill developed through practice; shortcuts can limit real learning and confidence', 'Honest work helps teachers provide the right support and helps students build authentic abilities', 'Teachers should create a supportive environment where students feel comfortable discussing their struggles'],
    },
  ],
  considerations: [
    'A school or district rule against AI revision tools gives some families and teachers clarity and reassurance, while others feel students are being denied the chance to learn to use AI well.',
    '[against] A student who leans on AI at every step can hand in polished work they cannot reproduce on their own, in an in-class essay or a timed exam.',
    'Heavy AI help may need to be disclosed in some settings, such as a college application essay, and students may not know where that line is.',
    'A teacher who raises a suspicion of AI use with a student who genuinely improved can damage trust; the student may stop sharing drafts or struggles.',
    'Students whose writing is flagged as "not sounding like them" may simply be growing, or getting help at home that other students do not have.',
    'Colleagues on the same team may set different expectations for AI use, so students meet different rules from one class to the next.',
    '[for] For a student who finds writing hard, AI feedback can be the support that lets them keep going; taking it away may hit those students hardest.',
    '[against] If AI suggestions are accepted without being weighed, the student skips the decisions about their own writing that build the skill.',
    '[against] A teacher who cannot see how a piece was produced cannot tell what the student can do alone, and so cannot grade it fairly or plan the next step from it.',
    'Teachers are often left to decide about AI on their own, without guidance, training or time from the school, and each new expectation lands as more work.',
    '[against] Writing done by hand in class shows a teacher where the ideas came from in a way a typed final draft cannot.',
    '[for] Students may already be using AI at home whether or not their teacher allows it in class, so a teacher may be dealing with it either way.',
  ],
  commonReactions: [
    'A quick split: Kelly is fine, Diego is cheating, and the matter is settled.',
    'It depends on what the assignment is for.',
    'Worry about detection and policing, or about being unable to tell.',
    'We can\'t stop it, so we have to teach it.',
    'Uncertainty about their own knowledge of AI tools, or discomfort at having to judge them.',
    'Concern for students who struggle with writing, or with language.',
    'Firm opposition: a student using AI is not writing, and work on paper is the only work they trust.',
    'No time, no training and no guidance: one more thing landing on teachers.',
  ],
  nextDirections: [
    'classroom expectations for student AI use',
    'what this means for their grade level or subject',
    'a conversation with parents or administrators',
    'the instructional benefits and limits of AI feedback',
    'more time to think it over; "not sure yet" is a fine answer',
  ],
  reflectionQuestions: ['Does this still sound like me?', 'Am I growing as a writer here?', 'Am I being honest about how I got to this final draft?'],
  reflectionQuestionsFrom: 'from the chapter introduction: the questions the author wants students to learn to ask themselves',
  // The opening follows the partner's standard introduction (Ed_Consult_Solutions_Voice_Tutor_Introduction.pdf,
  // 2026-11-21, still a draft on his side): its device advice and "tap the button" are on the start card, which is
  // read before the tap; the rest is spoken. "Graded" is gone (it read as written for students), the session is
  // framed as a rehearsal, and the person is asked how they would like to be addressed (his review notes on
  // embed-1795280313652).
  // ⚠ "Nothing … is recorded or kept" is said at Praveen's direction for the test phase (2026-11-24). It is NOT
  // true of the engine yet: sessions are stored. The no-retention mode must ship before this plan goes to anyone
  // outside the review group.
  welcome: 'Hello, and thank you for choosing an Ed Consult Solutions voice tutor, powered by Evelyn Learning. I\'m {tutor}. This conversation is for trying ideas out loud, finding your voice, and rehearsing your thinking, not about landing on the right answer. It is strictly a rehearsal: nothing from this conversation is recorded or kept. Over about ten minutes we\'ll talk through two short classroom cases about students writing with AI, and you can stop me or ask me to repeat anything at any time.',
  addressQuestion: 'Before we begin, how would you like to be addressed during this conversation?',
  firstQuestion: 'When you hear about students writing with AI, what\'s your first reaction?',
  subject: { name: 'where AI fits in students\' writing and in their own classroom', words: ['AI', 'artificial intelligence', 'chatbot', 'chatbots', 'ChatGPT', 'tool', 'tools'] },
  reflectQuestion: 'Thinking about where AI fits in your own classroom, what do you think now, and has anything shifted?',
  // Ours, drafted from his note 3; his to reword.
  heldViewClose: 'Wherever AI ends up fitting in your classroom, your students will meet it once they leave you, in their next grade or on a college campus. That makes this a conversation worth coming back to from time to time, with what is best for your students in mind.',
  startCard: {
    title: 'Ed Consult Solutions Voice Tutor',
    lines: [
      'Thank you for choosing an Ed Consult Solutions voice tutor, powered by Evelyn Learning.',
      'This conversation is for trying ideas out loud, finding your voice, and rehearsing your thinking, not about landing on the right answer.',
      'For the best experience, use a desktop or laptop so you can follow the visuals on your screen. A phone works too, though some content is easier to see on a larger screen.',
      'Headphones or a quiet room help. You can interrupt at any time, or say "say that again".',
      'When you\'re ready, tap the button to get started.',
    ],
  },
  welcomeBoard: ['Ed Consult Solutions Voice Tutor, powered by Evelyn Learning', 'AI as a Helper – But You\'re Still the Author', 'About 10 minutes · two short cases · a rehearsal, not a test', 'Stop me or say "say that again" at any time'],
  casesLeadIn: 'I\'m going to tell you about two students who each used AI on a piece of writing, in two different ways. After each one I\'ll ask what you make of it.',
  stageStarts: { explore: 'case_told', complicate: 'cases_told', reflect: 'reflect_asked', 'next-direction': 'direction_asked' },
  closing: 'That\'s the end of this demo conversation. You can close this window now, or start again from the same link whenever you like.',
};

export const PRIVATE_ECS_AI_LITERACY_CH2: LessonPlan = {
  id: 'ecs.ai-literacy.ch2-still-the-author.v1',
  title: 'AI as a Helper – But You\'re Still the Author',
  curriculum: 'ECS',
  grade: 'educators',
  subject: 'AI literacy',
  topic: 'AI and student writing',
  locale: 'en',
  los: [
    { id: 'ecs.ai-lit.ch2.lo-1', description: 'Greater clarity about their own thinking on where AI supports a student\'s writing and where it replaces the learning' },
    { id: 'ecs.ai-lit.ch2.lo-2', description: 'At least one perspective or consequence they had not considered' },
    { id: 'ecs.ai-lit.ch2.lo-3', description: 'A next direction of their own choosing (which need not be a classroom rule)' },
  ],
  estimatedMinutes: 12,
  segments: [
    { id: 'orient', kind: 'concept', estimatedMinutes: 1, goal: 'Orient and invite: introduce the topic and invite their first reaction.', keyIdeas: ['Writing with AI is uncharted territory for students and for educators.', 'There are no right answers; the point is their own thinking.'] },
    { id: 'explore', kind: 'concept', estimatedMinutes: 3, goal: 'Explore contrasting cases: put one or two cases to them (start with the Revision Assistant and the Misleading Rewrite) and surface what they think about where AI supports thinking and where it replaces it.', keyIdeas: ['Ask what they make of a case before saying what anyone else makes of it.', 'The older-student versions are for going deeper when they have already worked through the first two.'] },
    { id: 'complicate', kind: 'concept', estimatedMinutes: 4, goal: 'Probe and complicate: once they take a position, bring in one realistic consequence or another person\'s view they have not raised, and ask how they would respond to it.', keyIdeas: ['Consequences, not disagreement.', 'Skip it, or go deeper, when they have already weighed the trade-offs.'] },
    { id: 'reflect', kind: 'concept', estimatedMinutes: 2, goal: 'Reflect: ask what they are thinking now and whether anything has shifted.', keyIdeas: ['Name a shift plainly if there was one; "not sure yet" is fine.'] },
    { id: 'next-direction', kind: 'concept', estimatedMinutes: 2, goal: 'Choose a next direction: ask what would be most valuable for them to explore further, then close.', keyIdeas: ['Their choice; it need not be a classroom rule.'] },
  ],
  source: { author: 'Kathi Kersznowski, The Educator\'s Guidebook for Teaching AI Literacy and Ethics (2025), chapter 2', org: 'EdConsult Solutions', license: 'used with the author\'s written release, held by EdConsult Solutions' },
  schemaVersion: 1,
  metadata: discussion as unknown as Record<string, unknown>,
};

/** Private plans, by id. */
export const PRIVATE_PLANS: LessonPlan[] = [PRIVATE_ECS_AI_LITERACY_CH2];
