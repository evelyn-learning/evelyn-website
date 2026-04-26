/**
 * Post-emit validator for show_circuit netlists. Catches structural
 * errors (broken loop, mis-wired ammeter, cardinality mismatch) and
 * returns a structured rejection the model can recover from on retry.
 *
 * Philosophy: the model knows physics. We only check things mechanically
 * verifiable from the netlist + the student's request. Each rejection
 * includes a one-sentence "what to do" hint — no examples, no JSON.
 */

export interface CircuitComponent {
  type: string;
  from: string;
  to: string;
  value?: string;
  unit?: string;
  label?: string;
}

export interface CircuitValidationResult {
  ok: boolean;
  reason?: string;
}

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

const COMPONENT_PLURAL_TO_TYPE: Record<string, string> = {
  resistor: 'resistor', resistors: 'resistor',
  capacitor: 'capacitor', capacitors: 'capacitor',
  inductor: 'inductor', inductors: 'inductor',
  battery: 'battery', batteries: 'battery', cell: 'battery', cells: 'battery',
  bulb: 'bulb', bulbs: 'bulb', lamp: 'bulb', lamps: 'bulb',
  ammeter: 'ammeter', ammeters: 'ammeter',
  voltmeter: 'voltmeter', voltmeters: 'voltmeter',
  switch: 'switch-open', switches: 'switch-open',
};

/** Parse "three resistors", "5 batteries" etc. from a free-text request. */
function extractRequestedCounts(text: string): Map<string, number> {
  const out = new Map<string, number>();
  const re = /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+([a-z]+)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const numTok = m[1].toLowerCase();
    const nounTok = m[2].toLowerCase();
    const n = NUMBER_WORDS[numTok] ?? Number(numTok);
    if (!Number.isFinite(n) || n <= 0) continue;
    const type = COMPONENT_PLURAL_TO_TYPE[nounTok];
    if (!type) continue;
    out.set(type, n);
  }
  return out;
}

function buildAdjacency(components: CircuitComponent[]): Map<string, Array<{ to: string; comp: CircuitComponent }>> {
  const adj = new Map<string, Array<{ to: string; comp: CircuitComponent }>>();
  for (const c of components) {
    if (!adj.has(c.from)) adj.set(c.from, []);
    if (!adj.has(c.to)) adj.set(c.to, []);
    adj.get(c.from)!.push({ to: c.to, comp: c });
    adj.get(c.to)!.push({ to: c.from, comp: c });
  }
  return adj;
}

/** True if every component is reachable from at least one battery via
 * non-self-loops. Disconnected components fail this check. */
function isReachableFromBattery(components: CircuitComponent[]): boolean {
  const batteries = components.filter((c) => c.type === 'battery');
  if (batteries.length === 0) return true; // can't check without a source
  const adj = buildAdjacency(components);
  const visited = new Set<string>();
  const queue: string[] = [batteries[0].from, batteries[0].to];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const { to } of adj.get(node) ?? []) {
      if (!visited.has(to)) queue.push(to);
    }
  }
  return components.every((c) => visited.has(c.from) && visited.has(c.to));
}

/** Every battery node should appear on at least 2 components (otherwise
 * the battery is dangling — current has nowhere to flow). */
function batteryFormsLoop(components: CircuitComponent[]): boolean {
  const batteries = components.filter((c) => c.type === 'battery');
  if (batteries.length === 0) return true;
  const nodeDegree = new Map<string, number>();
  for (const c of components) {
    nodeDegree.set(c.from, (nodeDegree.get(c.from) ?? 0) + 1);
    nodeDegree.set(c.to, (nodeDegree.get(c.to) ?? 0) + 1);
  }
  for (const b of batteries) {
    if ((nodeDegree.get(b.from) ?? 0) < 2) return false;
    if ((nodeDegree.get(b.to) ?? 0) < 2) return false;
  }
  return true;
}

/** Find ammeters that share BOTH endpoints with a non-wire/non-meter
 * component on the same pair of nodes — that's a parallel short, not
 * an inline measurement. */
function ammetersAreInline(components: CircuitComponent[]): { ok: true } | { ok: false; offending: CircuitComponent } {
  const ammeters = components.filter((c) => c.type === 'ammeter' || c.type === 'galvanometer');
  for (const a of ammeters) {
    const aPair = [a.from, a.to].sort().join('|');
    for (const c of components) {
      if (c === a) continue;
      if (c.type === 'wire') continue;
      if (c.type === 'ammeter' || c.type === 'galvanometer') continue;
      const cPair = [c.from, c.to].sort().join('|');
      if (cPair === aPair) {
        return { ok: false, offending: a };
      }
    }
  }
  return { ok: true };
}

/**
 * Run all structural checks on a netlist + the student's last request.
 * Returns ok or a one-sentence reason the model can act on.
 */
export function validateCircuit(
  components: CircuitComponent[],
  studentText: string,
): CircuitValidationResult {
  if (!Array.isArray(components) || components.length === 0) {
    return { ok: false, reason: 'show_circuit was called with no components.' };
  }

  // Cardinality match against the student's stated count.
  const requested = extractRequestedCounts(studentText || '');
  for (const [type, expected] of requested) {
    const actual = components.filter((c) => c.type === type).length;
    if (actual !== expected) {
      return {
        ok: false,
        reason: `Student asked for ${expected} ${type}${expected === 1 ? '' : 's'}, but ${actual} ${type}${actual === 1 ? '' : 's'} were emitted. Re-emit show_circuit with exactly ${expected} ${type}${expected === 1 ? '' : 's'}.`,
      };
    }
  }

  // Closed-loop / connectivity.
  if (!batteryFormsLoop(components)) {
    return {
      ok: false,
      reason: 'A battery has a node with degree 1 — current has no return path. Make sure every battery node is also touched by at least one other component so the loop closes.',
    };
  }
  if (!isReachableFromBattery(components)) {
    return {
      ok: false,
      reason: 'One or more components are disconnected from the battery. Re-emit so every component is reachable from the battery through wires or other components.',
    };
  }

  // Ammeter inline check.
  const inline = ammetersAreInline(components);
  if (!inline.ok) {
    const a = inline.offending;
    return {
      ok: false,
      reason: `Ammeter (${a.label || a.type}) shares both nodes with another component — that wires it in parallel, not inline. Add an extra mid-node so the ammeter is in series with the component whose current it measures.`,
    };
  }

  return { ok: true };
}
