/**
 * Embed token → teacher persona + voice, with partner-friendly shorthands:
 *
 *  - `teacher: "ms-priya-nair"` — a catalogue persona by its id (the house
 *    personas in DEMO_TEACHERS); unknown id ⇒ no persona (default voice).
 *  - `teacher: {…, voice: "maple"}` — a persona whose voice is a VOICE CODE.
 *    The old shape `voice: {provider, voiceId}` still works unchanged.
 *  - `voice: "maple"` at the top level — the session's voice, whatever the
 *    persona says (voice and persona are chosen separately). A top-level
 *    `voice` that is not a code keeps its old meaning (a realtime voice name).
 *
 * Never throws, never rejects: a partner typo falls back to the default voice
 * and is reported in `notes` for the session's debug trail.
 */
import { DEMO_TEACHERS, type TeacherPersonaWire } from '@core/ai/teacher-persona';
import { isVoiceCode, voiceIdForCode } from '@core/voice/voice-codes';

export interface ResolvedEmbedPersona {
  teacher?: TeacherPersonaWire;
  /** Voice id chosen by a top-level voice code; wins over the persona's voice. */
  voiceOverrideId?: string;
  /** For the debug trail: what was resolved, and any fallbacks. */
  notes: string[];
}

function catalogueTeacher(id: string): TeacherPersonaWire | undefined {
  const key = id.trim().toLowerCase();
  return DEMO_TEACHERS.find((t) => t.id === key);
}

export function resolveEmbedPersona(raw: { teacher?: unknown; voice?: unknown }): ResolvedEmbedPersona {
  const notes: string[] = [];
  let teacher: TeacherPersonaWire | undefined;

  if (typeof raw.teacher === 'string' && raw.teacher.trim()) {
    teacher = catalogueTeacher(raw.teacher);
    notes.push(teacher ? `teacher=${teacher.id} (catalogue)` : `teacher_unknown="${raw.teacher.slice(0, 40)}"`);
  } else if (raw.teacher && typeof raw.teacher === 'object' && !Array.isArray(raw.teacher)) {
    const t = raw.teacher as Omit<TeacherPersonaWire, 'voice'> & { voice?: unknown };
    if (typeof t.voice === 'string') {
      const code: string = t.voice;
      const id = voiceIdForCode(code);
      notes.push(id ? `teacher_voice=${code.trim().toLowerCase()}` : `teacher_voice_unknown="${code.slice(0, 40)}"`);
      const { voice: _code, ...rest } = t;
      teacher = id ? { ...rest, voice: { provider: 'cartesia', voiceId: id } } : rest;
    } else {
      teacher = t as TeacherPersonaWire;
    }
    notes.push(`teacher=${typeof t.id === 'string' ? t.id.slice(0, 40) : 'custom'}`);
  }

  let voiceOverrideId: string | undefined;
  if (isVoiceCode(raw.voice)) {
    voiceOverrideId = voiceIdForCode(raw.voice) ?? undefined;
    notes.push(`voice=${raw.voice.trim().toLowerCase()}`);
  }
  return { teacher, voiceOverrideId, notes };
}
