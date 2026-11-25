/**
 * Tutor brain v2 — the short things a learner says, and the ways a tutor hands the turn over, in the languages a
 * lesson can be taught in (voice/lesson-language.ts). One row per language; the recognisers ask the rows and hold
 * no wording of these languages themselves.
 *
 * 2026-11-24, with the Hindi, Hinglish, French and Spanish lessons. The v2 recognisers were written for English and
 * extended for Chinese and Japanese where each one lives (one-question.ts, close-mic.ts, interrupted.ts,
 * room-voices.ts, close-heard.ts): a "हाँ" over the end of a question was a cut, "रुको" waited for the room check,
 * "merci, au revoir" called the close off, "sí" to "¿Pasamos a la siguiente parte?" opened nothing.
 *
 * A row is read against any text, whatever the session: these are words no English answer is made of, and every
 * recogniser here settles a doubt in the student's favour. Hinglish is the Hindi row: its Hindi words are written
 * in Devanagari, and its English ones are read by the English patterns the recognisers already have.
 *
 * The wording is general: nothing here names a subject or a topic. Pure. Client-safe.
 */

/** A word of any script standing alone: \b knows only ASCII letters (no edge before "écris" or after "हाँ"). */
const B = '(?<![\\p{L}\\p{M}\\p{N}])';
const E = '(?![\\p{L}\\p{M}\\p{N}])';
const lead = (fillers: string) => `^[\\s¿¡]*(?:(?:${fillers})${E}[\\s,.!।…¿¡]*)*`;

/** What a learner answers to "shall we go on, or do you have a question first?" (part-flow.ts v2MoveAnswer). */
export interface MoveWords {
  /** Yes, go on. */
  go: Pick<RegExp, 'test'>;
  /** A bare no: "no questions" to an ask that offers one first. */
  no: Pick<RegExp, 'test'>;
  /** They have a question, or ask one. */
  question: Pick<RegExp, 'test'>;
  /** Not now, again, skip: no go-ahead whatever it opens with. */
  decline: Pick<RegExp, 'test'>;
}

export interface LessonWords {
  /** Sounds and address words that may lead an answer (regex source). */
  fillers: string;
  /** A brief answer: yes, no, fine, not yet, go on, got it (interrupted.ts BRIEF_ANSWER; room-voices.ts BRIEF with `thanks`). */
  brief: string; thanks: string;
  /** A call to stop, wait, say it again or slow down, or "I didn't catch that" (room-voices.ts COMMAND). */
  command: string;
  /** Asks the tutor to wait (close-heard.ts asksToWait); `asksWhy`: the words that make it a question about the lesson instead. */
  wait: RegExp; asksWhy: RegExp;
  /** Thanks, goodbyes and the yes that goes with them (close-heard.ts PARTING); `notAName`: one word left after them
   *  that is no name (wait, but, why). */
  parting: RegExp; notAName: RegExp;
  /** An instruction that hands the turn over with no question mark (one-question.ts v2HandsOverInItsLanguage), and
   *  what makes one advice for later or an offer under a condition. */
  handsOver: RegExp; notNow: RegExp;
  move: MoveWords;
}

const HI_FILLERS = 'अरे|अच्छा|हम्म+|उम्म+|टीचर|सर|मैम|मैडम|सॉरी|प्लीज़|प्लीज|um+|uh+|sorry|please';
const HI_BRIEF = 'हाँ\\s+जी|जी\\s+हाँ|जी\\s+हां|हाँ|हां|जी\\s+नहीं|जी|ठीक\\s+है|ठीक|ओके|बिल्कुल|ज़रूर|जरूर|नहीं|ना|अभी\\s+नहीं|समझ\\s+(?:गया|गई|आ\\s+गया|आया)|चलो|चलिए|चलें|आगे\\s+(?:बढ़ो|बढ़ें|चलो|चलें|बढ़ते\\s+हैं|चलते\\s+हैं)|पता\\s+नहीं';
const FR_FILLERS = "euh+|ben|bah|bon|alors|oh|ah|madame|monsieur|pardon|s'il\\s+(?:te|vous)\\s+pla[iî]t";
const FR_BRIEF = "oui|ouais|non|d'accord|ok|okay|bien\\s+sûr|pas\\s+encore|vas-y|allons-y|on\\s+y\\s+va|on\\s+continue|continue|c'est\\s+bon|compris|j'ai\\s+compris|ça\\s+marche|voilà|je\\s+(?:ne\\s+)?sais\\s+pas";
const ES_FILLERS = 'eh+|este|pues|bueno|oh|ah|profe|profesora?|maestr[oa]|perdón|por\\s+favor';
const ES_BRIEF = 'sí|no|claro|vale|dale|ok|okay|bueno|de\\s+acuerdo|está\\s+bien|todavía\\s+no|aún\\s+no|sigue|sigamos|adelante|vamos|entendido|ya\\s+entendí|entiendo|listo|lista|ajá|no\\s+(?:lo\\s+)?sé';

export const LESSON_WORDS: Readonly<Record<'hi' | 'fr' | 'es', LessonWords>> = {
  hi: {
    fillers: HI_FILLERS, brief: HI_BRIEF, thanks: 'धन्यवाद|शुक्रिया|थैंक\\s*यू|थैंक्यू|थैंक्स',
    command: 'रुको|रुकिए|रुक\\s+जाओ|ठहरो|बस|स्टॉप|एक\\s+(?:मिनट|सेकंड|minute|second)|(?:फिर\\s+से|दोबारा|एक\\s+बार\\s+(?:फिर|और)(?:\\s+से)?)(?:\\s+(?:बोलो|बोलिए|बताओ|बताइए|समझाओ|समझाइए|कहो))?|क्या(?:\\s+(?:कहा|बोला))?|(?:थोड़ा\\s+)?धीरे(?:\\s+(?:बोलो|बोलिए))?|बहुत\\s+तेज़|सुनाई\\s+नहीं\\s+(?:दिया|दे\\s+रहा)|(?:मुझे\\s+)?समझ\\s+(?:में\\s+)?नहीं\\s+(?:आया|आ\\s+रहा)|नहीं\\s+(?:समझा|समझी)|(?:मुझे\\s+)?(?:नहीं\\s+पता|पता\\s+नहीं)|माफ़\\s+(?:कीजिए|करना)|आगे\\s+(?:बढ़ो|चलो)',
    wait: new RegExp(`${B}(?:रुको|रुकिए|रुक\\s+जाओ|ठहरो|(?:एक|दो)\\s+(?:मिनट|सेकंड|minute|second)|(?:थोड़ा|ज़रा)\\s+(?:टाइम|समय|time|रुको)|सोचने\\s+दो|wait\\s+करो)${E}`, 'u'),
    asksWhy: /क्यों|कैसे|क्या|कौन|कहाँ|कहां|कितन/u,
    parting: new RegExp(`${B}(?:(?:बहुत\\s+)?(?:धन्यवाद|शुक्रिया)|थैंक\\s*यू|थैंक्यू|थैंक्स|बाय(?:[-\\s]बाय)?|अलविदा|नमस्ते|टाटा|फिर\\s+मिल(?:ेंगे|ते\\s+हैं)|कल\\s+मिलते\\s+हैं|अगली\\s+बार\\s+मिलते\\s+हैं|मिलते\\s+हैं|शुभ\\s+रात्रि|गुड\\s+नाइट|ठीक\\s+है|हाँ|हां|जी|ओके|अच्छा|समझ\\s+(?:गया|गई)|आपको\\s+भी|आप\\s+भी|बहुत|टीचर|सर|मैम|मैडम)${E}`, 'gu'),
    notAName: /^(?:रुको|रुकिए|नहीं|लेकिन|पर|मगर|सवाल|क्यों|क्या|कैसे|कब|कहाँ|फिर|दोबारा|और|एक|सॉरी|असल|वैसे)$/u,
    // Hindi puts its verb last: an instruction to the student ends on the तुम (or आप) imperative; "बताओ, …" may open one.
    handsOver: new RegExp(`^\\s*(?:(?:अब|तो|अच्छा|चलो)[,\\s]+)*(?:तुम\\s+)?(?:बताओ|बताइए|सोचो|बोलो)[,\\s]|(?:${B}(?:बताओ|बताइए|करो|कीजिए|निकालो|निकालिए|लिखो|लिखिए|सोचो|सोचिए|ढूँढो|ढूंढो|चुनो|चुनिए|पढ़ो|पढ़िए|बोलो|बोलिए|कहो|समझाओ|भरो|जोड़ो|घटाओ|लगाओ|करके\\s+(?:देखो|दिखाओ|बताओ))(?:\\s+(?:ना|तो|ज़रा))?|${B}(?:तुम्हारी|आपकी)\\s+(?:बारी|turn)(?:\\s+है)?)\\s*[।.!]*["'”’)\\]]*\\s*$`, 'u'),
    notNow: /अगली\s+बार|बाद\s+में|अगर|जब\s+भी|कभी\s+भी|घर\s+(?:पर|जाकर)|होमवर्क/u,
    move: {
      go: new RegExp(`${lead(HI_FILLERS)}(?:हाँ|हां|जी(?!\\s+नहीं)|ठीक|ओके|बिल्कुल|ज़रूर|जरूर|चलो|चलिए|चलें|चलते\\s+हैं|आगे\\s+(?:बढ़|चल)|बढ़ते\\s+हैं|अगला|समझ\\s+(?:गया|गई|आ\\s+गया)|कोई\\s+(?:सवाल|doubt|डाउट|question)\\s+नहीं|नहीं[,\\s]+(?:आगे|चलो|चलिए|कोई\\s+(?:सवाल|doubt|डाउट|question)\\s+नहीं))`, 'iu'),
      no: new RegExp(`${lead(HI_FILLERS)}(?:जी\\s+)?(?:नहीं|ना)(?:[,\\s]+(?:है|धन्यवाद|शुक्रिया|thanks|thank\\s+you|सर|मैम|टीचर))*[\\s.!।]*$`, 'iu'),
      question: new RegExp(`[?？]\\s*$|${B}(?:एक|मेरा|कोई)?\\s*(?:सवाल|doubt|डाउट|question)\\s+(?:है|था|पूछ)|${lead(HI_FILLERS)}(?:क्यों|कैसे|क्या|कौन|कब|कहाँ|कहां)${E}`, 'iu'),
      decline: new RegExp(`${B}(?:रुको|रुकिए|रुक\\s+जाओ|एक\\s+(?:मिनट|सेकंड|minute|second)|अभी\\s+नहीं|फिर\\s+से|दोबारा|एक\\s+बार\\s+(?:फिर|और)|समझ\\s+(?:में\\s+)?नहीं|नहीं\\s+(?:समझा|समझी)|छोड़|स्किप|skip|बाद\\s+में|wait)${E}`, 'iu'),
    },
  },
  fr: {
    fillers: FR_FILLERS, brief: FR_BRIEF, thanks: 'merci(?:\\s+(?:beaucoup|bien))?',
    command: `stop|arrête|arrêtez|attends|attendez|(?:une|deux)\\s+(?:secondes?|minutes?)|un\\s+(?:instant|moment)|pause|pardon|excuse-moi|excusez-moi|désolée?|quoi|comment|hein|(?:tu\\s+peux|peux-tu|vous\\s+pouvez|pouvez-vous|est-ce\\s+que\\s+tu\\s+peux)\\s+(?:répéter|redire|arrêter|attendre|ralentir|aller|parler)${E}.*|répète(?:\\s+(?:ça|encore))?|encore(?:\\s+une\\s+fois)?|moins\\s+vite|plus\\s+lentement|trop\\s+vite|doucement|continue|vas-y|(?:j'ai|je\\s+n'ai)\\s+(?:pas|rien)\\s+(?:compris|entendu|suivi)${E}.*|je\\s+(?:ne\\s+)?(?:comprends|sais|suis)\\s+pas${E}.*|je\\s+suis\\s+(?:perdue?|là|prête?)${E}.*`,
    // "attends" only where it opens a clause (English has the verb), and never "pause": English reads its own.
    wait: new RegExp(`(?:^|[.,!;…]\\s*)(?:(?:euh+|oh|ah|non|oui|mais)[,\\s]+)*(?:attends|attendez)${E}|${B}(?:(?:une|deux|quelques)\\s+(?:secondes?|minutes?)|un\\s+(?:instant|moment)|laisse-moi\\s+(?:réfléchir|chercher|une\\s+(?:seconde|minute))|donne-moi\\s+(?:une|deux)\\s+(?:secondes?|minutes?)|je\\s+reviens)${E}`, 'iu'),
    asksWhy: new RegExp(`${B}(?:pourquoi|comment|quoi|quel(?:le)?s?|qu'est-ce|combien|où)${E}`, 'iu'),
    parting: new RegExp(`${B}(?:merci(?:\\s+(?:beaucoup|bien|à\\s+(?:toi|vous)))?|au\\s+revoir|à\\s+(?:bientôt|demain|plus(?:\\s+tard)?|la\\s+prochaine|tout\\s+à\\s+l'heure)|salut|bye|ciao|bonne\\s+(?:journée|soirée|nuit|continuation)|(?:à\\s+)?(?:toi|vous)\\s+aussi|d'accord|oui|génial|parfait|très\\s+bien|c'est\\s+bon|madame|monsieur)${E}`, 'giu'),
    notAName: /^(?:attends|attendez|non|mais|question|pourquoi|quoi|comment|encore|stop|pardon|désolé|désolée|et|donc|alors|une|un)$/iu,
    // tu imperatives (and vous) that open the sentence. None is an English word: "note", "place", "compare", "trace" would be.
    handsOver: new RegExp(`${lead("alors|maintenant|bon|bien|ok|donc|et|puis|ensuite|cette\\s+fois|allez")}(?:calcule|trouve|résous|écris|dis-moi|essaie|essaye|donne-moi|explique(?:-moi)?|complète|choisis|simplifie|factorise|développe|remplace|montre-moi|vérifie|réponds|utilise|détermine|cherche|à\\s+toi|à\\s+ton\\s+tour|c'est\\s+à\\s+toi|vas-y)${E}`, 'iu'),
    notNow: new RegExp(`${B}(?:la\\s+prochaine\\s+fois|plus\\s+tard|si\\s+tu|quand\\s+tu\\s+(?:veux|voudras)|n'hésite\\s+pas|à\\s+la\\s+maison|pour\\s+demain)${E}`, 'iu'),
    move: {
      go: new RegExp(`${lead(FR_FILLERS)}(?:oui|ouais|d'accord|ok|okay|bien\\s+sûr|vas-y|allons-y|allez|on\\s+y\\s+va|on\\s+(?:continue|passe|avance)|continue|continuons|c'est\\s+(?:bon|parti|clair|compris)|ça\\s+marche|parfait|très\\s+bien|compris|j'ai\\s+compris|je\\s+suis\\s+prête?|(?:non[,\\s]+)?(?:pas\\s+de|aucune)\\s+questions?|non[,\\s]+(?:on\\s+(?:continue|passe|avance|y\\s+va)|c'est\\s+bon|vas-y|ça\\s+va))${E}`, 'iu'),
      no: new RegExp(`${lead(FR_FILLERS)}(?:non|rien)(?:[,\\s]+(?:merci|ça\\s+va|c'est\\s+bon|madame|monsieur))*[\\s.!]*$`, 'iu'),
      question: new RegExp(`[?？]\\s*$|${B}(?:j'ai|j'aurais)\\s+une\\s+(?:petite\\s+)?question|${lead(FR_FILLERS)}(?:(?:oui|ouais)[,\\s]+)?(?:une\\s+question|pourquoi|comment|qu'est-ce|c'est\\s+quoi|quoi|est-ce\\s+que)${E}`, 'iu'),
      decline: new RegExp(`${B}(?:attends|attendez|pas\\s+(?:encore|maintenant|tout\\s+de\\s+suite)|encore\\s+une\\s+fois|répète|réexplique|explique|(?:je\\s+n'ai|j'ai)\\s+pas\\s+compris|je\\s+(?:ne\\s+)?comprends\\s+pas|plus\\s+tard|saute|passe\\s+(?:ça|cette))${E}`, 'iu'),
    },
  },
  es: {
    fillers: ES_FILLERS, brief: ES_BRIEF, thanks: '(?:muchas\\s+)?gracias',
    command: `para|alto|espera|espérame|espere|un\\s+(?:momento|momentito|segundo|minuto)|pausa|perdón|perdona|disculpa|lo\\s+siento|qué|cómo|(?:qué|cómo)\\s+dijiste|(?:me\\s+(?:lo\\s+)?)?(?:puedes|podrías)\\s+(?:repetir|parar|esperar|ir|hablar)${E}.*|repite(?:\\s+eso)?|repítelo|otra\\s+vez|de\\s+nuevo|más\\s+(?:despacio|lento)|muy\\s+rápido|sigue|continúa|adelante|no\\s+(?:te\\s+|lo\\s+)?(?:escuché|oí|entendí|entiendo|sé)${E}.*|estoy\\s+(?:perdid[oa]|aquí|list[oa])${E}.*`,
    wait: new RegExp(`${B}(?:espera|espérame|espere|pausa|(?:un|dos)\\s+(?:momentos?|momentito|segundos?|minutos?)|dame\\s+(?:un|dos)\\s+(?:momento|segundos?|minutos?)|déjame\\s+pensar|ya\\s+vuelvo|ahorita\\s+vuelvo)${E}`, 'iu'),
    asksWhy: new RegExp(`${B}(?:por\\s+qué|cómo|qué|cuál(?:es)?|cuánt[oa]s?|dónde)${E}`, 'iu'),
    parting: new RegExp(`${B}(?:(?:muchas\\s+)?gracias|adiós|hasta\\s+(?:luego|pronto|mañana|la\\s+próxima)|chao|chau|bye|nos\\s+vemos|buenas\\s+noches|que\\s+(?:te\\s+vaya|estés)\\s+bien|cuídate|igualmente|tú\\s+también|sí|claro|vale|ok|okay|listo|perfecto|genial|muy\\s+bien|de\\s+acuerdo|profe|profesora?|maestr[oa])${E}`, 'giu'),
    notAName: /^(?:espera|no|pero|pregunta|por|qué|cómo|otra|para|perdón|y|entonces|una|un)$/iu,
    // tú imperatives that open the sentence. None is an English word or name ("usa", "lee" would be).
    handsOver: new RegExp(`${lead('ahora|bueno|bien|ok|entonces|y|luego|después|esta\\s+vez|a\\s+ver|vamos')}(?:calcula|encuentra|halla|resuelve|escribe|dime|intenta|inténtalo|trata\\s+de|prueba|explica|explícame|completa|elige|escoge|compara|simplifica|factoriza|sustituye|reemplaza|muéstrame|verifica|comprueba|responde|contesta|utiliza|determina|busca|te\\s+toca|tu\\s+turno|es\\s+tu\\s+turno|ahora\\s+tú)${E}`, 'iu'),
    notNow: new RegExp(`${B}(?:la\\s+próxima\\s+vez|más\\s+tarde|después\\s+de\\s+la\\s+clase|si\\s+(?:tienes|quieres|necesitas)|cuando\\s+quieras|en\\s+casa|de\\s+tarea)${E}`, 'iu'),
    move: {
      go: new RegExp(`${lead(ES_FILLERS)}(?:sí|claro|vale|dale|ok|okay|de\\s+acuerdo|está\\s+bien|sigamos|sigue|continúa|continuemos|adelante|vamos|listo|lista|por\\s+supuesto|perfecto|muy\\s+bien|entendido|ya\\s+entendí|(?:no[,\\s]+)?(?:sin|ninguna|no\\s+tengo)\\s+preguntas?|no[,\\s]+(?:sigamos|sigue|continúa|adelante|vamos|todo\\s+bien|está\\s+bien))${E}`, 'iu'),
      no: new RegExp(`${lead(ES_FILLERS)}(?:no|nada|ninguna)(?:[,\\s]+(?:gracias|profe|todo\\s+bien))*[\\s.!]*$`, 'iu'),
      question: new RegExp(`[?？]\\s*$|${B}tengo\\s+una\\s+(?:pregunta|duda)|${lead(ES_FILLERS)}(?:sí[,\\s]+)?(?:una\\s+(?:pregunta|duda)|por\\s+qué|cómo|qué|cuál)${E}`, 'iu'),
      decline: new RegExp(`${B}(?:espera|espérame|un\\s+(?:momento|segundo|minuto)|todavía\\s+no|aún\\s+no|otra\\s+vez|de\\s+nuevo|repite|repítelo|explica|explícame|no\\s+(?:entiendo|entendí)|más\\s+tarde|después|salta|sáltalo)${E}`, 'iu'),
    },
  },
};

const ROWS = Object.values(LESSON_WORDS);
const BRIEF_ANSWER = ROWS.map((w) => new RegExp(`${lead(w.fillers)}(?:${w.brief})${E}`, 'iu'));
const BRIEF = ROWS.map((w) => new RegExp(`${lead(w.fillers)}(?:${w.brief}|${w.thanks})${E}`, 'iu'));
const COMMAND = ROWS.map((w) => new RegExp(`${lead(w.fillers)}(?:${w.command})${E}[\\s.,!?।…]*$`, 'iu'));

/** A brief answer in one of the rows' languages, at the start of what was said (interrupted.ts). */
export const lessonBriefAnswer = (said: string): boolean => BRIEF_ANSWER.some((re) => re.test(said));
/** The same, or thanks (room-voices.ts BRIEF). */
export const lessonBrief = (said: string): boolean => BRIEF.some((re) => re.test(said));
/** A call to stop, wait or say it again, as the whole of what was said (room-voices.ts COMMAND). */
export const lessonCommand = (said: string): boolean => COMMAND.some((re) => re.test(said));
/** Asks the tutor to wait: true or false; null when no row's wait words are in it (close-heard.ts asksToWait). A
 *  question about the lesson is not a request to wait ("रुको, यह negative क्यों है?"). */
export function lessonAsksToWait(said: string): boolean | null {
  const row = ROWS.find((w) => w.wait.test(said));
  return row ? !/[?？]/.test(said) || !row.asksWhy.test(said) : null;
}
/** What was said with every row's thanks and goodbyes taken out (close-heard.ts reopensClose, close-mic.ts). */
export const withoutLessonPartings = (said: string): string => ROWS.reduce((s, w) => s.replace(w.parting, ' '), said);
/** One word left after the thanks that is no name in one of the rows' languages. */
export const lessonNotAName = (word: string): boolean => ROWS.some((w) => w.notAName.test(word));
/** An instruction in one of the rows' languages that hands the turn over, not for later or under a condition. */
export const lessonHandsOver = (sentence: string): boolean => ROWS.some((w) => w.handsOver.test(sentence) && !w.notNow.test(sentence));

/** Chinese (both scripts): the part-change answers. The other Chinese and Japanese wording stays where it was written. */
const ZH_MOVE: MoveWords = {
  go: /^(?:(?:嗯|喔|哦|啊|老師|老师)[，,、\s]*)*(?:好的?|好啊|可以|行|對|对|是的?|嗯|OK|ok|繼續|继续|下一個|下一个|走吧|開始吧|开始吧|沒問題|没问题|懂了|明白了?|知道了|了解|(?:沒有|没有|沒|没)(?:問題|问题)|(?:沒有|没有)[，,\s]*(?:繼續|继续))/u,
  no: /^(?:(?:嗯|喔|哦|啊)[，,、\s]*)*(?:沒有|没有|沒|没|不用|沒有了|没有了)(?:[，,\s]*(?:謝謝|谢谢|老師|老师))*[\s。.!！]*$/u,
  question: /[?？]\s*$|我?(?:有|想問|想问)(?:一個|一个|個|个)?(?:問題|问题)|^(?:為什麼|为什么|什麼|什么|怎麼|怎么|請問|请问)/u,
  decline: /等一下|等等|稍等|先不要|不要|還沒|还没|再(?:說|说|講|讲|解釋|解释)一(?:次|遍)|(?:聽|听|看)不懂|不懂|跳過|跳过|慢一點|慢一点/u,
};

/**
 * 2026-11-24 (a typed Hinglish test): Hindi typed in Latin letters, as students and the tutor type it in a typed
 * Hinglish session ("haan samajh gaya, aage badhao", "nahi samajh aaya", "ek doubt hai", "Ab khud karke batao.").
 * Read ONLY in a lesson taught in Hindi or Hinglish (the callers pass the session's languages): "ha", "na", "do",
 * "to" are English words or sounds, and an English lesson must read exactly as before. The spoken recognisers
 * (brief answers over a question, the room check, asking to wait) are not given these: a spoken Hinglish session's
 * words arrive from the recogniser with the Hindi in Devanagari, which the hi row above reads.
 */
const RO_FILLERS = "arre|are|achha|accha|acha|hmm+|um+|uh+|sir|ma'?am|mam|teacher|sorry|please|ji";
const RO_NAHI = 'nah(?:i|in|ee|een|i+)';
export const ROMAN_HINDI: { move: MoveWords; handsOver: RegExp; notNow: RegExp; parting: RegExp; notAName: RegExp } = {
  move: {
    go: new RegExp(`^\\s*(?:(?:${RO_FILLERS})\\b[\\s,.!]*)*(?:ha+n?|ji(?!\\s+${RO_NAHI})|theek|thik|ok(?:ay)?|bilkul|zaroor|jaroor|chalo|chaliye|chalein|chalen|chalte\\s+h(?:ai|ain)|aage\\s+(?:badh|chal)\\w*|badhte\\s+hain|next|samajh\\s+(?:gaya|gayi|gyi|gya|aa\\s+gaya|aaya|aya)|koi\\s+(?:sawal|doubt|question)\\s+${RO_NAHI}|${RO_NAHI}[,\\s]+(?:aage|chalo|chaliye|koi\\s+(?:sawal|doubt|question)\\s+${RO_NAHI}))\\b`, 'i'),
    no: new RegExp(`^\\s*(?:(?:${RO_FILLERS})\\b[\\s,.!]*)*(?:${RO_NAHI}|na)(?:[,\\s]+(?:hai|thanks|thank\\s+you|sir|ma'?am|mam|dhanyavaa?d|shukriya))*[\\s.!]*$`, 'i'),
    question: new RegExp(`[?？]\\s*$|\\b(?:(?:ek|mera|meri|koi)\\s+)?(?:sawal|doubt|question)\\s+(?:hai|h|tha|thi|puch\\w*|pooch\\w*)\\b|^\\s*(?:(?:${RO_FILLERS})\\b[\\s,.!]*)*(?:kyu+n?|kyon|kaise|kya|kaun|kab|kaha+n?)\\b`, 'i'),
    decline: new RegExp(`\\b(?:ruko|rukiye|ruk\\s+jao|ek\\s+(?:minute|min|second|sec)|abhi\\s+${RO_NAHI}|(?:phir|fir)\\s+se|dobara|dubara|ek\\s+baar\\s+(?:phir|fir|aur)|samajh\\s+(?:mein\\s+|me\\s+)?${RO_NAHI}|${RO_NAHI}\\s+(?:samajh\\w*|samjh\\w*)|chhod\\w*|chod\\s+do|skip|baad\\s+(?:mein|me)|wait)\\b`, 'i'),
  },
  // The verb comes last: an instruction to the student ends on the tum (or aap) imperative; "batao, …" may open one.
  handsOver: /^\s*(?:(?:ab|to|toh|achha|accha|chalo)[,\s]+)*(?:tum\s+)?(?:batao|bataiye|socho|bolo)[,\s]|\b(?:batao|bataiye|karo|kijiye|karke\s+(?:dekho|dikhao|batao)|nikalo|nikaliye|likho|likhiye|socho|sochiye|dhundho|chuno|padho|bolo|kaho|samjhao|dikhao|bharo|lagao)(?:\s+(?:na|to|zara))?\s*[.!]*["'”’)\]]*\s*$|\b(?:tumhari|tumhaari|aapki)\s+(?:baari|bari|turn)(?:\s+hai)?\s*[.!]*\s*$/i,
  notNow: /\b(?:agli\s+baar|baad\s+(?:mein|me)|agar|jab\s+bhi|kabhi\s+bhi|ghar\s+(?:par|pe|jaakar|jakar)|homework)\b/i,
  parting: /\b(?:(?:bahut\s+)?(?:dhanyavaa?d|dhanyawaa?d|shukriya)|alvida|namaste|tata|phir\s+mil(?:enge|te\s+hain)|fir\s+mil(?:enge|te\s+hain)|kal\s+milte\s+hain|milte\s+hain|theek\s+hai|thik\s+hai|haan|han|ji|achha|accha|samajh\s+(?:gaya|gayi)|aapko\s+bhi|aap\s+bhi|bahut|teacher|sir|ma'?am|mam|madam)\b/gi,
  notAName: /^(?:ruko|rukiye|nahi|nahin|lekin|par|magar|sawal|doubt|kyun|kyon|kya|kaise|kab|phir|fir|dobara|aur|ek|waise)$/i,
};
const isHindiLesson = (base: string | null | undefined) => base === 'hi';
/** An instruction typed in romanised Hindi that hands the turn over; only for a lesson taught in Hindi or Hinglish. */
export const romanHindiHandsOver = (sentence: string, base: string | null | undefined): boolean => isHindiLesson(base) && ROMAN_HINDI.handsOver.test(sentence) && !ROMAN_HINDI.notNow.test(sentence);
/** What was said with romanised Hindi thanks and goodbyes taken out; unchanged outside a Hindi or Hinglish lesson. */
export const withoutRomanHindiPartings = (said: string, base: string | null | undefined): string => (isHindiLesson(base) ? said.replace(ROMAN_HINDI.parting, ' ') : said);
export const romanHindiNotAName = (word: string, base: string | null | undefined): boolean => isHindiLesson(base) && ROMAN_HINDI.notAName.test(word);

const either = (a: Pick<RegExp, 'test'>, b: Pick<RegExp, 'test'>): Pick<RegExp, 'test'> => ({ test: (x: string) => a.test(x) || b.test(x) });
/** A Hindi or Hinglish lesson is answered in Devanagari (spoken) or in Latin letters (typed). */
const HI_MOVE: MoveWords = { go: either(LESSON_WORDS.hi.move.go, ROMAN_HINDI.move.go), no: either(LESSON_WORDS.hi.move.no, ROMAN_HINDI.move.no), question: either(LESSON_WORDS.hi.move.question, ROMAN_HINDI.move.question), decline: either(LESSON_WORDS.hi.move.decline, ROMAN_HINDI.move.decline) };

const MOVE_BY_BASE: Readonly<Record<string, MoveWords>> = { zh: ZH_MOVE, hi: HI_MOVE, fr: LESSON_WORDS.fr.move, es: LESSON_WORDS.es.move };
/** The part-change answers of a lesson taught in `base` (voice/lesson-language.ts); null for English and Japanese,
 *  which part-flow.ts reads itself. */
export const lessonMoveWords = (base: string | null | undefined): MoveWords | null => MOVE_BY_BASE[base ?? ''] ?? null;
