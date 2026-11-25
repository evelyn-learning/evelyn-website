/**
 * The wording of the session's own chrome (buttons, chips, hints, placeholders) per lesson language.
 *
 * The tutor already speaks and writes the board in the language a lesson is TAUGHT IN (voice/lesson-language.ts);
 * this is everything around it that the student reads. An English lesson, with or without a second language for
 * help, gets EN: today's strings, verbatim.
 *
 * A new language: add a dictionary here and its row's code to BY_CODE. A row without one falls back to EN.
 * A language whose board and labels are in another (Hinglish: spoken in the mix, read in English; the row's
 * `boardIn`) takes that language's dictionary.
 *
 * Pure. No env, no I/O, no React, client-safe.
 */
import { boardLanguage, taughtIn } from '../voice/lesson-language';

/** A quick-answer chip: what it shows and what it sends. The text goes to the tutor as the student's answer,
 *  so it is in the lesson's language. */
export interface QuickAnswer { label: string; text: string }

export interface SessionStrings {
  // ── composer (v2): status chip + the hint in the box ──
  chipListening: string; hintListening: string;
  chipHearing: string; hintHearing: string;
  chipProcessing: string; hintProcessing: string;
  chipThinking: string; hintThinking: string;
  chipSpeaking: string; hintSpeaking: string;
  chipError: string; hintError: string;
  chipIdle: string; hintIdle: string;
  chipMicOff: string; hintMicOff: string;
  micTurnOn: string; micTurnOff: string;
  sessionEnded: string;
  micOffWhileSpeaking: string;
  micChanged: string;
  micNoSound: string;
  roomVoicesSpeaking: string;
  roomVoicesListening: string;
  send: string;
  typeAnswerPlaceholder: string;
  typeIfCantSpeak: string;

  // ── stage ──
  /** The presence line under the orb, by voice state. */
  voiceState: Record<'speaking' | 'listening' | 'hearing' | 'processing' | 'thinking' | 'muted' | 'manual-held' | 'idle' | 'error', string>;
  voiceTutor: string;
  startLesson: string;
  tapToStart: string;
  /** Followed by the lesson's title. */
  todaysLesson: string;
  tapMicToStart: string;
  justTalk: string;
  startingLine: string;
  whatToWorkOn: string;
  typeQuestionToStart: string;
  teachAsWeGo: string;
  firstProblemReady: string;
  tutorJoining: string;
  hangTight: string;
  didntCatch: string;
  prevBoard: string; jumpToBoard: string; nextBoard: string; newContent: string;
  boardN: (n: number) => string;
  showTutorQuestion: string;
  transcript: string;
  textSession: string;
  draw: string; drawOnBoard: string; textNote: string; uploadProblem: string;
  fullScreen: string; exitFullScreen: string; expand: string; exitExpanded: string;
  tools: string; toolsPenActive: string; closeTools: string;
  drawYourWork: string; pen: string; eraser: string; clear: string; sendToTutor: string;
  writeNote: string; notePlaceholder: string;
  lessonNameAria: (title: string) => string;
  showFullLessonName: string;
  /** Header subtitle parts. A plan's grade is a number or a word ('general'); only a number takes the grade word. */
  gradeN: (grade: string | number) => string;
  openPractice: string; freePractice: string;

  // ── session shell ──
  continueLesson: string; pickUpWhereLeftOff: string;
  questionPinTitle: string; dismissQuestionPin: string;
  tutorVoiceOn: string; muteTutorVoice: string; tutorVoiceOffTitle: string;
  paceSlow: string; paceFast: string; paceNormal: string;
  tapToAdjust: (label: string) => string;
  adjustLesson: string; harder: string; easier: string; slowDown: string; speedUp: string;
  wrapUp: string; finishLesson: string; discardSession: string;
  finishedProblem: string; finishedConcept: string;
  mic: string; micAuto: string; micManual: string;
  humor: string; humorDefault: string; humorSerious: string; humorLight: string; humorMedium: string; humorHeavy: string;
  voice: string; speakSlower: string;
  practiceProgress: string; practice: string; problems: string;
  solvedN: (n: number) => string; shownN: (n: number) => string;

  // ── transcript ──
  conversationHere: string; startSpeaking: string; typeToBegin: string;
  stillThinking: string; takingAMoment: string;
  quickYes: QuickAnswer; quickNo: QuickAnswer; quickNotSure: QuickAnswer; quickTrue: QuickAnswer; quickFalse: QuickAnswer;

  // ── end control, clock, header controls ──
  endTapAgain: string; endOrPauseTitle: string; endOrPauseAria: string;
  endShort: string; endSession: string; endPause: string;
  finishTapAgain: string; finishShort: string; finish: string;
  timeLeftTitle: string; timeInSessionTitle: string;
  timeLeftAria: (clock: string) => string; timeElapsedAria: (clock: string) => string;
  minLeft: (n: number) => string;
  overtime: string;
  exportPdfTitle: string; exportPdf: string; exporting: string;

  // ── board ──
  problem: string; given: string; gridIn: string;
  /** The homework problem beside the board (ProblemPanel): its heading, and the note under a problem with no checked answer. */
  problemN: (n: number) => string; noAnswerCheck: string;
  /** English keeps the lower-case word (the chip's CSS upper-cases it). */
  difficulty: Record<'easy' | 'medium' | 'hard', string>;
  pageOf: (i: number, n: number) => string;
  pageN: (n: number) => string;
  pageTitled: (n: number, title: string) => string;
  prevPage: string; nextPage: string; clearWhiteboard: string;
  boardPages: string;
  offPlan: string; todaysAgenda: string; showFullAgenda: string;

  // ── embed: before and after the session ──
  tapToHearTutor: string;
  linkExpired: string;
  sessionComplete: string;
  sessionStats: (messages: number, visuals: number) => string;
  savingLesson: string;
}

export const EN: SessionStrings = {
  chipListening: 'Listening', hintListening: 'Speak, or type here',
  chipHearing: 'Hearing you', hintHearing: 'Keep going…',
  chipProcessing: 'Got it', hintProcessing: 'One moment…',
  chipThinking: 'Thinking', hintThinking: 'Working on a reply…',
  chipSpeaking: 'Speaking', hintSpeaking: 'Talk or type to interrupt',
  chipError: 'Connection problem', hintError: 'Type here while it reconnects',
  chipIdle: 'Ready', hintIdle: 'Type here',
  chipMicOff: 'Mic off', hintMicOff: 'Your microphone is off. Tap the mic to talk, or type here',
  micTurnOn: 'Turn your microphone on', micTurnOff: 'Turn your microphone off',
  sessionEnded: 'This session has ended',
  micOffWhileSpeaking: 'Your microphone is off. Tap the mic or type to interrupt',
  micChanged: 'Your microphone changed. Switching to the new one… you can also type here',
  micNoSound: 'No sound from your microphone yet. Speak, or type here',
  roomVoicesSpeaking: 'Other voices nearby: say "stop" or type to interrupt',
  roomVoicesListening: 'Other voices nearby: speak up, or type here',
  send: 'Send',
  typeAnswerPlaceholder: 'Type your answer… Enter to send',
  typeIfCantSpeak: "Type here if you can't speak…",

  voiceState: {
    speaking: 'Tutor is speaking', listening: 'Listening…', hearing: 'Hearing you…',
    processing: 'Got that — one sec…', thinking: 'Thinking…',
    muted: 'Muted — tap the mic to talk', 'manual-held': 'Held — tap ✓ to send',
    idle: 'Ready', error: 'Connection issue',
  },
  voiceTutor: 'Voice tutor',
  startLesson: 'Start the lesson',
  tapToStart: 'Tap to start',
  todaysLesson: 'Today’s lesson:',
  tapMicToStart: 'Tap the mic below to start',
  justTalk: "Just talk — I'll listen and teach on the board",
  startingLine: 'Starting… — the tutor is pulling up your question.',
  whatToWorkOn: 'What would you like to work on?',
  typeQuestionToStart: 'Type your question below to start',
  teachAsWeGo: "I'll teach on the board as we go",
  firstProblemReady: 'Getting your first problem ready…',
  tutorJoining: 'Your tutor is joining…',
  hangTight: 'hang tight — this takes a few seconds',
  didntCatch: 'Didn’t catch that — mind repeating?',
  prevBoard: 'Previous board', jumpToBoard: 'Jump to a board', nextBoard: 'Next board', newContent: 'New content',
  boardN: (n) => `Board ${n}`,
  showTutorQuestion: "Show the tutor's question",
  transcript: 'Transcript',
  textSession: 'Text session',
  draw: 'Draw', drawOnBoard: 'Draw on the board', textNote: 'Text note', uploadProblem: 'Upload a problem',
  fullScreen: 'Full screen', exitFullScreen: 'Exit full screen', expand: 'Expand', exitExpanded: 'Exit expanded view',
  tools: 'Tools', toolsPenActive: 'Tools — pen active', closeTools: 'Close tools',
  drawYourWork: 'Draw your work', pen: 'Pen', eraser: 'Eraser', clear: 'Clear', sendToTutor: 'Send to tutor',
  writeNote: 'Write a note', notePlaceholder: 'Type your answer or notes…',
  lessonNameAria: (title) => `Lesson: ${title}. Tap to show the full name.`,
  showFullLessonName: 'Show the full lesson name',
  gradeN: (grade) => `grade ${grade}`,
  openPractice: 'Open practice', freePractice: 'Free practice',

  continueLesson: 'Continue lesson', pickUpWhereLeftOff: 'Pick up where you left off',
  questionPinTitle: "The tutor's question — tap for the full transcript", dismissQuestionPin: 'Dismiss question pin',
  tutorVoiceOn: 'Turn the tutor voice on', muteTutorVoice: 'Mute the tutor voice', tutorVoiceOffTitle: 'Tutor voice is off — tap to turn it on',
  paceSlow: 'Pace: slow', paceFast: 'Pace: fast', paceNormal: 'Pace: normal',
  tapToAdjust: (label) => `${label} — tap to adjust`,
  adjustLesson: 'Adjust the lesson', harder: 'Harder', easier: 'Easier', slowDown: 'Slow down', speedUp: 'Speed up',
  wrapUp: 'Wrap up', finishLesson: 'Finish lesson', discardSession: 'Discard session',
  finishedProblem: 'I’ve finished this problem', finishedConcept: 'I’ve finished this concept',
  mic: 'Mic', micAuto: 'Auto', micManual: 'Manual',
  humor: 'Humor', humorDefault: 'Default', humorSerious: 'Serious', humorLight: 'A little funny', humorMedium: 'Pretty funny', humorHeavy: 'Very funny',
  voice: 'Voice', speakSlower: 'Speak slower',
  practiceProgress: 'Practice progress', practice: 'Practice', problems: 'Problems',
  solvedN: (n) => `✓ ${n} solved`, shownN: (n) => `${n} shown`,

  conversationHere: 'Your conversation will appear here.', startSpeaking: 'Start speaking to begin!', typeToBegin: 'Type below to begin!',
  stillThinking: 'Still thinking…', takingAMoment: 'Hmm, that\'s taking a moment — feel free to type below if I missed you.',
  quickYes: { label: 'Yes', text: 'Yes' }, quickNo: { label: 'No', text: 'No' }, quickNotSure: { label: 'Not sure', text: 'I\'m not sure' },
  quickTrue: { label: 'True', text: 'True' }, quickFalse: { label: 'False', text: 'False' },

  endTapAgain: 'Tap again to end the session', endOrPauseTitle: 'End or pause — your progress is saved, resume anytime', endOrPauseAria: 'End or pause session',
  endShort: 'End?', endSession: 'End session?', endPause: 'End / Pause',
  finishTapAgain: 'Tap again to finish the lesson', finishShort: 'Finish?', finish: 'Finish',
  timeLeftTitle: 'Time left in this lesson', timeInSessionTitle: 'Time in this session',
  timeLeftAria: (clock) => `${clock} left`, timeElapsedAria: (clock) => `${clock} elapsed`,
  minLeft: (n) => `${n} min left`,
  overtime: 'Overtime',
  exportPdfTitle: 'Export session as PDF', exportPdf: 'Export PDF', exporting: 'Exporting...',

  problem: 'Problem', given: 'Given:', gridIn: 'Grid-in — enter a numeric answer.',
  problemN: (n) => `Problem ${n}`, noAnswerCheck: 'No answer check for this one yet — your tutor will work it through with you.',
  difficulty: { easy: 'easy', medium: 'medium', hard: 'hard' },
  pageOf: (i, n) => `Page ${i} of ${n}`,
  pageN: (n) => `Page ${n}`,
  pageTitled: (n, title) => `Page ${n}: ${title}`,
  prevPage: 'Previous page', nextPage: 'Next page', clearWhiteboard: 'Clear whiteboard',
  boardPages: 'Board pages',
  offPlan: 'Off plan', todaysAgenda: 'Today’s agenda', showFullAgenda: 'Show full agenda',

  tapToHearTutor: 'Tap to hear your tutor',
  linkExpired: 'This session link has expired. Please reload the page to start the tutor.',
  sessionComplete: 'Session Complete',
  sessionStats: (messages, visuals) => `${messages} messages exchanged, ${visuals} visuals generated.`,
  savingLesson: 'Saving your lesson',
};

/** Traditional Chinese, Taiwan wording. */
export const ZH_TW: SessionStrings = {
  chipListening: '聆聽中', hintListening: '請說話，或在這裡輸入',
  chipHearing: '正在聽你說', hintHearing: '請繼續說…',
  chipProcessing: '收到', hintProcessing: '請稍等…',
  chipThinking: '思考中', hintThinking: '正在準備回覆…',
  chipSpeaking: '講解中', hintSpeaking: '想打斷時，直接說話或輸入',
  chipError: '連線異常', hintError: '重新連線中，可先在這裡輸入',
  chipIdle: '準備好了', hintIdle: '在這裡輸入',
  chipMicOff: '麥克風已關閉', hintMicOff: '麥克風已關閉。點一下麥克風說話，或在這裡輸入',
  micTurnOn: '開啟麥克風', micTurnOff: '關閉麥克風',
  sessionEnded: '本次課程已結束',
  micOffWhileSpeaking: '麥克風已關閉。點一下麥克風或輸入文字即可打斷',
  micChanged: '麥克風已更換，正在切換… 也可以在這裡輸入',
  micNoSound: '還沒收到麥克風的聲音。請說話，或在這裡輸入',
  roomVoicesSpeaking: '附近有其他人聲：說「停」或輸入文字即可打斷',
  roomVoicesListening: '附近有其他人聲：請大聲一點，或在這裡輸入',
  send: '傳送',
  typeAnswerPlaceholder: '輸入你的答案… 按 Enter 傳送',
  typeIfCantSpeak: '不方便說話時，可在這裡輸入…',

  voiceState: {
    speaking: '老師講解中', listening: '聆聽中…', hearing: '正在聽你說…',
    processing: '收到，請稍等…', thinking: '思考中…',
    muted: '已靜音，點一下麥克風說話', 'manual-held': '已暫存，點 ✓ 傳送',
    idle: '準備好了', error: '連線異常',
  },
  voiceTutor: '語音老師',
  startLesson: '開始上課',
  tapToStart: '點一下開始',
  todaysLesson: '今天的課程：',
  tapMicToStart: '點下方的麥克風開始',
  justTalk: '直接開口說，我會邊聽邊在白板上講解',
  startingLine: '開始中… 老師正在準備你的題目。',
  whatToWorkOn: '你想練習什麼？',
  typeQuestionToStart: '在下方輸入問題即可開始',
  teachAsWeGo: '我會一邊在白板上講解',
  firstProblemReady: '正在準備第一題…',
  tutorJoining: '老師正在加入…',
  hangTight: '請稍候，只需要幾秒鐘',
  didntCatch: '沒聽清楚，可以再說一次嗎？',
  prevBoard: '上一個白板', jumpToBoard: '跳到其他白板', nextBoard: '下一個白板', newContent: '新內容',
  boardN: (n) => `白板 ${n}`,
  showTutorQuestion: '顯示老師的問題',
  transcript: '逐字稿',
  textSession: '文字課程',
  draw: '畫圖', drawOnBoard: '在白板上畫', textNote: '文字筆記', uploadProblem: '上傳題目',
  fullScreen: '全螢幕', exitFullScreen: '離開全螢幕', expand: '放大', exitExpanded: '還原大小',
  tools: '工具', toolsPenActive: '工具（畫筆使用中）', closeTools: '關閉工具',
  drawYourWork: '畫出你的作法', pen: '畫筆', eraser: '橡皮擦', clear: '清除', sendToTutor: '傳給老師',
  writeNote: '寫筆記', notePlaceholder: '輸入你的答案或筆記…',
  lessonNameAria: (title) => `課程：${title}。點一下顯示完整名稱。`,
  showFullLessonName: '顯示完整課程名稱',
  gradeN: (grade) => (/^\d+$/.test(String(grade)) ? `${grade} 年級` : String(grade)),
  openPractice: '不限主題', freePractice: '自由練習',

  continueLesson: '繼續上課', pickUpWhereLeftOff: '從上次的進度繼續',
  questionPinTitle: '老師的問題 — 點一下看完整逐字稿', dismissQuestionPin: '關閉問題提示',
  tutorVoiceOn: '開啟老師的聲音', muteTutorVoice: '將老師靜音', tutorVoiceOffTitle: '老師的聲音已關閉，點一下開啟',
  paceSlow: '速度：慢', paceFast: '速度：快', paceNormal: '速度：正常',
  tapToAdjust: (label) => `${label}，點一下調整`,
  adjustLesson: '調整課程', harder: '難一點', easier: '簡單一點', slowDown: '慢一點', speedUp: '快一點',
  wrapUp: '做個總結', finishLesson: '完成課程', discardSession: '放棄本次課程',
  finishedProblem: '我做完這題了', finishedConcept: '我學完這個觀念了',
  mic: '麥克風', micAuto: '自動', micManual: '手動',
  humor: '幽默感', humorDefault: '預設', humorSerious: '認真', humorLight: '有點幽默', humorMedium: '很幽默', humorHeavy: '超級幽默',
  voice: '聲音', speakSlower: '說慢一點',
  practiceProgress: '練習進度', practice: '練習', problems: '題目',
  solvedN: (n) => `✓ 完成 ${n} 題`, shownN: (n) => `已出 ${n} 題`,

  conversationHere: '對話內容會顯示在這裡。', startSpeaking: '開口說話就開始囉！', typeToBegin: '在下方輸入就開始囉！',
  stillThinking: '還在想…', takingAMoment: '嗯，這次花的時間比較久。如果我沒聽到你說的話，可以在下方輸入。',
  quickYes: { label: '是', text: '是' }, quickNo: { label: '不是', text: '不是' }, quickNotSure: { label: '不確定', text: '我不確定' },
  quickTrue: { label: '對', text: '對' }, quickFalse: { label: '錯', text: '錯' },

  endTapAgain: '再點一次結束課程', endOrPauseTitle: '結束或暫停 — 進度已儲存，隨時可以繼續', endOrPauseAria: '結束或暫停課程',
  endShort: '結束？', endSession: '確定結束？', endPause: '結束／暫停',
  finishTapAgain: '再點一次完成課程', finishShort: '完成？', finish: '完成',
  timeLeftTitle: '本堂課剩餘時間', timeInSessionTitle: '已上課時間',
  timeLeftAria: (clock) => `剩餘 ${clock}`, timeElapsedAria: (clock) => `已進行 ${clock}`,
  minLeft: (n) => `剩 ${n} 分鐘`,
  overtime: '已超時',
  exportPdfTitle: '將課程匯出為 PDF', exportPdf: '匯出 PDF', exporting: '匯出中...',

  problem: '題目', given: '已知：', gridIn: '填充題 — 請輸入數字答案。',
  problemN: (n) => `第 ${n} 題`, noAnswerCheck: '這一題還沒有核對過的答案，老師會陪你一步一步做。',
  difficulty: { easy: '簡單', medium: '中等', hard: '困難' },
  pageOf: (i, n) => `第 ${i} 頁，共 ${n} 頁`,
  pageN: (n) => `第 ${n} 頁`,
  pageTitled: (n, title) => `第 ${n} 頁：${title}`,
  prevPage: '上一頁', nextPage: '下一頁', clearWhiteboard: '清除白板',
  boardPages: '白板頁面',
  offPlan: '計畫外', todaysAgenda: '今天的進度', showFullAgenda: '顯示完整進度',

  tapToHearTutor: '點一下，聽老師講解',
  linkExpired: '這個課程連結已過期，請重新整理頁面以開始上課。',
  sessionComplete: '課程結束',
  sessionStats: (messages, visuals) => `共 ${messages} 則對話，${visuals} 個圖解。`,
  savingLesson: '正在儲存課程',
};

/** Simplified Chinese, mainland wording. */
export const ZH_CN: SessionStrings = {
  chipListening: '正在听', hintListening: '请说话，或在这里输入',
  chipHearing: '正在听你说', hintHearing: '请继续说…',
  chipProcessing: '收到', hintProcessing: '请稍等…',
  chipThinking: '思考中', hintThinking: '正在准备回复…',
  chipSpeaking: '讲解中', hintSpeaking: '想打断时，直接说话或输入',
  chipError: '连接异常', hintError: '正在重新连接，可先在这里输入',
  chipIdle: '准备好了', hintIdle: '在这里输入',
  chipMicOff: '麦克风已关闭', hintMicOff: '麦克风已关闭。点一下麦克风说话，或在这里输入',
  micTurnOn: '打开麦克风', micTurnOff: '关闭麦克风',
  sessionEnded: '本次课程已结束',
  micOffWhileSpeaking: '麦克风已关闭。点一下麦克风或输入文字即可打断',
  micChanged: '麦克风已更换，正在切换… 也可以在这里输入',
  micNoSound: '还没收到麦克风的声音。请说话，或在这里输入',
  roomVoicesSpeaking: '附近有其他人声：说“停”或输入文字即可打断',
  roomVoicesListening: '附近有其他人声：请大声一点，或在这里输入',
  send: '发送',
  typeAnswerPlaceholder: '输入你的答案… 按 Enter 发送',
  typeIfCantSpeak: '不方便说话时，可在这里输入…',

  voiceState: {
    speaking: '老师讲解中', listening: '正在听…', hearing: '正在听你说…',
    processing: '收到，请稍等…', thinking: '思考中…',
    muted: '已静音，点一下麦克风说话', 'manual-held': '已暂存，点 ✓ 发送',
    idle: '准备好了', error: '连接异常',
  },
  voiceTutor: '语音老师',
  startLesson: '开始上课',
  tapToStart: '点击开始',
  todaysLesson: '今天的课程：',
  tapMicToStart: '点击下方的麦克风开始',
  justTalk: '直接开口说，我会边听边在白板上讲解',
  startingLine: '开始中… 老师正在准备你的题目。',
  whatToWorkOn: '你想练习什么？',
  typeQuestionToStart: '在下方输入问题即可开始',
  teachAsWeGo: '我会一边在白板上讲解',
  firstProblemReady: '正在准备第一题…',
  tutorJoining: '老师正在加入…',
  hangTight: '请稍候，只需要几秒钟',
  didntCatch: '没听清楚，可以再说一遍吗？',
  prevBoard: '上一个白板', jumpToBoard: '跳到其他白板', nextBoard: '下一个白板', newContent: '新内容',
  boardN: (n) => `白板 ${n}`,
  showTutorQuestion: '显示老师的问题',
  transcript: '文字记录',
  textSession: '文字课程',
  draw: '画图', drawOnBoard: '在白板上画', textNote: '文字笔记', uploadProblem: '上传题目',
  fullScreen: '全屏', exitFullScreen: '退出全屏', expand: '放大', exitExpanded: '还原大小',
  tools: '工具', toolsPenActive: '工具（画笔使用中）', closeTools: '关闭工具',
  drawYourWork: '画出你的解法', pen: '画笔', eraser: '橡皮擦', clear: '清除', sendToTutor: '发给老师',
  writeNote: '写笔记', notePlaceholder: '输入你的答案或笔记…',
  lessonNameAria: (title) => `课程：${title}。点击显示完整名称。`,
  showFullLessonName: '显示完整课程名称',
  gradeN: (grade) => (/^\d+$/.test(String(grade)) ? `${grade} 年级` : String(grade)),
  openPractice: '不限主题', freePractice: '自由练习',

  continueLesson: '继续上课', pickUpWhereLeftOff: '从上次的进度继续',
  questionPinTitle: '老师的问题 — 点击查看完整文字记录', dismissQuestionPin: '关闭问题提示',
  tutorVoiceOn: '打开老师的声音', muteTutorVoice: '将老师静音', tutorVoiceOffTitle: '老师的声音已关闭，点击打开',
  paceSlow: '速度：慢', paceFast: '速度：快', paceNormal: '速度：正常',
  tapToAdjust: (label) => `${label}，点击调整`,
  adjustLesson: '调整课程', harder: '难一点', easier: '简单一点', slowDown: '慢一点', speedUp: '快一点',
  wrapUp: '做个总结', finishLesson: '完成课程', discardSession: '放弃本次课程',
  finishedProblem: '我做完这道题了', finishedConcept: '我学完这个知识点了',
  mic: '麦克风', micAuto: '自动', micManual: '手动',
  humor: '幽默感', humorDefault: '默认', humorSerious: '认真', humorLight: '有点幽默', humorMedium: '很幽默', humorHeavy: '超级幽默',
  voice: '声音', speakSlower: '说慢一点',
  practiceProgress: '练习进度', practice: '练习', problems: '题目',
  solvedN: (n) => `✓ 完成 ${n} 题`, shownN: (n) => `已出 ${n} 题`,

  conversationHere: '对话内容会显示在这里。', startSpeaking: '开口说话即可开始！', typeToBegin: '在下方输入即可开始！',
  stillThinking: '还在思考…', takingAMoment: '嗯，这次花的时间比较长。如果我没听到你说的话，可以在下方输入。',
  quickYes: { label: '是', text: '是' }, quickNo: { label: '不是', text: '不是' }, quickNotSure: { label: '不确定', text: '我不确定' },
  quickTrue: { label: '对', text: '对' }, quickFalse: { label: '错', text: '错' },

  endTapAgain: '再点一次结束课程', endOrPauseTitle: '结束或暂停 — 进度已保存，随时可以继续', endOrPauseAria: '结束或暂停课程',
  endShort: '结束？', endSession: '确定结束？', endPause: '结束／暂停',
  finishTapAgain: '再点一次完成课程', finishShort: '完成？', finish: '完成',
  timeLeftTitle: '本节课剩余时间', timeInSessionTitle: '已上课时间',
  timeLeftAria: (clock) => `剩余 ${clock}`, timeElapsedAria: (clock) => `已进行 ${clock}`,
  minLeft: (n) => `剩 ${n} 分钟`,
  overtime: '已超时',
  exportPdfTitle: '将课程导出为 PDF', exportPdf: '导出 PDF', exporting: '导出中...',

  problem: '题目', given: '已知：', gridIn: '填空题 — 请输入数字答案。',
  problemN: (n) => `第 ${n} 题`, noAnswerCheck: '这道题还没有核对过的答案，老师会陪你一步一步做。',
  difficulty: { easy: '简单', medium: '中等', hard: '困难' },
  pageOf: (i, n) => `第 ${i} 页，共 ${n} 页`,
  pageN: (n) => `第 ${n} 页`,
  pageTitled: (n, title) => `第 ${n} 页：${title}`,
  prevPage: '上一页', nextPage: '下一页', clearWhiteboard: '清除白板',
  boardPages: '白板页面',
  offPlan: '计划外', todaysAgenda: '今天的安排', showFullAgenda: '显示完整安排',

  tapToHearTutor: '点击听老师讲解',
  linkExpired: '这个课程链接已过期，请刷新页面以开始上课。',
  sessionComplete: '课程结束',
  sessionStats: (messages, visuals) => `共 ${messages} 条对话，${visuals} 个图解。`,
  savingLesson: '正在保存课程',
};

/** Japanese, polite and plain. */
export const JA: SessionStrings = {
  chipListening: '聞いています', hintListening: '話すか、ここに入力',
  chipHearing: '聞こえています', hintHearing: '続けてください…',
  chipProcessing: 'わかりました', hintProcessing: '少々お待ちください…',
  chipThinking: '考え中', hintThinking: '返事を考えています…',
  chipSpeaking: '話しています', hintSpeaking: '話すか入力すると止められます',
  chipError: '接続エラー', hintError: '再接続中です。ここに入力できます',
  chipIdle: '準備完了', hintIdle: 'ここに入力',
  chipMicOff: 'マイクオフ', hintMicOff: 'マイクがオフです。マイクをタップして話すか、ここに入力',
  micTurnOn: 'マイクをオンにする', micTurnOff: 'マイクをオフにする',
  sessionEnded: 'このセッションは終了しました',
  micOffWhileSpeaking: 'マイクがオフです。マイクをタップするか入力すると止められます',
  micChanged: 'マイクが変わりました。切り替え中… ここに入力もできます',
  micNoSound: 'マイクの音がまだ届いていません。話すか、ここに入力',
  roomVoicesSpeaking: '周りに他の声があります。「ストップ」と言うか入力すると止められます',
  roomVoicesListening: '周りに他の声があります。大きな声で話すか、ここに入力',
  send: '送信',
  typeAnswerPlaceholder: '答えを入力… Enterで送信',
  typeIfCantSpeak: '話せないときは、ここに入力…',

  voiceState: {
    speaking: '先生が話しています', listening: '聞いています…', hearing: '聞こえています…',
    processing: 'わかりました。少々お待ちください…', thinking: '考え中…',
    muted: 'ミュート中 — マイクをタップして話す', 'manual-held': '保留中 — ✓ をタップして送信',
    idle: '準備完了', error: '接続エラー',
  },
  voiceTutor: '音声レッスン',
  startLesson: 'レッスンを始める',
  tapToStart: 'タップして開始',
  todaysLesson: '今日のレッスン：',
  tapMicToStart: '下のマイクをタップして開始',
  justTalk: '話しかけてください。聞きながらホワイトボードで教えます',
  startingLine: '開始しています… 先生が問題を準備しています。',
  whatToWorkOn: '何に取り組みたいですか？',
  typeQuestionToStart: '下に質問を入力して始めましょう',
  teachAsWeGo: 'ホワイトボードを使って教えます',
  firstProblemReady: '最初の問題を準備しています…',
  tutorJoining: '先生が参加します…',
  hangTight: '数秒お待ちください',
  didntCatch: '聞き取れませんでした。もう一度お願いします',
  prevBoard: '前のボード', jumpToBoard: 'ボードを選ぶ', nextBoard: '次のボード', newContent: '新しい内容',
  boardN: (n) => `ボード ${n}`,
  showTutorQuestion: '先生の質問を表示',
  transcript: '会話の記録',
  textSession: 'テキストレッスン',
  draw: '描く', drawOnBoard: 'ボードに書く', textNote: 'テキストメモ', uploadProblem: '問題をアップロード',
  fullScreen: '全画面', exitFullScreen: '全画面を終了', expand: '拡大', exitExpanded: '元に戻す',
  tools: 'ツール', toolsPenActive: 'ツール（ペン使用中）', closeTools: 'ツールを閉じる',
  drawYourWork: '解き方を書こう', pen: 'ペン', eraser: '消しゴム', clear: '消去', sendToTutor: '先生に送る',
  writeNote: 'メモを書く', notePlaceholder: '答えやメモを入力…',
  lessonNameAria: (title) => `レッスン：${title}。タップで全体を表示。`,
  showFullLessonName: 'レッスン名をすべて表示',
  gradeN: (grade) => (/^\d+$/.test(String(grade)) ? `${grade}年生` : String(grade)),
  openPractice: 'テーマ自由', freePractice: '自由練習',

  continueLesson: 'レッスンを続ける', pickUpWhereLeftOff: '前回の続きから',
  questionPinTitle: '先生の質問 — タップで会話の記録を表示', dismissQuestionPin: '質問を閉じる',
  tutorVoiceOn: '先生の音声をオンにする', muteTutorVoice: '先生の音声をミュート', tutorVoiceOffTitle: '先生の音声はオフです — タップでオン',
  paceSlow: 'ペース：ゆっくり', paceFast: 'ペース：速い', paceNormal: 'ペース：ふつう',
  tapToAdjust: (label) => `${label} — タップで調整`,
  adjustLesson: 'レッスンの調整', harder: 'むずかしく', easier: 'やさしく', slowDown: 'ゆっくり', speedUp: '速く',
  wrapUp: 'まとめる', finishLesson: 'レッスンを完了', discardSession: 'このセッションを破棄',
  finishedProblem: 'この問題が終わりました', finishedConcept: 'この内容が終わりました',
  mic: 'マイク', micAuto: '自動', micManual: '手動',
  humor: 'ユーモア', humorDefault: '標準', humorSerious: 'まじめ', humorLight: '少しおもしろく', humorMedium: 'おもしろく', humorHeavy: 'とてもおもしろく',
  voice: '音声', speakSlower: 'ゆっくり話す',
  practiceProgress: '練習の進み具合', practice: '練習', problems: '問題',
  solvedN: (n) => `✓ ${n}問 解けた`, shownN: (n) => `出題 ${n}問`,

  conversationHere: '会話はここに表示されます。', startSpeaking: '話しかけて始めましょう！', typeToBegin: '下に入力して始めましょう！',
  stillThinking: 'まだ考えています…', takingAMoment: '少し時間がかかっています。聞き逃していたら、下に入力してください。',
  quickYes: { label: 'はい', text: 'はい' }, quickNo: { label: 'いいえ', text: 'いいえ' }, quickNotSure: { label: 'わからない', text: 'わかりません' },
  quickTrue: { label: '正しい', text: '正しい' }, quickFalse: { label: '間違い', text: '間違い' },

  endTapAgain: 'もう一度タップで終了', endOrPauseTitle: '終了または一時停止 — 進み具合は保存され、いつでも再開できます', endOrPauseAria: 'セッションを終了または一時停止',
  endShort: '終了？', endSession: '終了しますか？', endPause: '終了／中断',
  finishTapAgain: 'もう一度タップで完了', finishShort: '完了？', finish: '完了',
  timeLeftTitle: '残り時間', timeInSessionTitle: '経過時間',
  timeLeftAria: (clock) => `残り ${clock}`, timeElapsedAria: (clock) => `経過 ${clock}`,
  minLeft: (n) => `残り ${n} 分`,
  overtime: '時間超過',
  exportPdfTitle: 'セッションをPDFで書き出す', exportPdf: 'PDF出力', exporting: '書き出し中...',

  problem: '問題', given: '条件：', gridIn: '数値で答えを入力してください。',
  problemN: (n) => `問題 ${n}`, noAnswerCheck: 'この問題はまだ答えの確認ができていません。先生と一緒に解いていきましょう。',
  difficulty: { easy: 'やさしい', medium: 'ふつう', hard: 'むずかしい' },
  pageOf: (i, n) => `${i} / ${n} ページ`,
  pageN: (n) => `${n} ページ`,
  pageTitled: (n, title) => `${n} ページ：${title}`,
  prevPage: '前のページ', nextPage: '次のページ', clearWhiteboard: 'ホワイトボードを消去',
  boardPages: 'ボードのページ',
  offPlan: 'プラン外', todaysAgenda: '今日の流れ', showFullAgenda: '全体の流れを表示',

  tapToHearTutor: 'タップして先生の声を聞く',
  linkExpired: 'このセッションのリンクは期限切れです。ページを再読み込みして始めてください。',
  sessionComplete: 'セッション完了',
  sessionStats: (messages, visuals) => `メッセージ ${messages} 件、図解 ${visuals} 件。`,
  savingLesson: 'レッスンを保存しています',
};

/** Hindi (2026-11-24). App Hindi: the polite form without a pronoun (टैप करें), and the English words Indian apps
 *  write in Devanagari (सेशन, पेज, माइक, टाइप). No verb form that fixes the tutor's or the learner's gender. */
export const HI: SessionStrings = {
  chipListening: 'सुन रहे हैं', hintListening: 'बोलें, या यहाँ टाइप करें',
  chipHearing: 'आपकी बात सुन रहे हैं', hintHearing: 'बोलते रहें…',
  chipProcessing: 'समझ गए', hintProcessing: 'एक पल…',
  chipThinking: 'सोच रहे हैं', hintThinking: 'जवाब तैयार हो रहा है…',
  chipSpeaking: 'बोल रहे हैं', hintSpeaking: 'रोकने के लिए बोलें या टाइप करें',
  chipError: 'कनेक्शन की समस्या', hintError: 'दोबारा कनेक्ट होने तक यहाँ टाइप करें',
  chipIdle: 'तैयार', hintIdle: 'यहाँ टाइप करें',
  chipMicOff: 'माइक बंद', hintMicOff: 'आपका माइक बंद है। बोलने के लिए माइक पर टैप करें, या यहाँ टाइप करें',
  micTurnOn: 'अपना माइक चालू करें', micTurnOff: 'अपना माइक बंद करें',
  sessionEnded: 'यह सेशन खत्म हो गया है',
  micOffWhileSpeaking: 'आपका माइक बंद है। रोकने के लिए माइक पर टैप करें या टाइप करें',
  micChanged: 'आपका माइक बदल गया है। नए माइक पर स्विच हो रहा है… आप यहाँ टाइप भी कर सकते हैं',
  micNoSound: 'आपके माइक से अभी कोई आवाज़ नहीं आ रही। बोलें, या यहाँ टाइप करें',
  roomVoicesSpeaking: 'आस-पास और आवाज़ें हैं: रोकने के लिए "रुको" बोलें या टाइप करें',
  roomVoicesListening: 'आस-पास और आवाज़ें हैं: ज़ोर से बोलें, या यहाँ टाइप करें',
  send: 'भेजें',
  typeAnswerPlaceholder: 'अपना जवाब टाइप करें… भेजने के लिए Enter दबाएँ',
  typeIfCantSpeak: 'बोल नहीं सकते तो यहाँ टाइप करें…',

  voiceState: {
    speaking: 'टीचर बोल रहे हैं', listening: 'सुन रहे हैं…', hearing: 'आपकी बात सुन रहे हैं…',
    processing: 'समझ गए, एक सेकंड…', thinking: 'सोच रहे हैं…',
    muted: 'माइक बंद है — बोलने के लिए माइक पर टैप करें', 'manual-held': 'रुका हुआ है — भेजने के लिए ✓ पर टैप करें',
    idle: 'तैयार', error: 'कनेक्शन की समस्या',
  },
  voiceTutor: 'वॉइस ट्यूटर',
  startLesson: 'लेसन शुरू करें',
  tapToStart: 'शुरू करने के लिए टैप करें',
  todaysLesson: 'आज का लेसन:',
  tapMicToStart: 'शुरू करने के लिए नीचे माइक पर टैप करें',
  justTalk: 'बस बोलना शुरू करें — बोर्ड पर साथ-साथ समझाया जाएगा',
  startingLine: 'शुरू हो रहा है… — टीचर आपका सवाल तैयार कर रहे हैं।',
  whatToWorkOn: 'आज आप किस पर काम करना चाहेंगे?',
  typeQuestionToStart: 'शुरू करने के लिए नीचे अपना सवाल टाइप करें',
  teachAsWeGo: 'बोर्ड पर साथ-साथ समझाया जाएगा',
  firstProblemReady: 'आपका पहला सवाल तैयार हो रहा है…',
  tutorJoining: 'आपके टीचर जुड़ रहे हैं…',
  hangTight: 'थोड़ा इंतज़ार करें — इसमें कुछ सेकंड लगते हैं',
  didntCatch: 'ठीक से सुनाई नहीं दिया — क्या आप दोबारा बोलेंगे?',
  prevBoard: 'पिछला बोर्ड', jumpToBoard: 'किसी बोर्ड पर जाएँ', nextBoard: 'अगला बोर्ड', newContent: 'नया कंटेंट',
  boardN: (n) => `बोर्ड ${n}`,
  showTutorQuestion: 'टीचर का सवाल दिखाएँ',
  transcript: 'ट्रांसक्रिप्ट',
  textSession: 'टेक्स्ट सेशन',
  draw: 'ड्रॉ करें', drawOnBoard: 'बोर्ड पर ड्रॉ करें', textNote: 'टेक्स्ट नोट', uploadProblem: 'सवाल अपलोड करें',
  fullScreen: 'फ़ुल स्क्रीन', exitFullScreen: 'फ़ुल स्क्रीन से बाहर निकलें', expand: 'बड़ा करें', exitExpanded: 'बड़े व्यू से बाहर निकलें',
  tools: 'टूल', toolsPenActive: 'टूल — पेन चालू है', closeTools: 'टूल बंद करें',
  drawYourWork: 'अपना हल बनाकर दिखाएँ', pen: 'पेन', eraser: 'इरेज़र', clear: 'मिटाएँ', sendToTutor: 'टीचर को भेजें',
  writeNote: 'नोट लिखें', notePlaceholder: 'अपना जवाब या नोट टाइप करें…',
  lessonNameAria: (title) => `लेसन: ${title}। पूरा नाम देखने के लिए टैप करें।`,
  showFullLessonName: 'लेसन का पूरा नाम दिखाएँ',
  gradeN: (grade) => (/^\d+$/.test(String(grade)) ? `कक्षा ${grade}` : String(grade)),
  openPractice: 'कोई भी टॉपिक', freePractice: 'फ़्री प्रैक्टिस',

  continueLesson: 'लेसन जारी रखें', pickUpWhereLeftOff: 'जहाँ छोड़ा था, वहीं से शुरू करें',
  questionPinTitle: 'टीचर का सवाल — पूरा ट्रांसक्रिप्ट देखने के लिए टैप करें', dismissQuestionPin: 'सवाल छिपाएँ',
  tutorVoiceOn: 'टीचर की आवाज़ चालू करें', muteTutorVoice: 'टीचर की आवाज़ बंद करें', tutorVoiceOffTitle: 'टीचर की आवाज़ बंद है — चालू करने के लिए टैप करें',
  paceSlow: 'रफ़्तार: धीमी', paceFast: 'रफ़्तार: तेज़', paceNormal: 'रफ़्तार: सामान्य',
  tapToAdjust: (label) => `${label} — बदलने के लिए टैप करें`,
  adjustLesson: 'लेसन एडजस्ट करें', harder: 'और कठिन', easier: 'और आसान', slowDown: 'धीरे करें', speedUp: 'तेज़ करें',
  wrapUp: 'समेटें', finishLesson: 'लेसन पूरा करें', discardSession: 'सेशन हटाएँ',
  finishedProblem: 'मैंने यह सवाल पूरा कर लिया', finishedConcept: 'मैंने यह कॉन्सेप्ट समझ लिया',
  mic: 'माइक', micAuto: 'ऑटो', micManual: 'मैन्युअल',
  humor: 'हँसी-मज़ाक', humorDefault: 'डिफ़ॉल्ट', humorSerious: 'गंभीर', humorLight: 'थोड़ा मज़ेदार', humorMedium: 'काफ़ी मज़ेदार', humorHeavy: 'बहुत मज़ेदार',
  voice: 'आवाज़', speakSlower: 'धीरे बोलें',
  practiceProgress: 'प्रैक्टिस की प्रोग्रेस', practice: 'प्रैक्टिस', problems: 'सवाल',
  solvedN: (n) => `✓ ${n} हल किए`, shownN: (n) => `${n} दिखाए गए`,

  conversationHere: 'आपकी बातचीत यहाँ दिखेगी।', startSpeaking: 'शुरू करने के लिए बोलें!', typeToBegin: 'शुरू करने के लिए नीचे टाइप करें!',
  stillThinking: 'अभी सोच रहे हैं…', takingAMoment: 'हम्म, इसमें थोड़ा समय लग रहा है — अगर आपकी बात छूट गई हो तो नीचे टाइप कर दें।',
  quickYes: { label: 'हाँ', text: 'हाँ' }, quickNo: { label: 'नहीं', text: 'नहीं' }, quickNotSure: { label: 'पक्का नहीं', text: 'मुझे पक्का नहीं पता' },
  quickTrue: { label: 'सही', text: 'सही' }, quickFalse: { label: 'गलत', text: 'गलत' },

  endTapAgain: 'सेशन खत्म करने के लिए फिर टैप करें', endOrPauseTitle: 'खत्म करें या रोकें — आपकी प्रोग्रेस सेव है, कभी भी फिर शुरू करें', endOrPauseAria: 'सेशन खत्म करें या रोकें',
  endShort: 'खत्म करें?', endSession: 'सेशन खत्म करें?', endPause: 'खत्म / रोकें',
  finishTapAgain: 'लेसन पूरा करने के लिए फिर टैप करें', finishShort: 'पूरा करें?', finish: 'पूरा करें',
  timeLeftTitle: 'इस लेसन में बचा समय', timeInSessionTitle: 'इस सेशन में बीता समय',
  timeLeftAria: (clock) => `${clock} बचा है`, timeElapsedAria: (clock) => `${clock} बीत चुका है`,
  minLeft: (n) => `${n} मिनट बचे`,
  overtime: 'समय से ज़्यादा',
  exportPdfTitle: 'सेशन को PDF में एक्सपोर्ट करें', exportPdf: 'PDF एक्सपोर्ट करें', exporting: 'एक्सपोर्ट हो रहा है...',

  problem: 'सवाल', given: 'दिया है:', gridIn: 'संख्या वाला जवाब — एक संख्या लिखें।',
  problemN: (n) => `सवाल ${n}`, noAnswerCheck: 'इस सवाल के जवाब की जाँच अभी उपलब्ध नहीं है — आपके टीचर इसे आपके साथ हल करेंगे।',
  difficulty: { easy: 'आसान', medium: 'मध्यम', hard: 'कठिन' },
  pageOf: (i, n) => `पेज ${i} / ${n}`,
  pageN: (n) => `पेज ${n}`,
  pageTitled: (n, title) => `पेज ${n}: ${title}`,
  prevPage: 'पिछला पेज', nextPage: 'अगला पेज', clearWhiteboard: 'व्हाइटबोर्ड साफ़ करें',
  boardPages: 'बोर्ड के पेज',
  offPlan: 'प्लान से बाहर', todaysAgenda: 'आज का प्लान', showFullAgenda: 'पूरा प्लान दिखाएँ',

  tapToHearTutor: 'अपने टीचर को सुनने के लिए टैप करें',
  linkExpired: 'इस सेशन का लिंक एक्सपायर हो गया है। ट्यूटर शुरू करने के लिए पेज रीलोड करें।',
  sessionComplete: 'सेशन पूरा हुआ',
  sessionStats: (messages, visuals) => `${messages} मैसेज, ${visuals} विज़ुअल बनाए गए।`,
  savingLesson: 'आपका लेसन सेव हो रहा है',
};

/** French (2026-11-24): tu, as the tutor says it; a space before ? ! : as French is set. No wording that takes the
 *  learner's gender (no "prêt(e)", no agreement with "tu"). */
export const FR: SessionStrings = {
  chipListening: "J'écoute", hintListening: 'Parle, ou écris ici',
  chipHearing: "Je t'entends", hintHearing: 'Continue…',
  chipProcessing: 'Bien reçu', hintProcessing: 'Un instant…',
  chipThinking: 'Je réfléchis', hintThinking: 'Je prépare une réponse…',
  chipSpeaking: 'Je parle', hintSpeaking: "Parle ou écris pour m'interrompre",
  chipError: 'Problème de connexion', hintError: 'Écris ici pendant la reconnexion',
  chipIdle: 'Prêt', hintIdle: 'Écris ici',
  chipMicOff: 'Micro coupé', hintMicOff: 'Ton micro est coupé. Touche le micro pour parler, ou écris ici',
  micTurnOn: 'Activer ton micro', micTurnOff: 'Couper ton micro',
  sessionEnded: 'Cette séance est terminée',
  micOffWhileSpeaking: "Ton micro est coupé. Touche le micro ou écris pour m'interrompre",
  micChanged: 'Ton micro a changé. Passage au nouveau… tu peux aussi écrire ici',
  micNoSound: "Aucun son de ton micro pour l'instant. Parle, ou écris ici",
  roomVoicesSpeaking: "D'autres voix à proximité : dis « stop » ou écris pour m'interrompre",
  roomVoicesListening: "D'autres voix à proximité : parle plus fort, ou écris ici",
  send: 'Envoyer',
  typeAnswerPlaceholder: 'Écris ta réponse… Entrée pour envoyer',
  typeIfCantSpeak: 'Écris ici si tu ne peux pas parler…',

  voiceState: {
    speaking: 'Le tuteur parle', listening: "J'écoute…", hearing: "Je t'entends…",
    processing: 'Bien reçu, un instant…', thinking: 'Je réfléchis…',
    muted: 'Micro coupé — touche le micro pour parler', 'manual-held': 'En attente — touche ✓ pour envoyer',
    idle: 'Prêt', error: 'Problème de connexion',
  },
  voiceTutor: 'Tuteur vocal',
  startLesson: 'Commencer la leçon',
  tapToStart: 'Touche pour commencer',
  todaysLesson: 'Leçon du jour :',
  tapMicToStart: 'Touche le micro ci-dessous pour commencer',
  justTalk: "Parle simplement — j'écoute et j'explique au tableau",
  startingLine: 'Démarrage… — le tuteur prépare ta question.',
  whatToWorkOn: 'Sur quoi veux-tu travailler ?',
  typeQuestionToStart: 'Écris ta question ci-dessous pour commencer',
  teachAsWeGo: "J'expliquerai au tableau au fur et à mesure",
  firstProblemReady: 'Préparation de ton premier exercice…',
  tutorJoining: 'Ton tuteur arrive…',
  hangTight: 'un instant — cela prend quelques secondes',
  didntCatch: "Je n'ai pas bien entendu — tu peux répéter ?",
  prevBoard: 'Tableau précédent', jumpToBoard: 'Aller à un tableau', nextBoard: 'Tableau suivant', newContent: 'Nouveau contenu',
  boardN: (n) => `Tableau ${n}`,
  showTutorQuestion: 'Afficher la question du tuteur',
  transcript: 'Transcription',
  textSession: 'Séance écrite',
  draw: 'Dessiner', drawOnBoard: 'Dessiner au tableau', textNote: 'Note écrite', uploadProblem: 'Envoyer un exercice',
  fullScreen: 'Plein écran', exitFullScreen: 'Quitter le plein écran', expand: 'Agrandir', exitExpanded: 'Quitter la vue agrandie',
  tools: 'Outils', toolsPenActive: 'Outils — stylo actif', closeTools: 'Fermer les outils',
  drawYourWork: 'Dessine ta démarche', pen: 'Stylo', eraser: 'Gomme', clear: 'Effacer', sendToTutor: 'Envoyer au tuteur',
  writeNote: 'Écrire une note', notePlaceholder: 'Écris ta réponse ou tes notes…',
  lessonNameAria: (title) => `Leçon : ${title}. Touche pour afficher le nom complet.`,
  showFullLessonName: 'Afficher le nom complet de la leçon',
  gradeN: (grade) => (/^\d+$/.test(String(grade)) ? `niveau ${grade}` : String(grade)),
  openPractice: 'Sujet libre', freePractice: 'Entraînement libre',

  continueLesson: 'Continuer la leçon', pickUpWhereLeftOff: 'Reprendre là où tu en étais',
  questionPinTitle: 'La question du tuteur — touche pour voir toute la transcription', dismissQuestionPin: 'Masquer la question',
  tutorVoiceOn: 'Activer la voix du tuteur', muteTutorVoice: 'Couper la voix du tuteur', tutorVoiceOffTitle: "La voix du tuteur est coupée — touche pour l'activer",
  paceSlow: 'Rythme : lent', paceFast: 'Rythme : rapide', paceNormal: 'Rythme : normal',
  tapToAdjust: (label) => `${label} — touche pour régler`,
  adjustLesson: 'Régler la leçon', harder: 'Plus difficile', easier: 'Plus facile', slowDown: 'Moins vite', speedUp: 'Plus vite',
  wrapUp: 'Conclure', finishLesson: 'Terminer la leçon', discardSession: 'Abandonner la séance',
  finishedProblem: "J'ai fini cet exercice", finishedConcept: "J'ai fini cette notion",
  mic: 'Micro', micAuto: 'Auto', micManual: 'Manuel',
  humor: 'Humour', humorDefault: 'Par défaut', humorSerious: 'Sérieux', humorLight: 'Un peu drôle', humorMedium: 'Assez drôle', humorHeavy: 'Très drôle',
  voice: 'Voix', speakSlower: 'Parler plus lentement',
  practiceProgress: "Progression de l'entraînement", practice: 'Entraînement', problems: 'Exercices',
  solvedN: (n) => `✓ ${n} ${n > 1 ? 'résolus' : 'résolu'}`, shownN: (n) => `${n} ${n > 1 ? 'affichés' : 'affiché'}`,

  conversationHere: 'Ta conversation apparaîtra ici.', startSpeaking: 'Parle pour commencer !', typeToBegin: 'Écris ci-dessous pour commencer !',
  stillThinking: 'Je réfléchis encore…', takingAMoment: "Hmm, ça prend un moment — écris ci-dessous si ta réponse m'a échappé.",
  quickYes: { label: 'Oui', text: 'Oui' }, quickNo: { label: 'Non', text: 'Non' }, quickNotSure: { label: 'Je ne sais pas', text: 'Je ne sais pas' },
  quickTrue: { label: 'Vrai', text: 'Vrai' }, quickFalse: { label: 'Faux', text: 'Faux' },

  endTapAgain: 'Touche encore pour terminer la séance', endOrPauseTitle: 'Terminer ou mettre en pause — ta progression est enregistrée, reprends quand tu veux', endOrPauseAria: 'Terminer ou mettre en pause la séance',
  endShort: 'Terminer ?', endSession: 'Terminer la séance ?', endPause: 'Terminer / Pause',
  finishTapAgain: 'Touche encore pour terminer la leçon', finishShort: 'Terminer ?', finish: 'Terminer',
  timeLeftTitle: 'Temps restant pour cette leçon', timeInSessionTitle: 'Temps écoulé dans cette séance',
  timeLeftAria: (clock) => `Temps restant : ${clock}`, timeElapsedAria: (clock) => `Temps écoulé : ${clock}`,
  minLeft: (n) => `${n} min ${n > 1 ? 'restantes' : 'restante'}`,
  overtime: 'Temps dépassé',
  exportPdfTitle: 'Exporter la séance en PDF', exportPdf: 'Exporter en PDF', exporting: 'Export en cours...',

  problem: 'Exercice', given: 'Données :', gridIn: 'Réponse numérique — saisis un nombre.',
  problemN: (n) => `Exercice ${n}`, noAnswerCheck: "Pas encore de correction vérifiée pour celui-ci — ton tuteur le résoudra avec toi.",
  difficulty: { easy: 'facile', medium: 'moyen', hard: 'difficile' },
  pageOf: (i, n) => `Page ${i} sur ${n}`,
  pageN: (n) => `Page ${n}`,
  pageTitled: (n, title) => `Page ${n} : ${title}`,
  prevPage: 'Page précédente', nextPage: 'Page suivante', clearWhiteboard: 'Effacer le tableau',
  boardPages: 'Pages du tableau',
  offPlan: 'Hors programme', todaysAgenda: 'Programme du jour', showFullAgenda: 'Afficher tout le programme',

  tapToHearTutor: 'Touche pour écouter ton tuteur',
  linkExpired: 'Ce lien de séance a expiré. Recharge la page pour lancer le tuteur.',
  sessionComplete: 'Séance terminée',
  sessionStats: (messages, visuals) => `${messages} messages échangés, ${visuals} visuels créés.`,
  savingLesson: 'Enregistrement de ta leçon',
};

/** Spanish (2026-11-24): tú, Latin American wording (never vosotros); ¿ and ¡ open a question and an exclamation.
 *  No wording that takes the learner's gender. */
export const ES: SessionStrings = {
  chipListening: 'Escuchando', hintListening: 'Habla, o escribe aquí',
  chipHearing: 'Te escucho', hintHearing: 'Continúa…',
  chipProcessing: 'Entendido', hintProcessing: 'Un momento…',
  chipThinking: 'Pensando', hintThinking: 'Preparando una respuesta…',
  chipSpeaking: 'Hablando', hintSpeaking: 'Habla o escribe para interrumpir',
  chipError: 'Problema de conexión', hintError: 'Escribe aquí mientras se reconecta',
  chipIdle: 'Listo', hintIdle: 'Escribe aquí',
  chipMicOff: 'Micrófono apagado', hintMicOff: 'Tu micrófono está apagado. Toca el micrófono para hablar, o escribe aquí',
  micTurnOn: 'Encender tu micrófono', micTurnOff: 'Apagar tu micrófono',
  sessionEnded: 'Esta sesión terminó',
  micOffWhileSpeaking: 'Tu micrófono está apagado. Toca el micrófono o escribe para interrumpir',
  micChanged: 'Tu micrófono cambió. Cambiando al nuevo… también puedes escribir aquí',
  micNoSound: 'Todavía no llega sonido de tu micrófono. Habla, o escribe aquí',
  roomVoicesSpeaking: 'Hay otras voces cerca: di «alto» o escribe para interrumpir',
  roomVoicesListening: 'Hay otras voces cerca: habla más fuerte, o escribe aquí',
  send: 'Enviar',
  typeAnswerPlaceholder: 'Escribe tu respuesta… Enter para enviar',
  typeIfCantSpeak: 'Escribe aquí si no puedes hablar…',

  voiceState: {
    speaking: 'El tutor está hablando', listening: 'Escuchando…', hearing: 'Te escucho…',
    processing: 'Entendido, un segundo…', thinking: 'Pensando…',
    muted: 'Silenciado — toca el micrófono para hablar', 'manual-held': 'En espera — toca ✓ para enviar',
    idle: 'Listo', error: 'Problema de conexión',
  },
  voiceTutor: 'Tutor de voz',
  startLesson: 'Empezar la lección',
  tapToStart: 'Toca para empezar',
  todaysLesson: 'Lección de hoy:',
  tapMicToStart: 'Toca el micrófono de abajo para empezar',
  justTalk: 'Solo habla — yo escucho y explico en la pizarra',
  startingLine: 'Iniciando… — el tutor está preparando tu pregunta.',
  whatToWorkOn: '¿En qué te gustaría trabajar?',
  typeQuestionToStart: 'Escribe tu pregunta abajo para empezar',
  teachAsWeGo: 'Iré explicando en la pizarra sobre la marcha',
  firstProblemReady: 'Preparando tu primer problema…',
  tutorJoining: 'Tu tutor se está conectando…',
  hangTight: 'un momento — esto tarda unos segundos',
  didntCatch: 'No te escuché bien — ¿puedes repetirlo?',
  prevBoard: 'Pizarra anterior', jumpToBoard: 'Ir a una pizarra', nextBoard: 'Pizarra siguiente', newContent: 'Contenido nuevo',
  boardN: (n) => `Pizarra ${n}`,
  showTutorQuestion: 'Mostrar la pregunta del tutor',
  transcript: 'Transcripción',
  textSession: 'Sesión de texto',
  draw: 'Dibujar', drawOnBoard: 'Dibujar en la pizarra', textNote: 'Nota de texto', uploadProblem: 'Subir un problema',
  fullScreen: 'Pantalla completa', exitFullScreen: 'Salir de pantalla completa', expand: 'Ampliar', exitExpanded: 'Salir de la vista ampliada',
  tools: 'Herramientas', toolsPenActive: 'Herramientas — lápiz activo', closeTools: 'Cerrar herramientas',
  drawYourWork: 'Dibuja tu procedimiento', pen: 'Lápiz', eraser: 'Borrador', clear: 'Borrar', sendToTutor: 'Enviar al tutor',
  writeNote: 'Escribir una nota', notePlaceholder: 'Escribe tu respuesta o tus notas…',
  lessonNameAria: (title) => `Lección: ${title}. Toca para ver el nombre completo.`,
  showFullLessonName: 'Mostrar el nombre completo de la lección',
  gradeN: (grade) => (/^\d+$/.test(String(grade)) ? `${grade}.º grado` : String(grade)),
  openPractice: 'Tema libre', freePractice: 'Práctica libre',

  continueLesson: 'Continuar la lección', pickUpWhereLeftOff: 'Retoma donde te quedaste',
  questionPinTitle: 'La pregunta del tutor — toca para ver la transcripción completa', dismissQuestionPin: 'Ocultar la pregunta',
  tutorVoiceOn: 'Activar la voz del tutor', muteTutorVoice: 'Silenciar la voz del tutor', tutorVoiceOffTitle: 'La voz del tutor está apagada — toca para activarla',
  paceSlow: 'Ritmo: lento', paceFast: 'Ritmo: rápido', paceNormal: 'Ritmo: normal',
  tapToAdjust: (label) => `${label} — toca para ajustar`,
  adjustLesson: 'Ajustar la lección', harder: 'Más difícil', easier: 'Más fácil', slowDown: 'Más despacio', speedUp: 'Más rápido',
  wrapUp: 'Concluir', finishLesson: 'Terminar la lección', discardSession: 'Descartar la sesión',
  finishedProblem: 'Terminé este problema', finishedConcept: 'Terminé este concepto',
  mic: 'Micrófono', micAuto: 'Automático', micManual: 'Manual',
  humor: 'Humor', humorDefault: 'Predeterminado', humorSerious: 'Serio', humorLight: 'Un poco gracioso', humorMedium: 'Bastante gracioso', humorHeavy: 'Muy gracioso',
  voice: 'Voz', speakSlower: 'Hablar más despacio',
  practiceProgress: 'Progreso de la práctica', practice: 'Práctica', problems: 'Problemas',
  solvedN: (n) => `✓ ${n} ${n === 1 ? 'resuelto' : 'resueltos'}`, shownN: (n) => `${n} ${n === 1 ? 'mostrado' : 'mostrados'}`,

  conversationHere: 'Tu conversación aparecerá aquí.', startSpeaking: '¡Habla para empezar!', typeToBegin: '¡Escribe abajo para empezar!',
  stillThinking: 'Sigo pensando…', takingAMoment: 'Mmm, esto está tardando un momento — escribe abajo si no te escuché.',
  quickYes: { label: 'Sí', text: 'Sí' }, quickNo: { label: 'No', text: 'No' }, quickNotSure: { label: 'No sé', text: 'No sé' },
  quickTrue: { label: 'Verdadero', text: 'Verdadero' }, quickFalse: { label: 'Falso', text: 'Falso' },

  endTapAgain: 'Toca otra vez para terminar la sesión', endOrPauseTitle: 'Terminar o pausar — tu progreso se guarda, continúa cuando quieras', endOrPauseAria: 'Terminar o pausar la sesión',
  endShort: '¿Terminar?', endSession: '¿Terminar la sesión?', endPause: 'Terminar / Pausar',
  finishTapAgain: 'Toca otra vez para terminar la lección', finishShort: '¿Terminar?', finish: 'Terminar',
  timeLeftTitle: 'Tiempo restante de esta lección', timeInSessionTitle: 'Tiempo en esta sesión',
  timeLeftAria: (clock) => `Quedan ${clock}`, timeElapsedAria: (clock) => `Han pasado ${clock}`,
  minLeft: (n) => `${n} min ${n === 1 ? 'restante' : 'restantes'}`,
  overtime: 'Tiempo extra',
  exportPdfTitle: 'Exportar la sesión como PDF', exportPdf: 'Exportar PDF', exporting: 'Exportando...',

  problem: 'Problema', given: 'Datos:', gridIn: 'Respuesta numérica — escribe un número.',
  problemN: (n) => `Problema ${n}`, noAnswerCheck: 'Este todavía no tiene una respuesta verificada — tu tutor lo resolverá contigo.',
  difficulty: { easy: 'fácil', medium: 'medio', hard: 'difícil' },
  pageOf: (i, n) => `Página ${i} de ${n}`,
  pageN: (n) => `Página ${n}`,
  pageTitled: (n, title) => `Página ${n}: ${title}`,
  prevPage: 'Página anterior', nextPage: 'Página siguiente', clearWhiteboard: 'Borrar la pizarra',
  boardPages: 'Páginas de la pizarra',
  offPlan: 'Fuera del plan', todaysAgenda: 'Plan de hoy', showFullAgenda: 'Mostrar el plan completo',

  tapToHearTutor: 'Toca para escuchar a tu tutor',
  linkExpired: 'Este enlace de sesión venció. Recarga la página para iniciar el tutor.',
  sessionComplete: 'Sesión terminada',
  sessionStats: (messages, visuals) => `${messages} mensajes intercambiados, ${visuals} elementos visuales generados.`,
  savingLesson: 'Guardando tu lección',
};

/** Keyed on the lesson-language row's code. */
const BY_CODE: Readonly<Record<string, SessionStrings>> = { 'zh-TW': ZH_TW, 'zh-CN': ZH_CN, ja: JA, hi: HI, fr: FR, es: ES };

/** The chrome wording of a session: its lesson language's dictionary, or English (an English lesson, a second
 *  language used only for help, a language with no dictionary yet, and a language whose board and labels are
 *  English: Hinglish). */
export function sessionStrings(languages: readonly string[] | null | undefined): SessionStrings {
  const row = taughtIn(languages);
  return (row && BY_CODE[boardLanguage(row).code]) || EN;
}
