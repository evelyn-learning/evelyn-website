'use client';

/**
 * Dev-only voice harness dashboard (spec Phase 1).
 * TTS tab: utterance × voice listening matrix (grouped by accent) with
 * TTFA chips and pass/maybe/fail verdicts (localStorage) + JSON export.
 * STT tab: accent × engine WER table with per-clip transcript vs reference.
 * Disabled outside development.
 */

import React, { useEffect, useMemo, useState } from 'react';

const API = '/api/tutor/voice-harness';

interface TtsClip { clipId: string; label: string; accent: string; technique: string; utteranceId: string; file: string; ttfaMs: number; totalMs: number; error?: string }
interface TtsManifest { runId: string; utterances: { id: string; style: string; tts: string }[]; clips: TtsClip[] }
interface SttClip { clipId: string; accent: string; engine: string; reference: string; transcript: string; wer: number; finalLatencyMs: number; error?: string }
interface SttResults { runId: string; engines: string[]; clips: SttClip[] }

type Verdict = 'pass' | 'maybe' | 'fail' | '';

export default function VoiceHarnessPage() {
  const [runs, setRuns] = useState<{ tts: string[]; stt: string[] }>({ tts: [], stt: [] });
  const [tab, setTab] = useState<'tts' | 'stt'>('tts');
  const [ttsRun, setTtsRun] = useState('');
  const [sttRun, setSttRun] = useState('');
  const [manifest, setManifest] = useState<TtsManifest | null>(null);
  const [stt, setStt] = useState<SttResults | null>(null);
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/index`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then((d) => {
      setRuns(d);
      if (d.tts?.[0]) setTtsRun(d.tts[0]);
      if (d.stt?.[0]) setSttRun(d.stt[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!ttsRun) return;
    fetch(`${API}/tts/${ttsRun}/manifest.json`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then(setManifest).catch(() => setManifest(null));
    try { setVerdicts(JSON.parse(localStorage.getItem(`voiceHarnessVerdicts:${ttsRun}`) ?? '{}')); } catch { setVerdicts({}); }
  }, [ttsRun]);

  useEffect(() => {
    if (!sttRun) return;
    fetch(`${API}/stt/${sttRun}/results.json`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then(setStt).catch(() => setStt(null));
  }, [sttRun]);

  const setVerdict = (voiceLabel: string, v: Verdict) => {
    const next = { ...verdicts, [voiceLabel]: v };
    setVerdicts(next);
    try { localStorage.setItem(`voiceHarnessVerdicts:${ttsRun}`, JSON.stringify(next)); } catch { /* quota/private mode: keep in-memory verdict */ }
  };

  const voices = useMemo(() => {
    if (!manifest) return [];
    const seen = new Map<string, TtsClip>();
    for (const c of manifest.clips) if (!seen.has(c.label)) seen.set(c.label, c);
    return [...seen.values()].sort((a, b) => a.accent.localeCompare(b.accent) || a.label.localeCompare(b.label));
  }, [manifest]);

  const sttTable = useMemo(() => {
    if (!stt) return [];
    const byAccent = new Map<string, Map<string, { wer: number[]; lat: number[] }>>();
    for (const c of stt.clips) {
      if (!byAccent.has(c.accent)) byAccent.set(c.accent, new Map());
      const m = byAccent.get(c.accent)!;
      if (!m.has(c.engine)) m.set(c.engine, { wer: [], lat: [] });
      m.get(c.engine)!.wer.push(c.wer);
      if (c.finalLatencyMs >= 0) m.get(c.engine)!.lat.push(c.finalLatencyMs);
    }
    const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
    return [...byAccent.entries()].map(([accent, m]) => ({
      accent,
      cells: [...m.entries()].map(([engine, v]) => ({ engine, wer: avg(v.wer), lat: avg(v.lat) })),
    }));
  }, [stt]);

  if (process.env.NODE_ENV !== 'development') {
    return <div style={{ padding: 40, fontFamily: 'monospace' }}>voice-harness is dev-only.</div>;
  }

  const cellStyle: React.CSSProperties = { border: '1px solid #ddd', padding: 6, verticalAlign: 'top', fontSize: 13 };

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>Voice Harness</h1>
      <div style={{ margin: '12px 0' }}>
        <button onClick={() => setTab('tts')} style={{ fontWeight: tab === 'tts' ? 700 : 400, marginRight: 12 }}>TTS listening</button>
        <button onClick={() => setTab('stt')} style={{ fontWeight: tab === 'stt' ? 700 : 400 }}>STT results</button>
      </div>

      {tab === 'tts' && (
        <>
          <div style={{ marginBottom: 12 }}>
            run:{' '}
            <select value={ttsRun} onChange={(e) => setTtsRun(e.target.value)}>
              {runs.tts.map((r) => <option key={r}>{r}</option>)}
            </select>{' '}
            <button onClick={() => {
              const blob = new Blob([JSON.stringify({ run: ttsRun, verdicts }, null, 2)], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `voice-verdicts-${ttsRun}.json`;
              a.click();
            }}>export verdicts</button>
          </div>
          {manifest && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={cellStyle}>utterance</th>
                    {voices.map((v) => (
                      <th key={v.label} style={cellStyle}>
                        <div>{v.label}</div>
                        <div style={{ color: '#666', fontWeight: 400 }}>{v.accent} · {v.technique}</div>
                        <select value={verdicts[v.label] ?? ''} onChange={(e) => setVerdict(v.label, e.target.value as Verdict)}>
                          <option value="">—</option><option value="pass">pass</option>
                          <option value="maybe">maybe</option><option value="fail">fail</option>
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {manifest.utterances.map((u) => (
                    <tr key={u.id}>
                      <td style={{ ...cellStyle, maxWidth: 260 }}>
                        <b>{u.id}</b> <span style={{ color: '#666' }}>({u.style})</span>
                        <div style={{ color: '#444' }}>{u.tts}</div>
                      </td>
                      {voices.map((v) => {
                        const clip = manifest.clips.find((c) => c.label === v.label && c.utteranceId === u.id);
                        return (
                          <td key={v.label + u.id} style={cellStyle}>
                            {clip && !clip.error ? (
                              <>
                                <audio controls preload="none" style={{ width: 170 }}
                                  src={`${API}/tts/${ttsRun}/${clip.file}`} />
                                <div style={{ color: '#666' }}>ttfa {clip.ttfaMs}ms</div>
                              </>
                            ) : <span style={{ color: '#c00' }}>{clip?.error ? 'error' : '—'}</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'stt' && (
        <>
          <div style={{ marginBottom: 12 }}>
            run:{' '}
            <select value={sttRun} onChange={(e) => setSttRun(e.target.value)}>
              {runs.stt.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          {stt && (
            <>
              <table style={{ borderCollapse: 'collapse', marginBottom: 20 }}>
                <thead>
                  <tr><th style={cellStyle}>accent</th>{stt.engines.map((e) => <th key={e} style={cellStyle}>{e}</th>)}</tr>
                </thead>
                <tbody>
                  {sttTable.map((row) => (
                    <tr key={row.accent}>
                      <td style={cellStyle}><b>{row.accent}</b></td>
                      {stt.engines.map((e) => {
                        const c = row.cells.find((x) => x.engine === e);
                        return (
                          <td key={e} style={cellStyle}>
                            {c && !Number.isNaN(c.wer) ? `${(c.wer * 100).toFixed(1)}% WER · ${Number.isNaN(c.lat) ? '—' : Math.round(c.lat) + 'ms'}` : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <h3 style={{ fontSize: 15 }}>Per-clip transcripts</h3>
              {stt.clips.map((c) => (
                <div key={c.clipId + c.engine} style={{ borderTop: '1px solid #eee', padding: '6px 0' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === c.clipId + c.engine ? null : c.clipId + c.engine)}>
                    <b>{c.clipId}</b> · {c.engine} · {(c.wer * 100).toFixed(1)}% {c.error ? '· ERROR' : ''}
                  </div>
                  {expanded === c.clipId + c.engine && (
                    <div style={{ fontSize: 13, paddingLeft: 12 }}>
                      <div><span style={{ color: '#666' }}>ref:</span> {c.reference}</div>
                      <div><span style={{ color: '#666' }}>hyp:</span> {c.transcript || <i>(empty)</i>}</div>
                      {c.error && <div style={{ color: '#c00' }}>{c.error}</div>}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
