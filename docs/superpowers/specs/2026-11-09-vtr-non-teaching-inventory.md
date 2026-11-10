# VoiceTutorRealtime — inventory of non-teaching behaviour (2026-11-09)

Taken read-only from the code for the v2 session client (see 2026-11-09-tutor-brain-v2-design.md §4.8). Line numbers are for main `1061b218`.

```
VTR non-pedagogy inventory. File: /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/components/VoiceTutorRealtime.tsx (32,422 lines). Line numbers are for this worktree. "~" means an approximate range edge.

Overall layout:
- Imports: 1–620
- Props interface: 792–1275
- Component starts: 1395
- callBrainOnce (brain SSE turn, mostly pedagogy): 12863–~25060
- Cover/ack: 25067–25325
- handleStudentTranscriptForBrain (dispatch serializer): 25335–26175
- applyPerceptionVerdict: 26202–26607
- useOpenAIRealtime wiring: 26669–26872
- Perception handlers: 27715–29470
- Perception hooks: 29475–29521
- Imperative handle: 29723–29951
- Lifecycle: 30280–31800
- JSX: 31800+

Debug events are emitted about 1,050 times. Most of them are pedagogy.

================================================================
A. MICROPHONE AND CAPTURE
================================================================
VTR calls getUserMedia nowhere. Capture is owned by:
- the shared mic module, /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/voice/shared-mic.ts
- the hooks useOpenAIRealtime, usePerceptionWS and useCartesiaInkWS.
VTR only orchestrates.

- **Text mode means muted from the start.** `isMicMuted` is set true when sessionMode is 'text', and `isMicMutedRef` is the sync mirror that drops late transcripts after a mute. 1831–1843.
- **Production mic opens only after Start.** startListening is called from the Start tap, resume, gesture start, unmute and composer blur. Each is guarded by hasStarted. "2026-08-17 portal-96a436f0: a pre-start startListening pushed the relay to 'listening' and made the Start tap dead." Sites: 30371, 29759–29775, 31003–31007, 31119–31128, 32304–32327.
- **Perception start gate.** The perception socket connects warm on mount but stays muted until hasStarted and not muted. `muteGrace` keeps it open briefly so a mute can submit what was being said. Single owner of perception mute. 31135–31155.
- **Mute toggle and mute-to-submit.** Muting mid-utterance keeps perception listening for 3.5 s and arms a one-shot pass so that utterance still reaches the brain. A held dangling fragment is flushed on mute. Unmute clears a stale brain-busy flag. Pre-start unmute does not open the relay mic. 31059–31133.
- **Prewarm hold.** With the `prewarm` prop, the perception socket and its getUserMedia wait for the start, so the permission prompt lands on the student's click and not on the host page load (spec v1.1 §3). 26892–26898.
- **Mic re-acquire on device change.** Triggers: navigator.mediaDevices 'devicechange' (only if the default input actually changed), the shared track ending, or the track muted for more than 3 s. Calls reacquireSharedMicStream, shows an on-stage notice via onStageNotice until the first new frame, and does no socket reconnects. "Task 27 §G, GDI run 14: AirPods → laptop mic, recogniser never heard the student again." Window events: evelyn:shared-mic-track, evelyn:shared-mic-frame. 26979–27067. Uses lib/tutor/voice/mic-reacquire.ts, shared-mic.ts and thinking-cue.ts (micChangedLabel).
- **Dead-mic one-tap device switch.** "2026-08-17: macOS iPhone Continuity mic recording pure zeros, 3x in Aug 15–17." On a truly dead MicSilentWarning (peak=-Infinity), it enumerates devices and offers a fallback. handleMicSwitch calls switchSharedMicDevice and rebuilds Ink, perception and the production recorder. Tried device ids accumulate so it cannot ping-pong. 1914–1921, 12080–12091, 29523–29553. Uses lib/tutor/voice/mic-devices.ts and shared-mic.ts.
- **Mic-silent notice gating.** "Round 28, 2026-07-24: peak −75 dBFS, tutor 'not responding'." "Round-7c: Android noiseSuppression gates real signal below −60 dBFS, so the banner showed about 11 s in while the opener played."
  - A quiet-but-finite warning is held until the opening audio is done, a 20 s grace (MIC_NOTICE_GRACE_MS, 1286) has passed, and the student has never been heard.
  - Any speech onset or final clears it permanently (micEverHeardRef).
  - Suppressed in text mode.
  - Sites: 1897–1934, 1956–1965, 12053–12111, 27470–27493, 29002–29009.
- **Shared-mic and playback-route telemetry.** Forwards the window events evelyn:playback-route and evelyn:shared-mic into onDebugEvent. "Round-6: blind on whether the AEC route's play() succeeded." 26958–26977. Uses lib/tutor/voice/playback-route.ts.
- **Sample rates.** Not set in VTR. The pronunciation ClipCapture uses CLIP_SAMPLE_RATE (lib/tutor/pronunciation/clip-capture.ts). The 24 kHz AudioContext and capture-rate handling are in useOpenAIRealtime.ts (around lines 574 and 2785).
- **Echo and noise handling.** VTR does none of it at the capture level. AEC routing is in playback-route.ts and shared-mic.ts; VTR's echo defences are under B.
- **Noise floor.** noiseFloorStateRef: three barge-in gates whose adaptive threshold saturated at the ceiling plant a once-per-session "noisy room" tip. "R58 portal-dd0bf3a9." 2369–2374 and 29335–29346. Uses cover-layer.ts (createNoiseFloorState, recordFloorSample). Planting the tip is pedagogy-adjacent.
- **Session recording upload (session-audio).**
  - useAudioRecorder({ sessionId, enabled, sessionStartedAtMs }) at 1982–1995. Enabled when a sessionId exists and NEXT_PUBLIC_TUTOR_RECORD_AUDIO !== 'false'.
  - The student track gets its chunks from useOpenAIRealtime's onStudentAudioChunk (the production mic tap). The tutor track comes from onTutorAudioChunk. 26733–26739.
  - decideTutorAudioCapture skips recording the tutor in text mode and with silent TTS: "2026-10-09: zero-filled buffers uploaded ~2.9 MB/min". 1991–1995. Uses lib/tutor/voice/tutor-audio-capture.ts.
  - finalize is fire-and-forget at end: "Round-15 Issue 10, 2026-07-16: awaiting it caused a ~15 s hang." 31363–31377.
  - Several start paths call startListening specifically because it is the only thing that feeds the student track. "2026-10-04: resumed sessions and upload-first sittings had no student recording." 30356–30371 and 29747–29775.
  - Upload itself is in /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/hooks/useAudioRecorder.ts.
- **Pronunciation clip tap.** Audio from the perception frames (TUTOR_CLIP_FROM_PERCEPTION) or the realtime tap feeds ClipCapture, which is POSTed to /api/tutor/pronunciation/assess. Onsets while the tutor is speaking are ignored as echo. Sites: 1527–1755, 26728–26738, 28979–28990, 29379–29381, 29473–29474. The feature is pedagogy, but its audio tapping must be preserved if pronunciation stays.
- **iOS, Safari and mobile.**
  - unlockAudio() must run inside a real user gesture so the AudioContext resumes. Every start path calls it synchronously: Start tap 30779–30784, queued start 31008–31013, typed submit 32196–32208, handle sendTextMessage and runGestureSessionStart 29724–29781, resumeContinue 30351, pickAgendaItem 3451–3530.
  - audioUnlockedRef covers the gesture-less homework kickoff. 3482–3486.
  - "Round-16 Issue 1, portal-f0c496ca: a suspended AudioContext wedged the dock on SPEAKING for 9 min."
  - Composer is 16 px on mobile to stop iOS Safari auto-zoom. 32279–32282.
  - pagehide is used rather than beforeunload because iOS fires it more reliably. 3203–3225.
  - Mobile AEC converges only after about 15–30 s of played audio, which drives the opener energy gate (see B). 29107–29130.
  - The thinking-cue AudioContext is primed inside the Start gesture. 30716–30717.

================================================================
B. SPEECH RECOGNITION AND PERCEPTION
================================================================
- **Perception stage resolution.**
  - Set by NEXT_PUBLIC_TUTOR_PERCEPTION_STAGE, or the dev override window.__tutorPerceptionStage (0..4). -1 means off.
  - "Stage 4 cleanup 2026-06-15: perception is the sole input authority; the production WS no longer transcribes."
  - Stage values: 2 means cancel during 'processing'; 3 means cancel during 'speaking'.
  - 26646–26667.
- **STT engine choice.** usePerceptionWS (OpenAI transcription WS) or useCartesiaInkWS (Cartesia Ink 2). TUTOR_STT_ENGINE_INK2 picks one. Both hooks are always called; exactly one is enabled. They share the same callbacks.
  - perceptionEnabled = not text mode, stage ≥ 0, relay connected, no prewarm hold, not host standby. 26897–26898.
  - Hook calls: 29475–29509.
  - Ink2 turn-end timeout is 5600 ms, or 3000 ms when bilingual (lib/tutor/voice/ink-turn-end.ts). 29493–29494.
  - Ink diagnostics are forwarded through onDiagnostic: "2026-07-24 incident: Ink drop paths were console-only." 29504–29507.
  - getPerceptionEnergyWindowRef feeds the energy gate from whichever hook owns the mic. "Round-5 2026-07-27: it was hard-nulled for Ink2, so barge-in was time-only and echo killed the tutor." 29510–29518.
  - useTranscription.ts is not used by VTR.
- **onRelayReady.** Fires once on the first realtime connect; the embed posts evelyn:ready. 26899–26906.
- **Speaking windows.** Records wall-clock spans while realtime.state === 'speaking'. wasTutorSpeakingAt(t) is the echo gate. "Round-6 portal-cca76850: script stamps can't answer 'was the tutor talking at onset' after kill+resume." 26916–26950.
- **perceptionOnTranscript** (final transcript handler), 27726–28663. Steps:
  - Tags the log, sequence number and turn-latency marks. Any final clears the mic notice.
  - Stale-checkpoint watchdog: an interrupt checkpoint older than 20 s is cleared and the render buffer un-paused. "2026-07-15 TTS-wedge incident: voice wedged while typed still worked." 27771–27789.
  - Stage-2 lazy-arm watchdog: STAGE2_LAZY_ARM_MAX_AGE_MS. 27790–27808. The constant is at around 2324.
  - Incomplete-utterance hold (TUTOR_INCOMPLETE_HOLD, R34 T3). A dangling-word final ("give me a…") is held for INCOMPLETE_HOLD_MS, and the next final merges into it. It never holds while the tutor is speaking or processing, or while muted. 27809–27871. Uses lib/tutor/voice/utterance-hold.ts.
  - Mute gate: drops transcripts that arrive while muted ("perception latency 5–14 s"), except the mute-to-submit one-shot. 27873–27907.
  - E1 Stage-2 lazy-cancel resolution: decides whether an onset during 'processing' should abort the in-flight turn. Noise, filler, self-voice or a duplicate of the in-flight transcript leaves it alone; a real new turn aborts it (runPerceptionKill) and then dispatches. 27908–28016. Uses lib/tutor/voice/stage2-cancel-policy.ts.
  - Noise filter via classifyTranscript, shared with the production path. "Stage 3 fix #6, 2026-05-28: phantom Whisper 'Thanks for watching!' reached the brain." Issue H 2026-09-01: a bare greeting always passes before the first accepted turn. 28017–28040. Uses lib/tutor/voice/transcript-filters.ts.
  - Consecutive-noise nag, spoken (R32 T8): only when the speech lasted long enough and the tutor is not speaking. 28041–28063. Uses cover-layer.ts (recordNoiseDrop) and bilingual-canned.ts.
  - "Being heard" resolve, then Manual-mic buffering. In manual mode, finals buffer until the student taps ✓; a ✓ mid-utterance arms a pending send. 28093–28151. flushManualBuffer and setManualMic are at 5040–5094.
  - Dev verdict pin. 28152–28188.
  - Classifier-confirmed barge-in kill: a new_turn verdict while an energy gate is still armed stops the TTS. "Task 6, 2026-08-11, portal-dc74208b." 28189–28281.
  - Late-tail hold: a short continuation a couple of seconds into the reply is held as context and the reply keeps playing. "2026-10-18, embed-1792346446334." 28282–28293. Uses lib/tutor/voice/late-tail.ts.
  - Stage 1 classifier. Heuristic first (classifyHeuristic with self-voice scoring against the TTS script buffer and speaking windows). An 'escalate' verdict goes to Haiku /api/tutor/perception-classify with a 3 s timeout; 5 consecutive failures open a 60 s circuit that fails open. 28294–28663. Uses lib/tutor/voice/perception-classifier.ts and tts-script-buffer.ts.
  - Stage-4 direct dispatch: a new_turn with no checkpoint goes to handleStudentTranscriptForBrain after the exact-text dedupe (DispatchDeduper). "2026-07-09 session-1783615623994." 28478–28509. Uses lib/tutor/voice/dispatch-dedupe.ts.
  - Late-arrival fallback and production-WS suppression, Stage 3 fixes #4, #12 and #13. 28421–28477.
- **applyPerceptionVerdict** (verdict to action), 26202–26607. Handles the checkpoint created by a cancel.
  - Re-arms the speakText gate at verdict time.
  - **Noise, filler or self-voice while speaking:** resume from the cut. The unplayed sentences are re-queued through resumeSpeakText, starting from the clause tail of the cut sentence. "Stage 3.1, 2026-06-16." 26357–26435. Uses lib/tutor/voice/resume-from-cut.ts; applyClauseTailSnapshot is at 26181–26215.
  - Restore-after-finished guard. "Stage 3 fix #14 2026-06-15; Round-6d: brain done ≠ delivered." 26436–26482.
  - **Noise during processing:** refire the original turn. 26483–26503.
  - **MERGE:** original plus new text, with the timestamped history of what the student actually heard before the cut. "Q3 2026-06-16." 26504–26580.
  - **FRESH:** dispatches the new turn. 26581–26600.
  - MERGE and FRESH queue instead of dropping if they land mid-utterance (R32 H1).
  - A confirmed self-echo kill arms selfEchoCancelImmunityUntil (Round-6d, portal-37c0e0bf kill→replay loop). 26350–26356.
- **perceptionOnSpeechStart** (VAD onset), 28978–29377.
  - Clears a stale lazy-pending, latches micEverHeard, and stamps the idle-nudge onset clock. "2026-10-03: onsets no longer reset the nudge; 229 s dead air."
  - Sets perceptionHearing and the mid-utterance flag, with a 30 s watchdog (PERCEPTION_MID_UTTERANCE_WATCHDOG_MS).
  - Supersedes pending gates and calls beginBargeInPause.
  - Opening-turn guard, rewritten 2026-07-22. During the opener a kill is deferred behind the energy gate, or OPENER_BARGEIN_SUSTAIN_MS when there is no energy window. "2026-07-04 phantom echo vs a student who spoke 12 s unheard." Mobile AEC note at 29093–29224.
  - Stage 2 ('processing'): lazy-arm, no abort on onset. "Repeat-storm '60 60'." 29225–29261.
  - Stage 3 ('speaking'): sustained-energy gate (Task V1). The adaptive threshold comes from the pre-onset echo floor (Round-5), polled until BARGEIN_SUSTAIN_MS. Ink2 without an energy window falls back to a time-based deferred kill (Task X3, portal-da5b97a6). 29262–29376. Uses lib/tutor/voice/bargein-gate.ts.
- **Pause-first barge-in** (2026-10-17, TUTOR_BARGEIN_PAUSE_FIRST). Playback is paused at the onset. It becomes a kill or a resume on the first evidence: energy gate passed, an Ink partial scored against the TTS script, speech stopped before any words, or the max wait. Echo-shaped turns skip pausing. 28912–28977 and 29387–29392. Uses lib/tutor/voice/bargein-pause.ts. Uses realtime.pauseSpeech and resumeSpeech.
- **runPerceptionKill** (the actual stage-2/3 kill), 28759–28911.
  - Refuses during the self-echo immunity window, or when the cancel-storm governor says no; in the refusal case it keeps the pause and resumes when the student stops.
  - Otherwise it suppresses the ack, records the cancel checkpoint (original transcript, whether the brain was in flight, a snapshot of unplayed sentences, the cut fraction) and arms no-verdict recovery.
  - Then the speakText gate, render-buffer pause, abort of the brain stream, clearSpeechQueue, production-WS dedupe and markInterrupted.
- **Retro-cancel effect.** When the state flips to processing or speaking while the student is mid-utterance, it fires the cancel retroactively: lazy-arm for processing, energy-gated kill for speaking. "Observed 2026-05-28: '17 and 48' lost." 27412–27713 (body from about 27527).
- **No-verdict recovery** (armNoVerdictRecovery). If an open checkpoint never gets a verdict, it resumes the unplayed TTS or re-fires the aborted turn after STAGE2_NO_VERDICT_RESTORE_MS, deferring while there is recent VAD activity. "embed-1792199116313: a 5.5 s noise burst left the tutor silent 75 s." 28664–28758. Uses lib/tutor/voice/stage2-restore.ts.
- **perceptionOnSpeechStop.** 29378–29456.
  - Turn-latency eagerEnd mark; resolves the pause; clears the gates.
  - Clears mid-utterance, resumes a held tutor, stamps VAD activity.
  - For speech of 2 s or more, shows "got that" and arms an 18 s timer; if no dispatch arrives, onListeningHint('didnt-catch').
  - Records speech duration for the noise nag.
- **Transcription failed, state change and error callbacks.** 29459–29471.
- **Opening-turn audio shield** (openingTurnFullyDelivered): requires the text done and the audio drained, with a 90 s cap. openerBargeEscape lets a 3+ word, non-echo, CJK-aware utterance through. "Issue F embed-1788187567764; embed-1792174263669 Japanese." 27412–27496.
- **Cancel-storm governor.** CancelStormGovernor, created around 2352. Reset when a reply is delivered (speaking ends without a recent kill). "2026-07-09 session-1783615559112: the tutor-is-deaf livelock." 27497–27518. Uses lib/tutor/voice/cancel-storm.ts.
- **Fragments and superseded turns** (in handleStudentTranscriptForBrain, 25335–26175):
  - Mid-utterance dispatch guard: drop, or queue with a 4 s drain poller (Stage 3 fix #11; R32 H1). 25544–25639.
  - Production-WS dedupe after a Stage-2 cancel. 25651–25682.
  - Busy queue: one brain call at a time. Later utterances queue and drain combined. 25697–25792 and 26002–26133.
  - Synthetic '['-marker isolation.
  - Turn coalescing within TURN_COALESCE_MS. "Issue E: the transcriber splits one utterance into 2+ finals."
  - Pre-audio supersede: a new final before any audio aborts the in-flight turn and merges it with the new one (TUTOR_SUPERSEDE_PRE_AUDIO).
  - Fuzzy Levenshtein dedup on drain; the helper is at 742+. "Stage 3 fix #15."
  - A 90 s busy watchdog re-queues stuck input. "2026-04-29 electricity session." 25828–25866.
- **Think-time hold.** An "uh, let me think" transcript sets studentThinkTimeUntil (TUTOR_THINK_TIME_HOLD). 25689–25702. Borderline pedagogy.
- **Student-declared hold** ("wait until I say…"). Swallows overheard speech while active. R58. 25524–25543. Uses lib/tutor/voice/student-hold.ts. Partly pedagogy.
- **"Mute me" voice command.** Mutes the mic. 25515–25523; muteMicRef at 31420.
- **Typed input while the tutor is speaking or busy** (composer onSubmit, 32039–32260).
  - decideTypedDuringTurn picks one of: supersede the opening turn, queue after it, supersede the turn, queue after the turn, or force-clear. "2026-10-08 portal-09624999: two overlapping turns." Uses /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/components/session/text-kickoff.ts.
  - clearSpeechQueue and interrupt before dispatch.
  - Composer focus mutes the mic; blur re-opens it (hasStarted guard).
  - The typed hold waits, bounded, for a homework plan: createTypedHold at 3345–3376.
  - LaTeX wrappers are stripped from typed text.

================================================================
C. SPEECH OUTPUT
================================================================
The audio engine (TTS fetch and WS, queue, playback, fallback) lives in /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/hooks/useOpenAIRealtime.ts and its sub-hook useCartesiaSonicWS.ts.

- **Provider selection.** The ttsProvider prop is one of 'realtime', 'openai-mini', 'cartesia' or 'silent', plus cartesiaVoiceId, cartesiaVoiceSpeed, speechRate, speakingRate, tutorLanguages and silentSecondsPerWord. It is passed in relayMode. 26685–26699.
- **Fallback visibility.**
  - onTtsIssue shows a transient "Audio hiccup — retrying/skipped" notice (2026-07-15). 26740–26746.
  - onVoiceHiccupCaption fires when Cartesia and the ElevenLabs fallback both fail (Round-28b). 26747–26750.
  - onTtsTransportFallback reports Sonic WS falling back to HTTP. 26854–26860.
  - Fallback logic itself is in the hook (around 3356–3383) and lib/tutor/voice/elevenlabs-voice-map.ts and tts-recovery.ts.
- **Self-voice script buffer.** Every spoken sentence is pushed in its post-pronunciation form (rewriteForTTS), with a scriptId stamped at real playback start, end or skip. "Round-6e portal-386d96cb: 'x_a' vs 'X sub A'." "V2 2026-07-15." 1999–2034 and 26751–26754. Uses lib/tutor/voice/tts-script-buffer.ts and tts-pronunciation.ts.
- **Sentence queue, per brain attempt** (inside callBrainOnce):
  - TTS gate: gated, open or closed. Sentences buffer until the first tool verdict, with a 1 s fall-open for text-only turns.
  - Validate-before-speak rolling hold.
  - speakOne / speakOnePart is the single place a brain sentence reaches the speaker.
  - Bilingual quoted-span split: one TTS request per language part (Task 25 §B, lib/tutor/voice/tts-language.ts).
  - Narration and render-sync counters advance per part.
  - 16084–16192 and 16387–16530.
  - The gate/hold design is tied to kill-and-retry and validators, which are pedagogy. The mechanical parts are the split and the dispatch counters.
- **speakText gate.** SPEAK_TEXT_GATE_MS = 600 at 2332–2351. Arming sites: 26320, 27293, 27642, 28735, 28887, 31341. Check function: 16116–16129. "Stage 3 fix #10, 2026-05-28: the SSE buffer drain after an abort leaked audio past the cancel."
- **Fast opener.** Sentence 0, if it is a safe content-free runway phrase, is voiced immediately and bypasses the gate (TUTOR_BRAIN_FAST_OPENER). Uses lib/tutor/voice/opener-filler.ts, first-turn-runway.ts and meta-narration.ts. 18618–18680.
- **SSE 'pause' event.** The brain asks for up to 4 s of comprehension pause before the next sentence. 18802–18811.
- **Interruption and pause/resume on barge-in.** See B. realtime.pauseSpeech, resumeSpeech, clearSpeechQueue, dropQueuedSpeech, resumeSpeakText, getCurrentSentenceFraction and peekSpeechQueue are wired via refs at 26863–26872.
- **Ack and cover layer.** Thinking filler about 1.2 s after the student's turn (450 ms legacy), damped by shouldSpeakAck. Liveness checks ("are you there?") get an instant reply. Escalating covers at about 9 s and 25 s, then a give-up at 45 s that aborts and hands to stall recovery. "2026-10-20 GAC Geometry portal-4cc98574: 83 s of silence in a typed session." In text mode the cover goes to a typing-indicator hint (THINKING_HINT_EVENT window event) instead of speech. 25067–25325. Uses lib/tutor/voice/ack-layer.ts, cover-layer.ts and bilingual-canned.ts.
- **Thinking cue.** Chime when a turn is accepted, a 200 ms poller drives a soft pulse while thinking, and the AudioContext is primed in the Start gesture. "GDI 2026-10-15." 25076–25108 and 31726–31741. Uses lib/tutor/voice/thinking-cue.ts and thinking-cue-audio.ts.
- **Bridge line.** Fixed first words spoken by the client at Start. Skipped if the opener was prefetched. Its audio is excluded from the turn counters via BRIDGE_AUDIO_WINDOW_MS (466). 1866–1880, 26766–26783, 30785–30834. Uses lib/tutor/voice/bridge-line.ts.
- **Spoken-math and number normalisation.** rewriteForTTS (tts-pronunciation.ts) runs in the hook and in the perception buffer. normaliseDigitsToWords applies to student transcripts in language lessons (25370–25385, digit-words.ts). Sentence stress / ttsTextTransform for language sessions (5333–5338, sentence-board.ts composeSpokenText) is pedagogy-adjacent.
- **Speaking rate.** setSpeakingRate ('slow'/'normal') is persisted in the evelyn:pacing-v2 blob and reported through onSpeakingRateChange. 4780–4783 and 5177–5184. Tenant speechRate goes in relayMode; mapping is in lib/tutor/voice/speech-rate.ts.
- **Tutor-voice mute.** Handle method setTutorVoiceMuted calls realtime.setVoiceMuted (zero-gain playback). 29876–29879.
- **Caption sync.** CaptionSyncTracker: beginAttempt per attempt (16048), registerSentence per sentence (18618), notifyDrain on audio drain (26762), markStreamEnd (25063). The handle's getSpokenCaption polls it with realtime.getSpokenProgress(). Ref at 2431–2434. Uses lib/tutor/voice/caption-sync.ts.
- **Wrap line and farewell lines.** Fixed client-spoken lines (see E). Uses lib/tutor/voice/timebox-lines.ts.

================================================================
D. BOARD AND RENDER SYNCHRONISATION WITH SPEECH
================================================================
- **onWhiteboardCommand wrapper.** Applies deferred removeItems that a batch owes before forwarding, and releases the display hold. 1820–1830. Uses lib/tutor/whiteboard/deferred-removals.ts.
- **Render buffer.** Since 2026-06-19, renders are validated and catalogued synchronously, but painting waits for the introducing sentence. Declared at 2424–2430.
- **dispatchVisualRef** (buffer or paint), 6658–6872.
  - Empty-batch guard (R1, 2026-09-07).
  - Pass-through when TUTOR_RENDER_SYNC is off.
  - Text mode paints on arrival: "2026-10-06b: cards waited 3–9 s for the stall timer."
  - The opening turn's first render bypasses the buffer: "R49: an empty board for 15–22 s."
  - Fallback-only board paints its first render now.
  - Async sketch hold.
  - Anchor and word-anchor keywords for pull-early and re-anchor.
  - Uses lib/tutor/whiteboard/render-sync.ts (shouldPaintOnArrivalInTextMode, shouldBypassRenderSync, flushableCount) and fallback-board.ts.
- **flushReadyRenders.** Driven by the TTS playback progress events sentence-start, word and drain. Sets the draw-on pace hint from the remaining sentence audio. 6365–6406.
- **Playback-progress hook-up** (in the useOpenAIRealtime config): sentence-start increments the played count. Pull-early: "2026-07-24: release a render whose name is spoken now." Word ticks drive word anchors. Drain releases the tail and flushes the deferred page. 26755–26853.
- **Stall timer** (armRenderStall). Flushes everything after RENDER_SYNC_STALL_MS of no progress, but keeps waiting while the tutor is speaking. "Task 46 §4." 6529–6548.
- **dropRenderBuffer.** On kill or abort, drops without painting and retracts catalog entries so a retry is not deduped against an unseen item. Aborts doodle fetches. 6873–6987.
- **flushAllRenderBuffer** (on resume or teardown): 6988–6994. Render buffer pause is set at cancel time and cleared by the watchdogs.
- **Async sketch.** show_sketch is fetched from /api/tutor/sketch and resolves into the buffer; stale results are dropped. 6549–6657.
- **Deferred page flush at turn end.** Triggered by the drain event or speech ending. 6408–6528 and 27514–27515. Uses lib/tutor/whiteboard/deferred-page-flush.ts. Its timing rules are pedagogy-entangled.
- **Auto new page.** decidePageForBatch produces a synthetic newPage plus catalog.openPage. 10060–10200. Uses lib/tutor/whiteboard/page-grouping.ts and page-title.ts.
- **Dedup and scroll-to-existing.**
  - Signature dedup of show_* calls drops duplicates and scrolls to the existing item when it is buried or on another page. "2026-04-25 #1; session-1783693044096." 10465–10560. Uses lib/tutor/whiteboard/catalog.ts (buildShowSignature, WhiteboardCatalog) and dedup-scroll.ts.
  - Duplicate-params drop: around 7140.
  - Within-batch dual-emit dedup: around 9994.
- **list_whiteboard_features query.** onQueryFeatures answers from the catalog. 26702–26723.
- **Resume board seed.** Restored commands are sent with meta { resumeSeed: true } so parents accept them once. Seeds the catalog and the id counters. 12307–12370. Uses lib/tutor/whiteboard/resume-seed.ts. The props doc at 945–950 explains the meta.
- **Dev hooks.** window.__tutorRenderBuffer and force-flush. Around 29678–29700.

================================================================
E. SESSION LIFECYCLE
================================================================
- **Mount and connect.**
  - buildInstructions effect (system prompt; mostly pedagogy) at 29965–30278, setting isInitialized.
  - realtime.prefetchToken() on mount, "saves 500–1500 ms". 30280–30286.
  - realtime.connect() only once instructions are ready, because OpenAI closes an unconfigured WS. 30288–30296.
- **Start tap** (handleMicClick, 30624–31025).
  - Text mode focuses the composer.
  - Standby: onStudentWake('mic').
  - Typed-first tap (resolveTypedFirstMicTap). "2026-10-03: a first mic tap sent a second [start lesson]."
  - resolveStartTap returns one of: resume-continue, stop-listening, interrupt, start, queue-start or none. "2026-08-17 portal-96a436f0: dead pre-start tap."
  - The start branch latches hasStarted, stamps voiceSessionStartedAtMsRef, and calls onSessionStarted.
  - It sets isWarmingUp and the warmup overlay, arms the watchdog, calls unlockAudio, and runs the opener (bridge line, demo topic choice, fixed-script spoken opener, or [start lesson]/[start session]). The opener waits for the plan when TUTOR_OPENER_WAITS_FOR_PLAN is on.
  - Finally startListening unless muted.
  - Queued start: "R40 embed-1785808658013: a tap while still connecting died silently for 142 s." Completed by the effect at 31034–31045.
  - Uses /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/components/session/start-tap.ts and /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/session/resume-listen.ts.
- **micClickRef.** Keeps the handle's startSession pointed at the current closure. 31027–31032.
- **Gesture session start** (runGestureSessionStart). Shared by handle.sendTextMessage and pickAgendaItem. Stamps the clock, latches hasStarted, arms warmup, unlocks audio, and starts listening if connected. 29724–29783.
- **Agenda pick as first gesture.** resolveAgendaPickFailure fallbacks. 3488–3570.
- **Text or tutor_opens kickoff.** Waits up to 1.5 s for the profile GET, then sends [start lesson] or [start session]. Never on resume. 30376–30451. Uses session/text-kickoff.ts.
- **Warmup.**
  - isWarmingUp exit effects: 31518–31561.
  - Warmup watchdog: 20 s re-kick once with the stored kickoff, 40 s fail with a "Trouble starting" pill. R32 T9. 31573–31621. Uses cover-layer.ts (createWarmupState, decideWarmupAction).
  - Warmup overlay clears on the real audio start ('speaking') or on failure, and reports onWarmupOverlayChange. 31623–31638.
- **Opener prefetch.** Pre-start, the opener body is built through callBrainOnce prefetchOnly and POSTed with prefetch:true. "2026-10-18 GDI embed-1792338502233: 4.6 s first-sentence wait." Effect: 31769–~31815. Send: 15816–15838. Server cache: lib/tutor/voice/opener-prefetch.ts.
- **Opener retries.**
  - Network failure retries once after 1.5 s: "2026-09-05 portal-620a92a4: student sat 5 min."
  - A stalled opener with nothing shown retries once: "2026-10-08 text-mode partner."
  - 24767–24790.
- **Resume from checkpoint.**
  - Seed effect: transcript and board restored once. 12284–12436.
  - Position is applied in the plan-load effect (around 12438+).
  - resumeContinue sends the [Session-resumed…] kickoff, unlocks audio, and calls startListening. "portal-00fa1bb7: start_tap telemetry." "2026-10-04: student recording on resume." 30313–30374.
  - onResumeAwaitingTapChange: 31673–31678.
  - The stale-checkpoint prop only affects the prompt (pedagogy).
- **Idle nudge.** armIdleNudge stands down while standing by, while a pronunciation clip is armed, or after the lesson closed. Rechecks with logged postponement reasons (busy, hidden tab, wrap phase, hold). Dispatches a silent nudge directive. "Round-7g portal-b2fe010e 7.7 min dead air; 2026-10-03 229 s." Re-armed when a reply is delivered (27497–27518) and on onsets. 27180–27282. Uses lib/tutor/voice/idle-nudge.ts. The directive text is pedagogy; the timing machinery is not.
- **Time box.**
  - Hard-stop cap: with maxDurationExplicit, polls every 5 s against voiceSessionStartedAtMsRef (paused during standby). Ends with a spoken goodbye, or onEndSession('time_limit'). "Live 2026-07-30: a 2-min box ran 5+ min"; "2026-10-29 embed-1793240679836: cut mid-explanation." 30453–30500.
  - Wrap line: spoken once after sessionWrapMinutes when the floor is free; text mode posts it instead. 30502–30570. Uses lib/tutor/voice/timebox-lines.ts.
  - Long-session check-in and the realtime-WS rotation prompt and auto-rotation, legacy OpenAI-authored path only: rotation is not used in claude-brain mode ("2026-09-06"). handleResponseDone 11958–12010; handleContinueRotation and handleWrapUpRotation 31157–31212. The rotation prompt UI is at about 31973.
- **Lesson-close auto-end.** After the close, a quiet LESSON_CLOSE_AUTO_END_MS calls endSessionNow. Voice only; rechecks while busy. "embed-1792261973710: the mic ran 8.5 min past goodbye." 27152–27178. Uses lib/tutor/voice/lesson-close.ts.
- **End session** (endSessionNowRef, 31308–31397).
  - Idempotent via endingRef.
  - Clears lazy-pending, clearSpeechQueue and interrupt. "2026-07-11 round 3: hard-stop the playing node."
  - Optional farewell: seals the session (abort the brain, drop the queue, gate speech, mute the mic), appends to the transcript, then speaks after a bounded drain.
  - audioRecorder.finalize, not awaited.
  - Final profile commit (final + keepalive), bounded by FINAL_COMMIT_MAX_WAIT_MS = 3000 (56). "2026-09-05 portal-51b667f1."
  - waitForFarewell: up to 5 s in voice, 1.5 s in text. 31398–31417; constants 55–62.
  - Then onEndSession(reason).
  - Two-tap End confirm (3 s arm): "2026-07-26: one tap ended a 38 s demo." 1943–1955, JSX around 32390.
- **Pause and resume.** realtime.pause() and startListening. 31047–31057. The buttons are hidden in the JSX.
- **Host video / standby (GameClass integration).**
  - VTR itself sends no postMessage; the embed page does that (/Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor-portal/embed/page.tsx around 1826 and 1533). VTR's side is the props standby, videoHost, getLessonNow, getOpeningNote, onStudentWake, onResumeLesson and onMomentBanner, plus handle.deliverMoment.
  - Standby enter: abort the in-flight turn, gate speech, drop queued speech, cut the speaking sentence after 8 s, clear warmup and overlay, clear mid-utterance, releaseInput (release, not mute, so the recording indicator goes off), clear the idle nudge.
  - Standby leave: shift the clock anchor (shiftAnchor), startListening, arm the idle nudge.
  - 27284–27342. hostStandby is computed at 2487 (TUTOR_HOST_LESSON && standby).
  - Host-lesson pump: a 200 ms interval delivers a pending moment or fires resume_lesson after 600 ms of quiet. Moments are dropped if stale or the session never started (MOMENT_STALE_MS, MOMENT_PRESTART_HOLD_MS); resume times out after 60 s. 27344–27410. Uses lib/tutor/portal/host-lesson.ts.
  - Start while in standby releases the mic again. 31563–31571.
  - cancelResumeLesson: around 2496. Composer submit cancels a pending resume: 32043–32045.
- **Visibility and unload.**
  - pagehide sends a keepalive profile commit and clears the flush timer. 3203–3225.
  - visibilitychange to hidden, and unmount, persist the pacing blob. 5139–5150.
  - document.visibilityState === 'hidden' postpones the idle nudge (27196).
  - KEEPALIVE_MAX_BYTES = 60,000 (64); oversize keepalive is skipped (3050–3057).
  - No beforeunload, online or offline listeners.
- **Persistence (localStorage).**
  - 'evelyn-manual-mic' (1889, 5083–5084)
  - 'evelyn-first-session-tip-done' (1886, 15140)
  - `evelyn:pacing-v2:<planId>`: paceBias, difficultyBias, streaks, speakingRate, practiceOverride, 30-day TTL. Save at 5104–5133; restore at 12505–12598.
  - No sessionStorage.
- **Periodic saves.**
  - scheduleProfileFlush: 20 s debounce to commitSessionToProfile. 3110–3131.
  - commitSessionToProfile: POST /api/tutor/student-profile/:id with the x-embed-token header. Intermediate commits are deltas only; final adds transcript and summary. 2896–3070.
  - Transcript persistence is the parent's job through onTranscriptUpdate.
- **What it reports to the parent:** onTranscriptUpdate, onWhiteboardCommand, onStateChange, onVoiceStateChange (31743–31765), onTutorBusy (31680–31701), onInterruptedChange (31703–31709), onMicLevel, onListeningHint, onWarmupOverlayChange, onResumeAwaitingTapChange, onSessionStarted, onEndSession, onRelayReady, onStageNotice, onVoiceHiccup, onTranscriptionStatus, onError, onDebugEvent, onUsageUpdate, onBrainUsage, onTrackInteraction, plus the pedagogy callbacks listed in J.

================================================================
F. NETWORK RESILIENCE
================================================================
- **Brain stream stall guard** (R49, 2026-08-20, portal-2d53e403). A poll every 2 s aborts when there has been no SSE frame for too long. The window widens once a sentence has been spoken or a 'thinking' frame arrived. Any frame, including keepalives, refreshes it. Our own stall abort is told apart from a perception abort. 13108–13135 and 16881–16883. Uses lib/tutor/voice/brain-stall.ts.
- **HTTP 5xx retries.** Three retries at 1.5, 3 and 5 s; aborts exit immediately. "2026-07-24: a pm2 restart 502'd endpoints." Then an honest fallback: a text bubble for typed turns (setBrainReachable(false) in text mode), or a spoken line for voice. 15840–15913.
- **Server brain-unavailable honest fallback** (Task X10). 24443–24470. Retry logic is in lib/tutor/voice/brain-retry.ts on the server side.
- **Catch path.**
  - Abort classification: a perception abort or an opener superseded by typing stays silent.
  - Opener network retry once.
  - Stalled-opener retry once.
  - Error after a partial reply stays silent: "R47 3d portal-1349716e ERR_NETWORK_CHANGED."
  - decideStallRecovery: retry once, then an apology placed where the student is looking (text or voice). "2026-10-05 AP World; 2026-10-19 GAC Precalc."
  - Streaming entries are purged.
  - 24740–24860. The finally block clears the stall poll (24862+).
- **AbortController per brain call.** inFlightBrainAbortRef, used by perception kills, typed supersede, standby, farewell, cover give-up and pre-audio supersede. 15195–15205; ref doc 2034–2063.
- **90 s busy watchdog.** Resets the busy flag and re-dispatches queued text. 25828–25866.
- **Realtime socket.**
  - reconnectEnabled comes from NEXT_PUBLIC_TUTOR_REALTIME_RECONNECT (default off; "2026-05-18"). 12741–12747. Reconnect logic is inside useOpenAIRealtime with lib/tutor/voice/ws-recovery.ts.
  - The error banner is cleared once audio flows again: "Round-7 item 3 portal-b2fe010e." 31545–31553.
  - In text mode a realtime connect failure is not surfaced (shouldSurfaceRealtimeError; "2026-10-08"). 12113–12120. Uses lib/tutor/voice/typed-delivery.ts.
  - canSubmitTyped lets text mode submit without the realtime socket. 32062–32065.
- **Perception and Ink sockets.** Reconnects live in the hooks, not VTR. VTR only does disconnect then connect on a mic device switch (29537–29544).
- **Cancel storms.** See B: CancelStormGovernor and STOP_IMPERATIVE_RE bypass (27571–27578, 28789–28808), self-echo immunity, and the dedupe window.
- **Haiku classifier.** 3 s timeout, 5-failure / 60 s circuit breaker, fail-open to noise. 2035–2039 and 28511–28663.
- **Other bounded fetches.** Student-mark OCR has an 8 s abort (29913–29930). Sketch fetches are aborted on buffer drop.

================================================================
G. TELEMETRY
================================================================
- **onDebugEvent(type, message, data?).** Called directly about 1,050 times. onDebugEventRef (around 3443) is used in effects and closures that must not re-create. Plain modules publish window CustomEvents that VTR forwards: evelyn:playback-route, evelyn:shared-mic. The embed persists only allowlisted prefixes (embed page around 103–109).
- **Turn latency.**
  - A per-turn ledger is created at dispatch (25895–25897) or at perception eagerEnd (29385).
  - Marks: eagerEnd, turnEnd (27758–27770), brainFetch, firstSentence, firstTtsFetch (16191, ack and cover sites), firstAudio (on playback sentence-start, excluding bridge audio; 26763–26791).
  - emitTurnLatencyEvent at 731–740 emits 'turn_latency', or 'turn_latency_skipped' for negative anchors.
  - Uses lib/tutor/voice/turn-latency.ts.
- **Bridge audio latency event.** 26775.
- **Usage and cost.**
  - Legacy realtime: onUsageUpdate from handleResponseDone. 11668–11672.
  - Claude brain: onBrainUsage per stream attempt from the SSE 'done' usage, plus the 'cache_start' debug event. "A1 2026-07-08: brain sessions recorded $0." 20653–20725; doc 964–971.
- **Start/tap telemetry.** start_tap, start_queued, start_listening_* and so on, so swallowed taps are visible.
- **Dev hooks (non-prod).** window.__tutorForceFalseBargein, __tutorForceClassifierVerdict, __tutorForceKill, __tutorForceKillAfterRenders, __tutorRenderBuffer, __tutorPerceptionStage. 29555–29700 and 26655–26662.

================================================================
H. TEXT-MODE DIFFERENCES (sessionMode === 'text')
================================================================
- Mic is muted from the start; textSessionRef mirrors the mode. 1840–1843.
- No perception or Ink socket and no getUserMedia. 26898.
- useOpenAIRealtime runs with textMode:true (never auto-arms the mic, "Task 10 2026-09-19"). 26679.
- No pronunciation capture (1531), no mic re-acquire (26991), no lesson-close auto-end (27158), no mic-silent notice (12075, 27482), no opener prefetch (31784), no bridge line.
- Tutor audio is not recorded (decideTutorAudioCapture). Typically the provider is 'silent'.
- Start: an orb tap only focuses the composer and unlocks audio (30636–30640). The first typed submit latches hasStarted (32209–32220). Or the tutor opens via text kickoff (30376–30451).
- Composer: autoFocus, never disabled (brainReachable drives only the hint at 32342; "one-way-door" note at 32284–32289), and typing arms the idle nudge (32302).
- Covers become a visible typing-indicator line instead of speech (25286–25296).
- The render buffer paints on arrival (6706–6720).
- Brain HTTP errors and stalls render as text bubbles. setBrainReachable at 15881 and 15913.
- Realtime connect failures are not surfaced (12116), and submits do not wait for the socket (32065).
- Farewell waits 1.5 s instead of for playback (31406). The wrap line is posted, not spoken (30536).
- Brain request body carries inputMode:'text' and text-specific prechecks instead of voiceJudging (15569–15595). That is pedagogy.
- Standby and toggle paths skip startListening and releaseInput.

================================================================
I. HOOKS AND LIB MODULES VTR ALREADY DELEGATES TO
================================================================
Hooks, under /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/hooks/:
- **useOpenAIRealtime.ts** (4,386 lines). Realtime WS, relay mode, the TTS engine (Cartesia/OpenAI-mini/silent plus the ElevenLabs fallback), the audio queue and playback, mic capture via the shared mic, and recorder taps. API: connect, prefetchToken, start/stop listening, muteInput, releaseInput, interrupt, pause, speakText, clearSpeechQueue, dropQueuedSpeech, pauseSpeech, resumeSpeech, resumeSpeakText, getSpokenProgress, unlockAudio, setVoiceMuted, markInterrupted, signalBrainThinking (return block at 4354).
- **usePerceptionWS.ts.** OpenAI transcription-only perception WS: VAD events, energy window, mic level, setMuted.
- **useCartesiaInkWS.ts.** Ink 2 STT drop-in with partials, energy window and diagnostics.
- **useCartesiaSonicWS.ts.** Sonic TTS WS, used inside useOpenAIRealtime.
- **useAudioRecorder.ts.** Two-track PCM16 session recording and chunked upload to session-audio.
- **toolDefinitions.ts.** Whiteboard tool schemas and mapFunctionCallToCommand.
- **Not used by VTR:** useAudioCapture, useAudioPlayback, useTranscription, useGeminiLive, usePlanIndex.
- **External:** /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/hooks/useStudentPreferences.ts (profile preferences fetch).

Voice lib, under /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/voice/ (audio, perception and TTS only):
- **shared-mic.ts**: refcounted shared getUserMedia stream, device switch, re-acquire, track events. "Round-5 echo fix 2026-07-27."
- **playback-route.ts**: TTS playback routing for echo cancellation.
- **mic-reacquire.ts**: pure decision on when to re-acquire.
- **mic-devices.ts**: fallback mic picker.
- **bargein-gate.ts**: sustained-energy barge-in gate, adaptive threshold, deferred kill predicate.
- **bargein-pause.ts**: pause-first barge-in decision and self-voice scoring of partials.
- **cancel-storm.ts**: cancel-storm governor and STOP_IMPERATIVE_RE.
- **stage2-cancel-policy.ts**: lazy-cancel decision and duplicate transcript test.
- **stage2-restore.ts**: no-verdict timeout restore or resume decision.
- **perception-classifier.ts**: heuristic verdicts and self-voice scoring.
- **perception-watchdog.ts**: transcription watchdog decision, used by the hook.
- **stale-ink-final.ts**: Ink stale-final helper, used by the hook.
- **ink-turn-end.ts**: Ink turn-end timeout by language.
- **tts-script-buffer.ts**: self-voice script buffer with playback stamps.
- **transcript-filters.ts**: Whisper-hallucination and noise filter, non-Latin allowance.
- **utterance-hold.ts**: incomplete-utterance hold and merge.
- **late-tail.ts**: late-tail-of-own-answer decision.
- **dispatch-dedupe.ts**: exact-text dispatch dedupe window.
- **resume-from-cut.ts**: clause-tail resume after a cut.
- **speech-queue-boundary.ts**: finish-the-in-flight-sentence-on-kill helpers. Tied to kill/retry.
- **caption-sync.ts**: caption and TTS word sync.
- **tts-pronunciation.ts**: rewriteForTTS, notation to speech.
- **tts-language.ts**: per-sentence and quoted-span language split.
- **speech-rate.ts**: tenant speech rate.
- **resolve-tts-provider.ts**: provider selection, used by parents.
- **elevenlabs-voice-map.ts** and **tts-recovery.ts**: fallback voice and "say less".
- **sonic-ws.ts** and **pcm-stream.ts**: TTS transports, used by the hooks.
- **ws-recovery.ts**: WS error surfacing and foreground reconnect, used by the hooks.
- **turn-latency.ts**: latency ledger.
- **brain-stall.ts**: stall abort, stall recovery, opener stall retry.
- **brain-retry.ts**: server-side empty-stream retry decisions.
- **typed-delivery.ts**: canSubmitTyped and shouldSurfaceRealtimeError.
- **tutor-audio-capture.ts**: whether the tutor track is recorded.
- **resolve-session-mode.ts**: text or voice mode resolution.
- **thinking-cue.ts** and **thinking-cue-audio.ts**: chime and pulse state plus Web Audio sounds.
- **ack-layer.ts** and **cover-layer.ts**: latency cover, liveness, escalation, warmup watchdog state, noise nag, noise floor.
- **bridge-line.ts**: client-spoken first line.
- **opener-filler.ts** and **first-turn-runway.ts**: strip filler and runway phrases from the brain opener.
- **opener-prefetch.ts**: server-side opener cache.
- **idle-nudge.ts**: idle nudge timing and plan.
- **lesson-close.ts**: lesson-close auto-end timing. Also contains pedagogy.
- **timebox-lines.ts**: wrap and goodbye lines.
- **student-hold.ts**: hold requests. Partly pedagogy.
- **digit-words.ts**: digits to words for STT text.
- **bilingual-canned.ts**: localised canned lines.

Other separable modules:
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/whiteboard/ — render-sync.ts, deferred-removals.ts, deferred-page-flush.ts, catalog.ts, page-grouping.ts, page-title.ts, dedup-scroll.ts, resume-seed.ts, fallback-board.ts, kill-keep.ts (kill-keep is tied to kill/retry).
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/components/session/ — start-tap.ts, text-kickoff.ts, prestart-affordances.ts.
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/session/resume-listen.ts.
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/portal/host-lesson.ts — shiftAnchor and moment constants.
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/pronunciation/clip-capture.ts.
- RealtimeHandle and resume types: /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/orchestrator/types.ts.

================================================================
J. PROPS (792–1275) AND IMPERATIVE HANDLE
================================================================
Props by concern. Defaults are at 1395–1498.

- **Identity and context:** subject, topic, level, studentName, studentId, sessionId, sessionStartedAtMs, embedToken, sessionGoal, lessonPlanId, mockReview, lessonContext, inFlow (false), targetKind, checkpointStale (false), teacherPersona, isTrial (false), openScope (false), tutorOpens.
- **Transient prompt context (pedagogy):** socialMemory, progressDigest, lastOpener, readinessNote, practiceLocator, goalNote, segmentLabels, hasOpenQuestion.
- **Engine and audio config:** voice ('shimmer'), claudeBrainMode (false), useRealtimeV2 (false), validateToolCalls (false), ttsProvider ('realtime'), sessionMode ('voice'), silentSecondsPerWord, cartesiaVoiceId, cartesiaVoiceSpeed, tutorLanguages, speechRate, thinkingCue (false).
- **Per-partner feature switches:** openerPrefetch (false), lessonCloseAutoEnd (true), levelCheck (false), pronunciation (false).
- **Host and embed:** prewarm (false), onRelayReady, standby (false), videoHost (false), getLessonNow, onStudentWake, onResumeLesson, getOpeningNote, onMomentBanner.
- **Time box:** sessionMaxMinutes (30), sessionWrapMinutes, maxDurationExplicit (false).
- **Resume:** resumeState, onResumeAwaitingTapChange.
- **Core outputs:** onTranscriptUpdate, onWhiteboardCommand(commands, meta?), onStateChange, onError, onTranscriptionStatus, onEndSession(reason?), onDebugEvent, onTrackInteraction, onUsageUpdate, onBrainUsage.
- **Voice-state UI outputs:** onVoiceStateChange, onTutorBusy, onInterruptedChange, onMicLevel, onListeningHint, onWarmupOverlayChange, onSessionStarted, onStageNotice, onVoiceHiccup, onManualMicChange, onSpeakingRateChange.
- **Pedagogy and progress outputs:** onLessonClosed, onOpenerRecord, onMilestone, onHomeworkAssigned, onLessonPlanProgress, onHomeworkProgress, onHomeworkProblem, onLessonPlanLoadSettled, onPaceBiasChange, onDifficultyBiasChange, onPracticeStatsChange, onPracticeOverrideChange, onMockAgendaChange, onCompletedSegmentsChange.
- **Parent-provided actions:** refetchMockReview, onStudentInput, onControlMessage, onBeforeTypedSubmit, onProposePlanSwap, onConfirmPlanLos.
- **Chrome:** dockVariant ('default' | 'island'), captionSlot, composerSlot, hideEndButton (false).
- **Handle wiring:** handleRef (MutableRefObject<RealtimeHandle | null>).

Imperative handle, RealtimeHandle. Type in /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/lib/tutor/orchestrator/types.ts (lines 10–120). Assigned at 29784–29946; nulled on unmount at 29949.
- **startSession()**: runs handleMicClick synchronously (gesture-safe).
- **sendTextMessage(text, {image}?)**: a real (non-bracketed, or a board-action/agenda marker) send runs the gesture session start; it then goes through the typed hold to realtime.sendTextMessage({ typed }).
- **speakText(text)**, **stopSpeaking()** (clearSpeechQueue + interrupt).
- **getSessionSummary()**: topicsCovered, conceptsCovered, weakTopics, assignedPractice, practiceLocator.
- **stepPaceBias**, **setSpeakingRate**, **setPracticeOverride**, **setDifficultyBias**, **setManualMic**.
- **setTutorVoiceMuted**.
- **deliverMoment(directive, banner)**: host-lesson pump.
- **resumeContinue()**.
- **endSession({farewell?})**, **isEnding()**.
- **getSpokenCaption()**: claude-brain mode only.
- **pushStudentMark(ev)**: with OCR for writing gestures.

Parent usage:
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/components/session/TutorSession.tsx mounts VTR at line 1703 and types its props as ComponentProps<typeof VoiceTutorRealtime>. Handle methods used across the tutor apps: sendTextMessage (most), stopSpeaking, speakText, stepPaceBias, setSpeakingRate, setManualMic, setDifficultyBias, setPracticeOverride, resumeContinue, getSessionSummary, startSession, setTutorVoiceMuted, pushStudentMark, getSpokenCaption, endSession.
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor-portal/embed/page.tsx renders TutorSession (2404) and imports RealtimeHandle, TutorMilestone and TutorResumeState from VTR's re-exports (VTR 553). It owns the evelyn:* postMessages: standby, session_ended, host_end handling.
- /Users/luke/Dev/evelynlearning/.claude/worktrees/tutor-fixes/apps/tutor/src/app/tutor/page.tsx also mounts VTR directly at 2968, plus TutorSession at 2379. That is a third parent you did not list.
- I could not confirm a caller for isEnding or deliverMoment in .tsx files; my grep for them returned nothing usable, so treat that as unclear.
- VTR also re-exports isMuteMeCommand (554–555).

Unclear or not covered:
- The internals of useOpenAIRealtime's speech queue, the TTS fallback ladder, reconnect, and the iOS AudioContext unlock are in the hook and only skimmed here.
- The large sentence and tool-call handlers inside callBrainOnce (16900–20650) mix mechanics with pedagogy; I mapped only the mechanical anchors listed above.
```
