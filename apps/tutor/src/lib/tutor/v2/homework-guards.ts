/**
 * Tutor brain v2 — the homework reply checks that plain code can make (GAC brain-model comparison, 2026-11-14).
 *
 * Haiku, Sonnet and Opus made the same accuracy mistakes on the 13-subject campaign, so a bigger model was not
 * the fix and a second model judging the first was ruled out (Praveen, 2026-11-15). Each check here reads only
 * what the server already knows (the answer check, the tutor's last question, the student's words) and the
 * draft's own sentences. A draft that fails one is written again once, as the no-reveal guard does
 * (homework-turn.ts); a second draft that still fails is repaired by these same rules.
 *   1. Verdict first: when the answer check decided this message, the reply says so at its start.
 *   2. Non-answers: a bare "yes" or a stray number to a question that asks for something else gets no credit.
 *   3. Own questions: the result the tutor worked out for the student's own question is withheld like the key.
 *   4. Recaps: a part the student only guessed is never credited with working or a realisation.
 */

import { answerText } from '../voice/answer-text';
import { taughtIn } from '../voice/lesson-language';

/**
 * 2026-11-24: the wording these checks read, for a lesson taught in another language (voice/lesson-language.ts).
 * One row per language, each the counterpart of an English pattern below. A text is read against every row of a
 * language with a script of its own (Chinese, Japanese, Hindi), since a short Japanese sentence may hold no kana;
 * the French and Spanish rows only in a lesson taught in them (guardRows). Without them the checks either never fired in such a lesson (a
 * question ending in ？ was not a question, 可能是 11？ not a guess) or misread it (你是不是… as a denial, the 對 of
 * 對邊 as credit). The wording is general: nothing here names a subject or a topic.
 */
interface GuardWords {
  /** A bare yes / no / fine (BARE_ASSENT). */
  assent: RegExp;
  /** A question word (WH), and the shape of a yes / no question that happens to hold one. */
  wh: RegExp; yesNo: RegExp;
  /** A question that asks for a number (ASKS_QUANTITY). */
  asksQuantity: RegExp;
  /** Says the answer is right (POSITIVE), says it is not (NEGATIVE), opens with credit (OPENS_WITH_CREDIT). */
  credit: RegExp; denial: RegExp; opensWithCredit: RegExp;
  /** Working or a reason in the student's words (REASONING). */
  reasoning: RegExp;
  /** Credits working or a realisation (CREDITS_REASONING); casts doubt or takes back (DOUBTS). */
  creditsReasoning: RegExp; doubts: RegExp;
}
/** A word of any script standing alone (\b knows only ASCII letters). */
const B = '(?<![\\p{L}\\p{M}])';
const E = '(?![\\p{L}\\p{M}])';
const GUARD_WORDS: Readonly<Record<'zh' | 'ja' | 'hi' | 'fr' | 'es', GuardWords>> = {
  zh: {
    assent: /^\s*(?:對|对|是|是的|好|好的|嗯|可以|行|不是|不對|不对|不|沒有|没有)\s*[.!。！]*\s*$/u,
    wh: /什麼|什么|甚麼|哪|為何|为何|怎麼|怎么|怎樣|怎样|如何|多少|幾|几|誰|谁/u,
    yesNo: /(?:嗎|吗|好不好|對不對|对不对|可以吧|對吧|对吧)\s*[?？]\s*$|是不是|有沒有|有没有|會不會|会不会|要不要|能不能|可不可以/u,
    asksQuantity: /多少|幾|几|等於|等于|的值|數值|数值|答案|結果|结果|總共|总共|一共|算出|計算|计算|化簡|化简|得到|\d\s*[-+×x*/÷^]\s*\d|=\s*[?？]/u,
    // 對 as a word of its own (對，… / 是對的 / 答對了), never the 對 inside another word (對邊, 相對, 對於).
    credit: /(?:^|[，,。！!？?\s])(?:對|对)(?:了|的|喔|哦|啊|呀|囉|啦)?(?=[，,。！!\s]|$)|(?<![不沒没])(?:是|答|算|做|寫|写|說|说|講|讲|選|选|填|解|想|猜|求|都|全)(?:得)?(?:對|对)(?!不)|(?<!不)(?:正確|正确)|沒錯|没错|(?<!不)(?:很好|太好了)|太棒了|很棒|好棒|真棒|完美|漂亮|厲害|厉害|讚|赞|做得好|(?<!不)是的/u,
    // 不是 as a denial, never the 不是 of 是不是 (a question); 錯誤 named, never 沒有錯誤.
    denial: /不對|不对|不太對|不太对|不正確|不正确|(?<!是)不是(?![嗎吗])|錯了|错了|(?<![沒没無无]有?)(?:錯誤|错误)|(?<![沒没])有(?:一點|一点|個|个)?(?:錯|错|問題|问题)(?![嗎吗])|[算弄寫写看]錯|[算弄写看]错|還差|还差|差一點|差一点|(?:還|还)(?:不(?![錯错])|沒|没)|可惜|再(?:看|想|算|檢查|检查|試|试)/u,
    opensWithCredit: /^[\s，,。!！]*(?:嗯[，,\s]*)?(?:(?:對|对)(?![不嗎吗邊边角稱称應应於于比照象面方立])|是的|沒錯|没错|正確|正确|答對|答对|很好|太好了|太棒了|很棒|好棒|完全正確|完全正确)/u,
    reasoning: /因為|因为|所以|由於|由于|代入|移項|移项|通分|約分|约分|得到|[乘除加減减]/u,
    creditsReasoning: /你(?:自己)?(?:算|想|推|看|解|求|找|發現|发现|注意到|證明|证明)(?:出|到|了)|靠(?:你)?自己|自己(?:算|做|想|解|求)|一步一步(?:算|做|推)/u,
    doubts: /只是(?:用)?猜|(?:用|是)猜的|亂猜|乱猜|(?:還|还)(?:沒|没)(?:有)?(?:確認|确认|驗證|验证)|太早(?:確認|确认|說|说|下結論|下结论)|我(?:剛才|刚才|前面)?不(?:應該|应该|該|该)|(?:剛才|刚才).{0,14}(?:矛盾|說錯|说错|弄錯|弄错)/u,
  },
  ja: {
    assent: /^\s*(?:はい|うん|ええ|いいえ|いや|そうです|そうですね|わかりました|大丈夫です)\s*[.!。！]*\s*$/u,
    wh: /何|なに|なん(?!と|て|だか)|どれ|どの|どこ|どう|なぜ|いくつ|いくら|だれ|誰/u,
    yesNo: /(?:わかりますか|分かりますか|いいですか|大丈夫ですか|できますか|よろしいですか)\s*[?？]?\s*$/u,
    asksQuantity: /いくつ|いくら|何[個人本枚円度倍点回]|値|答え|結果|計算|合計|\d\s*[-+×x*/÷^]\s*\d|=\s*[?？]/u,
    credit: /(?<!不)正解|その通り|そのとおり|合って(?:い)?ます|合ってる|よくでき|すばらしい|素晴らしい|いいですね|お見事|完璧|正しい(?!とは|か)|正しく(?:でき|解け|求め)|^\s*はい[、,]/u,
    denial: /違います|ちがいます|違う|ちがう|間違|惜しい|おしい|残念|もう一度(?:考え|確認|計算|見)|正しくありません|正しくない|不正解/u,
    opensWithCredit: /^[\s、。!！]*(?:はい|そうです|その通り|そのとおり|正解|合って|すばらしい|素晴らしい|よくでき|お見事)/u,
    reasoning: /なぜなら|だから|ので|代入|かけ|割っ|足し|引い/u,
    creditsReasoning: /自分で|気づ|気付|求め(?:ました|られました)|解けました|導き/u,
    doubts: /当てずっぽう|まぐれ|まだ確認(?:でき|され)ていません|早すぎ|言うべきではありませんでした|先ほどの(?:返信|説明)で/u,
  },
  // 2026-11-24: Hindi, and the Hindi of Hinglish. Every pattern needs a Devanagari word, so the row is read against any
  // text as the two above are; the English words of a Hinglish reply ("correct", "exactly") are read by the English patterns.
  hi: {
    assent: /^\s*(?:हाँ|हां|जी|जी\s+हाँ|हाँ\s+जी|ठीक|ठीक\s+है|ओके|अच्छा|सही|नहीं|ना|जी\s+नहीं)\s*[.!।]*\s*$/u,
    wh: /क्या|कौन|कहाँ|कहां|कब|क्यों|कैसे|कैसा|कैसी|कितन|किस/u,
    // क्या opening a sentence asks yes or no (क्या यह सही है?); so does a tag at its end.
    yesNo: /^[\s,]*(?:(?:तो|अच्छा|अब)[,\s]+)?क्या\s|(?:है\s+ना|हैं\s+ना|है\s+न|ठीक\s+है|सही\s+है|समझ\s+आया|समझे|समझ\s+गए)\s*[?？]\s*$/u,
    asksQuantity: /कितन|बराबर|का\s+मान|की\s+(?:value|वैल्यू)|उत्तर|जवाब|परिणाम|कुल|जोड़|गुणा|भाग|निकाल|निकलेगा|आएगा|\d\s*[-+×x*/÷^]\s*\d|=\s*[?？]/u,
    // सही as a word of its own and not denied (सही नहीं); ठीक only where it judges (ठीक है opens anything).
    credit: new RegExp(`${B}सही${E}(?!\\s+नहीं)|बिल्कुल|शाबाश|बहुत\\s+(?:अच्छे|अच्छा|बढ़िया|खूब)|बढ़िया|${B}वाह${E}|(?:एकदम|बिल्कुल)\\s+ठीक|ठीक\\s+(?:कहा|किया|जवाब|उत्तर)|(?:^|[,।.!\\s])(?:हाँ|हां)[,।!]`, 'u'),
    denial: new RegExp(`(?:सही|ठीक|correct|right|पूरा|पूरी\\s+तरह)(?:\\s+(?:सही|correct|तरह))?\\s+नहीं|गलत|ग़लत|(?<!कोई\\s)(?:गलती|ग़लती|चूक)(?!\\s+नहीं)|^[\\s,]*नहीं${E}|करीब|क़रीब|लगभग|(?:फिर\\s+से|दोबारा|एक\\s+बार\\s+(?:फिर|और)|ध्यान\\s+से)\\s+(?:देखो|सोचो|करो|जाँचो|check)|अभी\\s+नहीं`, 'u'),
    opensWithCredit: new RegExp(`^[\\s,।!]*(?:(?:अरे\\s+)?वाह[,!।\\s]+)?(?:हाँ|हां|जी\\s+हाँ|बिल्कुल|सही(?!\\s+नहीं)|एकदम\\s+(?:सही|ठीक)|शाबाश|बहुत\\s+(?:अच्छे|अच्छा|बढ़िया)|बढ़िया|ठीक\\s+(?:कहा|किया|जवाब|उत्तर))${E}`, 'u'),
    reasoning: /क्योंकि|इसलिए|इसीलिए|जोड़|घटा|गुणा|भाग\s+(?:दिया|देने|करने)|रखने\s+पर|रखकर|बराबर/u,
    creditsReasoning: /तुमने\s+(?:खुद|ख़ुद|पहचान|समझ|देख|निकाल|हल|सोच|पकड़|जोड़|घटा|सुलझा)|(?:खुद|ख़ुद)\s+(?:से|ही)|अपने\s+आप|कदम\s+दर\s+कदम|स्टेप\s+बाय\s+स्टेप/u,
    doubts: /(?:सिर्फ़|सिर्फ|बस|केवल)\s+(?:एक\s+)?(?:अंदाज़ा|अंदाजा|तुक्का|guess)|तुक्का|(?:अंदाज़े|अंदाजे)\s+से|guess\s+(?:था|है|किया)|अभी\s+(?:तक\s+)?(?:पक्का|confirm|verify)\s+नहीं|बहुत\s+जल्दी\s+(?:कह|बोल|मान)|मुझे\s+(?:ऐसा\s+)?नहीं\s+(?:कहना|बोलना)\s+चाहिए\s+था|पिछले\s+(?:जवाब|उत्तर|reply)\s+में\s+मैंने/u,
  },
  // French and Spanish are written in English's letters ("comment", "no", "error" are words of both), so their rows
  // are read only in a lesson taught in them (guardRows).
  fr: {
    assent: /^\s*(?:oui|ouais|non|d'accord|ok|okay|bien|voilà|exact)\s*[.!]*\s*$/iu,
    wh: new RegExp(`${B}(?:quoi|quel(?:le)?s?|qu'est-ce|combien|comment|pourquoi|lequel|laquelle|que\\s+(?:vaut|fait|font|donne|obtiens|trouves|remarques|vois|peux|dois|faut|devient|reste|se\\s+passe))${E}`, 'iu'),
    yesNo: /^\W*est-ce\s+que\s|[,\s](?:d'accord|non|n'est-ce\s+pas|hein|c'est\s+clair|ça\s+va|tu\s+(?:vois|comprends|me\s+suis))\s*\?\s*$/iu,
    asksQuantity: new RegExp(`${B}(?:combien|valeur|nombre|total|somme|produit|différence|quotient|résultat|réponse|aire|périmètre|volume|pourcentage|probabilité|pente|longueur|mesure|degrés?|coefficient|exposant|dénominateur|numérateur|que\\s+(?:vaut|fait|font|donne)|ça\\s+(?:fait|donne)|égale?|calcule|simplifie)${E}|\\d\\s*[-+×x*/÷^]\\s*\\d|=\\s*\\?`, 'iu'),
    credit: new RegExp(`${B}(?<!pas\\s)(?:oui|exact(?:ement)?|c'est\\s+(?:ça|juste|exact|correct|bon|la\\s+bonne\\s+réponse)|tout\\s+à\\s+fait|bravo|parfait|très\\s+bien|bien\\s+joué|bonne\\s+réponse|est\\s+(?:juste|correcte?|exacte?)|tu\\s+as\\s+(?:raison|bon|juste)|bien\\s+vu|excellent)${E}`, 'iu'),
    denial: new RegExp(`${B}(?:pas\\s+(?:tout\\s+à\\s+fait|exactement|encore|correcte?|juste|bon|ça|la\\s+bonne)|ce\\s+n'est\\s+pas|c'est\\s+pas|n'est\\s+pas\\s+(?:correcte?|juste|exacte?|bon|ça)|incorrecte?|faux|fausse|(?<!aucune\\s)(?<!pas\\s+d')erreur|presque|pas\\s+loin|regarde\\s+(?:encore|à\\s+nouveau|de\\s+nouveau)|vérifie|revois|réessaie|attention)${E}|^\\W*non(?![-\\p{L}])`, 'iu'),
    opensWithCredit: new RegExp(`^\\W*(?:oui|exact(?:ement)?|c'est\\s+(?:ça|juste|exact|correct|bon)|tout\\s+à\\s+fait|bravo|parfait|très\\s+bien|bien\\s+joué|bonne\\s+réponse|excellent)${E}`, 'iu'),
    reasoning: new RegExp(`${B}(?:parce\\s+que|car|donc|puisque|ce\\s+qui\\s+(?:fait|donne)|j'ai\\s+(?:divisé|multiplié|soustrait|ajouté|additionné|remplacé|factorisé|simplifié|développé)|en\\s+(?:divisant|multipliant|remplaçant|ajoutant|soustrayant)|fois)${E}|=.*=`, 'iu'),
    creditsReasoning: new RegExp(`${B}(?:tu\\s+as\\s+(?:calculé|compris|remarqué|vu|repéré|montré|démontré|expliqué|raisonné|résolu|appliqué|utilisé|factorisé|simplifié|développé|converti|distribué|corrigé|vérifié)|par\\s+toi-même|toute?\\s+seule?|toi-même|étape\\s+par\\s+étape|en\\s+(?:calculant|remarquant|utilisant|vérifiant|multipliant|divisant)|une\\s+fois\\s+que\\s+tu\\s+as)${E}`, 'iu'),
    doubts: new RegExp(`${B}(?:je\\s+n'aurais\\s+pas\\s+dû|j'ai\\s+(?:confirmé|validé|dit)[^.!?]{0,80}trop\\s+(?:tôt|vite)|(?:qu'un|juste\\s+un|seulement\\s+un)\\s+(?:hasard|coup\\s+de\\s+chance)|au\\s+hasard|tu\\s+as\\s+(?:juste\\s+|seulement\\s+)?deviné|en\\s+devinant|pas\\s+encore\\s+(?:vérifiée?|confirmée?)|sans\\s+(?:montrer|avoir\\s+montré|aucun)\\s+(?:ton\\s+|tes\\s+|le\\s+|les\\s+)?(?:calculs?|raisonnement|travail)|dans\\s+ma\\s+(?:dernière|précédente)\\s+réponse)${E}`, 'iu'),
  },
  es: {
    assent: /^\s*(?:sí|si|no|claro|vale|ok|okay|bueno|bien|ajá|correcto|exacto)\s*[.!]*\s*$/iu,
    // The accent marks the question word (qué, cuánto); que and cuanto without it join clauses.
    wh: new RegExp(`${B}(?:qué|cuál(?:es)?|cuánt[oa]s?|cómo|dónde|quién(?:es)?|cuándo)${E}`, 'iu'),
    yesNo: /[,¿\s](?:verdad|cierto|no|de\s+acuerdo|sí|ok|está\s+claro|queda\s+claro|me\s+sigues)\s*\?\s*$/iu,
    asksQuantity: new RegExp(`${B}(?:cuánt[oa]s?|valor|número|total|suma|producto|diferencia|cociente|resultado|respuesta|área|perímetro|volumen|porcentaje|probabilidad|pendiente|longitud|medida|grados?|coeficiente|exponente|denominador|numerador|qué\\s+(?:te\\s+)?(?:da|queda|sale|obtienes)|es\\s+igual|calcula|simplifica)${E}|\\d\\s*[-+×x*/÷^]\\s*\\d|=\\s*\\?`, 'iu'),
    credit: new RegExp(`${B}(?<!no\\s)(?<!no\\s+es\\s)(?<!no\\s+está\\s)(?:sí|correct[oa]|exacto|exactamente|así\\s+es|eso\\s+es|muy\\s+bien|perfecto|bien\\s+hecho|excelente|genial|estupendo|está\\s+(?:bien|perfect[oa])|tienes\\s+razón|lo\\s+lograste|acertaste|buen\\s+trabajo)${E}`, 'iu'),
    denial: new RegExp(`${B}(?:no\\s+(?:es|está)\\s+(?:tan\\s+|del\\s+todo\\s+)?(?:correct[oa]|bien|exactamente|eso|así|la\\s+respuesta)|no\\s+del\\s+todo|no\\s+exactamente|incorrect[oa]|equivocad[oa]|te\\s+equivocaste|casi|cerca|(?<!ningún\\s)(?<!sin\\s)error(?:es)?|revisa|vuelve\\s+a\\s+(?:mirar|revisar|intentar|calcular)|mira\\s+(?:otra\\s+vez|de\\s+nuevo)|inténtalo\\s+(?:otra\\s+vez|de\\s+nuevo)|cuidado|todavía\\s+no|aún\\s+no)${E}|^\\W*no${E}`, 'iu'),
    opensWithCredit: new RegExp(`^\\W*(?:sí|correct[oa]|exacto|exactamente|así\\s+es|eso\\s+es|muy\\s+bien|perfecto|bien\\s+hecho|excelente|genial|estupendo)${E}`, 'iu'),
    reasoning: new RegExp(`${B}(?:porque|ya\\s+que|por\\s+lo\\s+tanto|por\\s+eso|así\\s+que|lo\\s+que\\s+da|dividí|multipliqué|resté|sumé|sustituí|reemplacé|factoricé|simplifiqué|despejé|dividiendo|multiplicando|sustituyendo|sumando|restando)${E}|=.*=`, 'iu'),
    creditsReasoning: new RegExp(`${B}(?:calculaste|te\\s+diste\\s+cuenta|notaste|viste\\s+que|descubriste|demostraste|explicaste|razonaste|resolviste|aplicaste|usaste|utilizaste|factorizaste|simplificaste|despejaste|convertiste|distribuiste|corregiste|verificaste|comprobaste|por\\s+ti\\s+mism[oa]|tú\\s+sol[oa]|tú\\s+mism[oa]|paso\\s+a\\s+paso|una\\s+vez\\s+que|al\\s+(?:calcular|notar|usar|multiplicar|dividir|verificar))${E}`, 'iu'),
    doubts: new RegExp(`${B}(?:no\\s+debí|no\\s+debería\\s+haber|(?:confirmé|dije|afirmé)[^.!?]{0,80}(?:demasiado\\s+pronto|muy\\s+pronto|antes\\s+de\\s+tiempo)|(?:es|fue|era)\\s+(?:solo\\s+|sólo\\s+|apenas\\s+)?(?:una\\s+)?(?:adivinanza|suposición|corazonada)|adivinaste|al\\s+azar|adivinando|(?:todavía|aún)\\s+no\\s+(?:está\\s+)?(?:verificad[oa]|confirmad[oa])|sin\\s+(?:mostrar|haber\\s+mostrado|ningún)\\s+(?:tu\\s+|el\\s+|los\\s+)?(?:procedimiento|trabajo|pasos|cálculos?)|en\\s+mi\\s+(?:última|anterior)\\s+respuesta)${E}`, 'iu'),
  },
};
/**
 * 2026-11-24 (a typed Hinglish test): Hindi typed in Latin letters, as the tutor and students type it in a typed
 * Hinglish session ("Bilkul sahi, x = 4 hai.", "Yeh sahi nahi hai."). Read only in a lesson taught in Hindi or
 * Hinglish: "ha", "na", "sahi" mean nothing in an English one, and must change nothing there.
 */
const NAHI = 'nah(?:i|in|ee|een)';
const HINDI_TYPED: GuardWords = {
  assent: new RegExp(`^\\s*(?:ha+n?|ji|ji\\s+ha+n|ha+n\\s+ji|theek|thik|theek\\s+hai|thik\\s+hai|ok(?:ay)?|achha|accha|sahi|${NAHI}|na|ji\\s+${NAHI})\\s*[.!]*\\s*$`, 'i'),
  wh: /\b(?:kya|kaun|kaha+n?|kab|kyu+n?|kyon|kaise|kaisa|kaisi|kitn[aei]|kis|kise|kisko)\b/i,
  yesNo: /^[\s,]*(?:(?:to|toh|achha|accha|ab)[,\s]+)?kya\s|(?:hai\s+na|hain\s+na|theek\s+hai|thik\s+hai|sahi\s+hai|samajh\s+aaya|samjhe|samajh\s+gaye)\s*\?\s*$/i,
  asksQuantity: /\b(?:kitn[aei]|barabar|value|maan|answer|jawab|uttar|result|total|jod|guna|nikalo|niklega|aa?yega|aaega)\b|\d\s*[-+×x*/÷^]\s*\d|=\s*\?/i,
  // sahi and bilkul not denied (sahi nahi, bilkul nahi); theek only where it judges (theek hai opens anything).
  credit: new RegExp(`\\bsahi\\b(?!\\s+${NAHI})|\\bbilkul\\b(?!\\s+(?:${NAHI}|galat))|\\bshaba+sh\\b|\\bbahut\\s+(?:achh?e|achh?a|accha|badh?iya)\\b|\\bbadh?iya\\b|\\bwah\\b|\\bekdum\\s+(?:sahi|theek|thik)\\b|\\b(?:theek|thik)\\s+(?:kaha|kiya|jawab)\\b|(?:^|[,.!\\s])ha+n[,.!]`, 'i'),
  denial: new RegExp(`\\b(?:sahi|theek|thik|correct|right|poora|pura|poori\\s+tarah|puri\\s+tarah)(?:\\s+(?:sahi|correct|theek))?\\s+${NAHI}\\b|\\bbilkul\\s+${NAHI}\\b|\\bgalat\\b|\\bgalt\\b|(?<!koi\\s)\\bgalti\\b(?!\\s+${NAHI})|^[\\s,]*${NAHI}\\b|\\bkareeb\\b|\\blagbhag\\b|\\b(?:phir\\s+se|fir\\s+se|dobara|ek\\s+baar\\s+(?:phir|fir|aur)|dhyan\\s+se)\\s+(?:dekho|socho|karo|check)\\b|\\babhi\\s+${NAHI}\\b`, 'i'),
  opensWithCredit: new RegExp(`^[\\s,.!]*(?:(?:arre\\s+)?wah[,!.\\s]+)?(?:ha+n|ji\\s+ha+n|bilkul(?!\\s+(?:${NAHI}|galat))|sahi(?!\\s+${NAHI})|ekdum\\s+(?:sahi|theek|thik)|shaba+sh|bahut\\s+(?:achh?e|achh?a|accha|badh?iya)|badh?iya|(?:theek|thik)\\s+(?:kaha|kiya|jawab))\\b`, 'i'),
  reasoning: /\b(?:kyu+nki|kyonki|kyuki|isliye|isiliye|jod\w*|ghata\w*|guna|bhaag\s+(?:diya|dene|karne)|rakhne\s+par|rakhkar|barabar)\b/i,
  creditsReasoning: /\btumne\s+(?:khud|pehchan\w*|samajh\w*|dekh\w*|nikal\w*|hal|solve|soch\w*|pakad\w*)|\bkhud\s+(?:se|hi)\b|\bapne\s+aap\b|\bstep\s+by\s+step\b/i,
  doubts: new RegExp(`\\b(?:sirf|bas|keval)\\s+(?:ek\\s+)?(?:andaza|tukka|guess)\\b|\\btukka\\b|\\bandaze\\s+se\\b|\\bguess\\s+(?:tha|hai|kiya)\\b|\\babhi\\s+(?:tak\\s+)?(?:pakka|confirm|verify)\\s+${NAHI}\\b|\\bbahut\\s+jaldi\\s+(?:keh|bol|maan)\\w*|\\bmujhe\\s+(?:aisa\\s+)?${NAHI}\\s+(?:kehna|bolna)\\s+chahiye\\s+tha\\b|\\bpichh?le\\s+(?:jawab|reply)\\s+mein\\s+maine\\b`, 'i'),
};

/** The rows a text is read against: those of a script of their own (Chinese, Japanese, Hindi) always; French,
 *  Spanish and Hindi typed in Latin letters only in a lesson taught in that language (`languages`: the session's). */
const SCRIPT_ROWS: readonly GuardWords[] = [GUARD_WORDS.zh, GUARD_WORDS.ja, GUARD_WORDS.hi];
const HI_ROWS: readonly GuardWords[] = [...SCRIPT_ROWS, HINDI_TYPED];
const FR_ROWS: readonly GuardWords[] = [...SCRIPT_ROWS, GUARD_WORDS.fr];
const ES_ROWS: readonly GuardWords[] = [...SCRIPT_ROWS, GUARD_WORDS.es];
export type GuardLanguages = readonly string[] | null | undefined;
function guardRows(languages: GuardLanguages): readonly GuardWords[] {
  const base = taughtIn(languages)?.base;
  return base === 'fr' ? FR_ROWS : base === 'es' ? ES_ROWS : base === 'hi' ? HI_ROWS : SCRIPT_ROWS;
}
const anyRow = (pick: (w: GuardWords) => RegExp, text: string, languages?: GuardLanguages) => guardRows(languages).some((w) => pick(w).test(text));

/** The last question in a tutor reply: its last sentence that ends in "?" (or "？"). */
export function lastQuestionOf(text: string): string {
  const qs = String(text ?? '').split(/(?<=[.!?])\s+|(?<=[。！？।])\s*|\n+/).map((s) => s.trim()).filter((s) => /[?？]\s*$/.test(s));
  return qs.at(-1) ?? '';
}

const BARE_ASSENT = /^\s*(?:yes|yeah|yep|yup|ya|ok(?:ay)?|sure|no|nope|right)\s*[.!]*\s*$/i;
/** A number alone, with at most a short unit ("9", "-2.5", "3/4", "400 J"). */
const BARE_NUMBER = /^\s*[-−]?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*\d+)?\s*(?:[a-zA-Z%°]{1,4})?\s*[.!]*\s*$/;
const WH = /(?:^|[,;:]\s*|\b(?:so|now|then|and|but|ok(?:ay)?|good)\b[,\s]+)(?:what|which|where|why|how|who|when)\b/i;
/** A question that asks for a number. */
const ASKS_QUANTITY = new RegExp([
  String.raw`\bhow (?:many|much|long|far|fast|high|big|old|often)\b`,
  String.raw`\b(?:value|number|total|sum|product|difference|quotient|result|answer|limit|area|perimeter|volume|mass|speed|velocity|distance|percent(?:age)?|probability|ratio|rate|slope|length|measure|degrees?|moles?|grams?|coefficient|subscript|exponent|power|denominator|numerator|count|amount)\b`,
  String.raw`\bwhat (?:do|did|would|will) (?:you|we) get\b`,
  String.raw`\b(?:come to|equals?|work out|calculate|compute|evaluate|simplif(?:y|ies))\b`,
  String.raw`\d\s*[-+×x*/÷^]\s*\d`,
  String.raw`=\s*\?`,
].join('|'), 'i');

export interface NonAnswer { said: string; question: string }

/** The same with a unit or measure word in Chinese or Japanese ("23隻", "5 公里"; "110度" is read as "110°"). */
const BARE_NUMBER_CJK = /^\s*[-−]?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*\d+)?\s*[\p{Script=Han}\p{Script=Katakana}]{1,4}\s*[.!]*\s*$/u;

/** The same with one Hindi word after it ("23 मुर्गियाँ", "5 किलोमीटर"). */
const BARE_NUMBER_HI = /^\s*[-−]?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*\d+)?\s*[\p{Script=Devanagari}\p{M}]{1,12}\s*[.!]*\s*$/u;

/** The message is a number alone ("3", "-2.5", "400 J"). `languages`: the session's, for an answer worded in French or Spanish. */
export const isBareNumber = (said: string | null, languages?: GuardLanguages) => { const t = answerText(String(said ?? ''), languages); return BARE_NUMBER.test(t) || BARE_NUMBER_CJK.test(t) || BARE_NUMBER_HI.test(t); };

/**
 * The student's message does not answer the tutor's last question: a bare yes/no to a what/which/where/why/how
 * question, or a bare number to such a question that does not ask for a number ("What do you notice?" → "6").
 * Null when it may be an answer, or when there was no such question.
 */
export function nonAnswer(studentSaid: string | null, lastTutor: string, languages?: GuardLanguages): NonAnswer | null {
  const said = String(studentSaid ?? '').trim();
  const question = lastQuestionOf(lastTutor);
  const wh = WH.test(question) || (anyRow((w) => w.wh, question, languages) && !anyRow((w) => w.yesNo, question, languages));
  if (!said || !question || !wh) return null;
  if (BARE_ASSENT.test(said) || anyRow((w) => w.assent, said, languages)) return { said, question };
  if (isBareNumber(said, languages) && !ASKS_QUANTITY.test(question) && !anyRow((w) => w.asksQuantity, question, languages)) return { said, question };
  return null;
}

// Cut after 。！？ too: a reply in Chinese or Japanese was one "sentence", so its whole length counted as its start. And after the Hindi ।.
const firstSentences = (text: string, n: number) => String(text ?? '').split(/(?<=[.!?])\s+|(?<=[。！？।])\s*|\n+/).map((s) => s.trim()).filter(Boolean).slice(0, n);
export const sentencesOf = (text: string) => String(text ?? '').split(/(?<=[.!?])\s+|(?<=[。！？।])\s*|\n+/).map((x) => x.trim()).filter(Boolean);

const OPENS_WITH_CREDIT = /^\W*(?:yes|yep|yeah|right|correct|exactly|spot on|perfect|well done|that's (?:right|correct|it)|that is (?:right|correct))\b/i;
const CREDITS = /\b(?:is|was|'s) (?:right|correct)\b|\bmatches\b|\byou got it\b/i;

/** The sentence gives credit: opens with "Yes"/"Right"/…, or says something "is right" / "matches". */
export function givesCredit(sentence: string, languages?: GuardLanguages): boolean {
  return OPENS_WITH_CREDIT.test(sentence) || CREDITS.test(sentence) || anyRow((w) => w.opensWithCredit, sentence, languages);
}

/** Check 2: the reply's first sentence credits a message that answered nothing. */
export function creditsNonAnswer(spoken: string, languages?: GuardLanguages): boolean {
  const first = firstSentences(spoken, 1)[0] ?? '';
  return givesCredit(first, languages);
}

const POSITIVE = /\b(?:yes|yep|yeah|right|correct|exactly|spot on|that's it|well done|matches|you got it|perfect|nice work|good work|great work)\b/i;
const NEGATIVE = /\b(?:not quite|not right|not correct|incorrect|isn'?t (?:right|correct|quite)|wrong|doesn'?t (?:match|work|give|hold)|does not|close|almost|look again|check (?:that|this|your|the)|slip|mistake|error|not the)\b|^\W*no\b/i;

/**
 * Check 1: the answer check decided this message, and the reply does not say so at its start (in its first two
 * sentences). All correct: a word of credit, and it does not open on a denial. Any wrong: a word that says so.
 * A mix: either. Returns what the draft lacks, or null.
 */
export function verdictMissing(spoken: string, verdicts: ReadonlyArray<'correct' | 'incorrect'>, languages?: GuardLanguages): 'correct' | 'incorrect' | 'mixed' | null {
  const POSITIVE_CJK = { test: (text: string) => anyRow((w) => w.credit, text, languages) };
  const NEGATIVE_CJK = { test: (text: string) => anyRow((w) => w.denial, text, languages) };
  if (!verdicts.length) return null;
  const head = firstSentences(spoken, 2).join(' ');
  const right = verdicts.every((v) => v === 'correct');
  const wrong = verdicts.every((v) => v === 'incorrect');
  // The verdict in a lesson taught in Chinese or Japanese (對，… / 不太對 / 正解です / 違います): without these every such reply was
  // taken to lack its verdict, redrafted, and given an English one in front.
  const negative = NEGATIVE.test(head) || NEGATIVE_CJK.test(head);
  // 2026-11-24: an English word of credit inside a denial in another language is no credit ("यह correct नहीं है").
  const deniedFirst = NEGATIVE_CJK.test(head.split(/[，,。、।]|\.(?=\s|$)/)[0] ?? '');
  const positive = (POSITIVE.test(head) || POSITIVE_CJK.test(head)) && !deniedFirst;
  if (right) return positive && !/^\W*(?:not quite|no\b)/i.test(head) ? null : 'correct';
  if (wrong) return negative ? null : 'incorrect';
  return positive || negative ? null : 'mixed';
}

/** The words that offer a value tentatively, and "I don't know" before them. */
const HEDGE_WORDS = /\b(?:i don'?t know|not sure|idk|um+|uh+|hmm+|maybe|perhaps|probably|i (?:think|guess)|is it|could it be|would it be|might it be)\b[,.\s]*/gi;
/** Words that show working or a reason. */
const REASONING = /\b(?:because|since|so|then|therefore|thus|gives?|giving|got|get|divid\w*|multipl\w*|subtract\w*|add\w*|distribut\w*|factor\w*|plug\w*|substitut\w*|cancel\w*|times|means|from)\b|=.*=/i;

/**
 * Check 4 input: the message offers its answer as a bare guess, with no working or reason ("I don't know,
 * maybe y = -2?", "maybe C6H12O6?"). A hedge that carries its reason ("maybe 400, because it's 10% twice") is
 * not a guess, and neither is a plain answer stated outright.
 */
export function isGuess(message: string, languages?: GuardLanguages): boolean {
  // Read as the answer checks read it (voice/answer-text.ts): 可能是 11？ is "maybe 11?".
  const m = answerText(String(message ?? ''), languages).trim().replace(/^(?:for\s*)?\(?[a-z]\)\s*:?\s*/i, '');
  const tentative = new RegExp(HEDGE_WORDS.source, 'i').test(m) || /\?\s*$/.test(m);
  const rest = m.replace(HEDGE_WORDS, ' ').replace(/[?!,]+|\.(?=\s|$)/g, ' ').trim();
  if (!tentative || !rest) return false;
  return rest.split(/\s+/).length <= 6 && !REASONING.test(rest) && !anyRow((w) => w.reasoning, rest, languages);
}

/** A sentence that credits the student with working, a method or a realisation. */
const CREDITS_REASONING = /\b(?:once you|after you|when you (?:saw|noticed|reali[sz]ed|thought|looked|pictured|rechecked|caught|spotted|worked)|you (?:worked out|figured out|explained|reasoned|reali[sz]ed|noticed|saw|spotted|caught|fixed|derived|showed|proved|handled|distributed|converted|factored|cancell?ed|applied|used|solved|reached|found|got there by|pictured)|by (?:finding|working|using|noticing|multiplying|dividing|checking)|yourself|on your own|with clean steps)\b/i;

/** Values compared as written: spaces, case, minus signs and subscripts aside. */
export const valueKey = (s: string) => String(s ?? '').toLowerCase()
  .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
  .replace(/[−–]/g, '-').replace(/[\s$\\{}]/g, '').replace(/^[a-z]\w*(?:\([a-z]\))?=/, '');

export interface GuessedPart { label: string; value: string }

/**
 * Check 4: the sentences of a reply that credit working or a realisation for a part the student only guessed.
 * A sentence is about a guessed part when it names the part ("(b)", "part b") or its value; when every
 * confirmed part was a guess, any such credit is about one.
 */
export function unearnedCredit(spoken: string, guessed: ReadonlyArray<GuessedPart>, allGuessed: boolean, languages?: GuardLanguages): string[] {
  if (!guessed.length) return [];
  return sentencesOf(spoken).filter((s) => {
    if (!CREDITS_REASONING.test(s) && !anyRow((w) => w.creditsReasoning, s, languages)) return false;
    if (allGuessed) return true;
    const key = valueKey(s);
    return guessed.some((g) => (g.label && new RegExp(`\\(${g.label}\\)|\\bpart ${g.label}\\b`, 'i').test(s)) || (valueKey(g.value).length >= 1 && key.includes(valueKey(g.value))));
  });
}

/** Why each failed check's draft was not sent (the facts' "not sent" line). */
export const V2_HOMEWORK_GUARD_REASONS = {
  verdict: (v: 'correct' | 'incorrect' | 'mixed') => `the answer check decided the student's answer (${v === 'mixed' ? 'part right, part not' : v === 'correct' ? 'it is right' : 'it is not right'}), and the reply did not say so first. Open with that verdict in plain words, then go on.`,
  nonAnswer: (n: NonAnswer) => `it gave credit to "${n.said.slice(0, 40)}", which does not answer your question "${n.question.slice(0, 160)}". Give it no credit and no "yes": ask what they mean, or ask the question again in other words.`,
  recap: (sentences: string[]) => `it credited the student with working or a realisation they never showed ("${sentences[0].slice(0, 160)}"). Say they got that part, not how: credit only what they wrote, and never cast doubt on it.`,
  doubt: (sentences: string[]) => `it cast doubt on an answer or took back something already said ("${sentences[0].slice(0, 160)}"). An answer the check confirmed is right, however it was reached: never call it a guess, unverified or confirmed too early, and never mention a draft the student did not see.`,
  unchecked: (said: string) => `it credited "${said.slice(0, 40)}" with no check behind it: nothing checked that number. Work out the answer to your own last question first, then say plainly whether "${said.slice(0, 40)}" is right.`,
  own: 'it stated the result of the student\'s own question before they had written it. They must reach it themselves: give them the next smallest step.',
} as const;

/**
 * A sentence that casts doubt on an answer, or takes back what was said: "Your answer is a guess until you show
 * how you got it", "I confirmed your answer too early", "a correction: in my last reply I stated…". The campaign
 * saw these after a held draft (2026-11-15): the student was told a right answer was not yet right.
 */
const DOUBTS = /\bI (?:shouldn'?t|should not) have\b|\bI (?:confirmed|said|stated)\b.{0,80}\b(?:too early|too soon|before you)\b|\b(?:is|was|it'?s) (?:only |just |still )?a guess\b|\byou (?:only )?guessed\b|\bby guessing\b|\b(?:answer|it|that|this)\b.{0,30}\b(?:isn'?t|is not|not) (?:yet )?(?:verified|confirmed)\b|\bwithout (?:showing|shown|any|giving) (?:the |any |your )?working\b|\bin my last reply,? I\b/i;

/** The sentences of a reply that cast doubt on an answer or take back what was said. */
export function castsDoubt(spoken: string, languages?: GuardLanguages): string[] {
  return sentencesOf(spoken).filter((s) => DOUBTS.test(s) || anyRow((w) => w.doubts, s, languages));
}

/** The verdict said in front of a second draft that still lacks it. */
export const V2_VERDICT_OPENERS = { correct: 'That\'s right.', incorrect: 'Not quite.', mixed: '' } as const;
/** The same in a lesson taught in another language, by its code (voice/lesson-language.ts). */
export const V2_VERDICT_OPENERS_BY_LANGUAGE: Readonly<Record<string, { correct: string; incorrect: string; mixed: string }>> = {
  'zh-TW': { correct: '對，沒錯。', incorrect: '不太對。', mixed: '' },
  'zh-CN': { correct: '对，没错。', incorrect: '不太对。', mixed: '' },
  ja: { correct: 'その通りです。', incorrect: '少し違います。', mixed: '' },
  // 2026-11-24. Each is worded so that this file's own credit and denial patterns read it.
  hi: { correct: 'बिल्कुल सही।', incorrect: 'यह पूरी तरह सही नहीं है।', mixed: '' },
  'hi-Latn': { correct: 'हाँ, यह correct है।', incorrect: 'यह पूरी तरह correct नहीं है।', mixed: '' },
  fr: { correct: "Oui, c'est ça.", incorrect: 'Pas tout à fait.', mixed: '' },
  es: { correct: 'Sí, correcto.', incorrect: 'No del todo.', mixed: '' },
};
/** A typed session's, for a language typed in another script than it is spoken from (lesson-lines.ts TYPED): Hinglish. */
const V2_VERDICT_OPENERS_TYPED: Readonly<Record<string, { correct: string; incorrect: string; mixed: string }>> = {
  'hi-Latn': { correct: 'Haan, yeh correct hai.', incorrect: 'Yeh poori tarah correct nahi hai.', mixed: '' },
};
/** The verdict openers of a session: its lesson language's (the typed form in a typed session), or English. */
export function v2VerdictOpeners(languages: GuardLanguages, mode?: 'voice' | 'text'): { correct: string; incorrect: string; mixed: string } {
  const code = taughtIn(languages)?.code ?? '';
  return (mode === 'text' ? V2_VERDICT_OPENERS_TYPED[code] : undefined) ?? V2_VERDICT_OPENERS_BY_LANGUAGE[code] ?? V2_VERDICT_OPENERS;
}

/**
 * Check 3: the text states the result the tutor worked out for the student's own question. A number is read
 * as the key's numbers are (whole-answer-reveal.ts); a formula or expression ("CH4", "x = -9") by its written
 * form, subscripts and spacing aside. Words the question itself contains are never a hit.
 */
export function statesOwnResult(text: string, own: { q: string; a: string }, read: (text: string, value: string, given: string) => boolean): boolean {
  if (statesExpression(text, own.a, own.q)) return true;
  return read(text, own.a, own.q);
}

/** A value written as a formula or expression ("CH4", "y = 3x + 1"), subscripts and spacing aside; never one the given text has. */
export function statesExpression(text: string, value: string, given: string): boolean {
  const k = valueKey(value);
  // A number with its unit ("84.9 N") is the number reader's to judge, not this one's.
  if (/^-?[\d.,]+[a-z%°]{0,4}$/.test(k)) return false;
  return k.length >= 2 && /[a-z]/.test(k) && /\d|[=^/]/.test(k) && valueKey(text).includes(k) && !valueKey(given).includes(k);
}

