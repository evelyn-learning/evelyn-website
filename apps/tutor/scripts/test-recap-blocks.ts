import { formatRecapBlocks } from '../src/lib/tutor/voice/claude-brain';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }
check('nothing → empty string (byte-identical user content)', formatRecapBlocks({}) === '');
const offer = formatRecapBlocks({ recapOffer: { loTitle: 'Adding fractions' } });
check('offer block names the LO and says STOP and wait', /<recap_offer>[\s\S]*Adding fractions[\s\S]*STOP and wait[\s\S]*<\/recap_offer>/.test(offer), offer);
check('offer block forbids citing a record', /never say a record or system/i.test(offer));
check('soft variant adds the easy-to-decline line', /easy to decline/.test(formatRecapBlocks({ recapOffer: { loTitle: 'X', soft: true } })) && !/easy to decline/.test(offer));
const go = formatRecapBlocks({ recapGo: { loTitle: 'Adding fractions' } });
check('go block orders advance_lesson free then next', /advance_lesson\(\{to:"free"\}\)[\s\S]*advance_lesson\(\{to:"next"\}\)/.test(go), go);
check('go block bounds the recap', /three minutes/.test(go));
check('wrap block', /<recap_wrap>[\s\S]*advance_lesson\(\{to:"next"\}\)[\s\S]*<\/recap_wrap>/.test(formatRecapBlocks({ recapWrap: true })));
check('reply note (decline)', /<recap_offer_reply>[\s\S]*declined[\s\S]*do not ask again/i.test(formatRecapBlocks({ recapReply: 'decline' })));
check('reply note (unclear) tells the brain not to re-ask', /<recap_offer_reply>[\s\S]*unclear[\s\S]*do not re-ask/i.test(formatRecapBlocks({ recapReply: 'unclear' })));
check('accept reply is carried by recap_go, not a reply note', formatRecapBlocks({ recapReply: 'accept' }) === '');
check('blocks end with a blank line separator', formatRecapBlocks({ recapWrap: true }).endsWith('\n\n'));
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
