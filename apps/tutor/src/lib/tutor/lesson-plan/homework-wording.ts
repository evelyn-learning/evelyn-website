/**
 * The few words a homework plan carries that a student or a partner's page may show: the plan's title and its
 * one objective. 2026-11-24 (a Taiwan worksheet): a sheet in Traditional Chinese came back titled "Homework
 * help", and each problem's session "Problem 4" / "Work problem 4". They follow the plan's `locale` (the
 * plan-generate request's own field), read through the lesson-language table; any other locale keeps the
 * English wording, word for word. The plan's instructions to the tutor stay in English (they are the model's).
 *
 * Pure. Client-safe.
 */
import { lessonLanguageOf } from '../voice/lesson-language';

export interface HomeworkWording {
  /** The whole-sheet plan's title, and its objective. */
  sheetTitle: string; sheetObjective: string;
  /** A one-problem plan's title, and its objective (short form, then a sentence). */
  problemTitle: (n: number) => string; problemObjective: (n: number) => string; problemObjectiveSentence: (n: number) => string;
}

const EN: HomeworkWording = {
  sheetTitle: 'Homework help', sheetObjective: 'Work the uploaded problems in order.',
  problemTitle: (n) => `Problem ${n}`, problemObjective: (n) => `Work problem ${n}`, problemObjectiveSentence: (n) => `Work problem ${n}.`,
};

const WORDING: Readonly<Record<string, HomeworkWording>> = {
  'zh-TW': {
    sheetTitle: '作業輔導', sheetObjective: '依照順序完成上傳的題目。',
    problemTitle: (n) => `第 ${n} 題`, problemObjective: (n) => `完成第 ${n} 題`, problemObjectiveSentence: (n) => `完成第 ${n} 題。`,
  },
  'zh-CN': {
    sheetTitle: '作业辅导', sheetObjective: '按顺序完成上传的题目。',
    problemTitle: (n) => `第 ${n} 题`, problemObjective: (n) => `完成第 ${n} 题`, problemObjectiveSentence: (n) => `完成第 ${n} 题。`,
  },
  ja: {
    sheetTitle: '宿題サポート', sheetObjective: 'アップロードした問題を順番に解きます。',
    problemTitle: (n) => `問題 ${n}`, problemObjective: (n) => `問題 ${n} を解く`, problemObjectiveSentence: (n) => `問題 ${n} を解きます。`,
  },
};

/** The wording for a plan's locale (`zh-TW`, `zh_tw`, `ja-JP`); English for none, for English and for a language with no row. */
export function homeworkWording(locale: string | null | undefined): HomeworkWording {
  return WORDING[lessonLanguageOf(locale)?.code ?? ''] ?? EN;
}
