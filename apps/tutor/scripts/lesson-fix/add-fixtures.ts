/**
 * Test support: a synthetic, valid writer file for a pack. The text is
 * placeholder text for the tooling tests — never lesson content.
 */
import type { AddPack } from './add-core';

export function syntheticWritten(pack: AddPack): Record<string, unknown> {
  return {
    pack: pack.pack,
    planId: pack.planId,
    pickerPlanId: pack.pickerPlanId,
    objectives: pack.missingObjectives.map((m) => ({
      loId: m.id,
      segments: [
        { id: `${m.id}-hook`, kind: 'hook', goal: `Synthetic hook for objective ${m.number} of pack ${pack.pack}.` },
        {
          id: `${m.id}-concept`,
          kind: 'concept',
          goal: `Synthetic concept goal for objective ${m.number}.`,
          keyIdeas: [`First synthetic idea ${m.number}.`, `Second synthetic idea ${m.number} with x² − 1.`, `Third synthetic idea ${m.number}.`],
        },
        {
          id: `${m.id}-worked`,
          kind: 'worked_example',
          problem: `Synthetic worked problem ${pack.pack}-${m.number}: add ${m.number} and 10.`,
          steps: [`Write ${m.number} + 10.`, `Add the ones.`, `Result ${m.number + 10}.`],
          answer: `${m.number + 10}`,
        },
        {
          id: `${m.id}-try`,
          kind: 'try_yourself',
          problem: `Synthetic practice ${pack.pack}-${m.number}: what is ${m.number} times 100, in metres?`,
          expectedAnswer: `${m.number * 100}`,
        },
      ],
      check: `python: ${m.number} + 10 = ${m.number + 10}; ${m.number} * 100 = ${m.number * 100}`,
    })),
  };
}
