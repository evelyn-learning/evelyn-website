/**
 * Biology — Unit 8 CED 8.2: Phylogenetic Trees & Cladograms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.phylogenetics-cladograms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U8_PHYLOGENETICS_CLADOGRAMS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.phylogenetics-cladograms.v1',
  course: 'Biology',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Phylogenetic Trees & Cladograms',
  planId: 'evelyn.hs.bio.phylogenetics-cladograms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.phylogenetics-cladograms.v1' }],
  theory: [
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'What the diagram is', content: `WHAT THE DIAGRAM IS — a cladogram is a branching diagram of ancestry. The TIPS at the ends are the groups being compared (living species, usually). The internal BRANCH POINTS, called nodes, are common ancestors. Every line is a lineage travelling forward through time.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'A node is a split', content: `A NODE IS A SPLIT — each node marks the moment one ancestral lineage divided into two that stopped exchanging genes. The node itself is the most recent common ancestor of everything above it.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'Relatedness is read from the most recent shared node', content: `RELATEDNESS IS READ FROM THE MOST RECENT SHARED NODE — to compare two tips, trace back from each until the paths meet. The pair whose paths meet at the more recent node (closer to the tips) is the more closely related pair. This single move answers every relatedness question.` },
    { loId: 'bio.phylogenetics-cladograms', content: `THE PAGE LIES: TIP PROXIMITY MEANS NOTHING — a cladogram can be ROTATED at any node, like a hanging mobile, without changing a single relationship. Rotate one node and two tips that were side by side end up at opposite ends. Because the tip order can be rearranged freely, "drawn next to" never means "closely related." This is the number-one error in the unit.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'Derived characters sit on branches', content: `DERIVED CHARACTERS SIT ON BRANCHES — a character mark placed on a branch means the trait evolved once in that lineage, so EVERY group above the mark inherits it. Characters shared by two or more tips are what define groups; a character found in only one tip groups nothing.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'The outgroup', content: `THE OUTGROUP — the group that branches off at the very base, lacking the derived characters the others share. It is the baseline that tells you which character state is ancestral and which is derived, so the rest of the tree has something to be measured against.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'Building a tree from a character table', content: `BUILDING A TREE FROM A CHARACTER TABLE — rank the derived characters by how many species share them. The most widely shared character marks the DEEPEST node; the next most widely shared marks the next node up, and so on. Work outward from the base to the tips.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'framework', title: 'Not a ladder, and no tip descends from another tip', content: `NOT A LADDER, AND NO TIP DESCENDS FROM ANOTHER TIP — the tree does not rank species from primitive to advanced, and the group drawn last is not the "most evolved." Every living tip has been evolving for exactly the same amount of time since any shared node. Living tips are cousins; none of them is another one's ancestor.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'definition', title: 'node', content: `a branch point on a tree, representing the most recent common ancestor of everything above it.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'definition', title: 'derived character', content: `a trait that evolved in one lineage and is inherited by all descendants of that lineage.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'definition', title: 'outgroup', content: `the group branching off at the base, lacking the derived characters, used as a baseline for comparison.` },
    { loId: 'bio.phylogenetics-cladograms', kind: 'definition', title: 'clade', content: `a node plus every descendant of that node — an ancestor and all of its offspring lineages.` },
  ],
  methods: [
    {
      title: 'Worked read relatedness',
      steps: [
        `Rebuild the branch points from the description. Node 1 (deepest) separates the lamprey from everything else. Node 2 separates the shark from a lineage that continues upward. Node 3 splits that lineage into the lizard and the mouse.`,
        'Trace back from the shark and the lizard: their paths first meet at node 2.',
        `Trace back from the shark and the mouse: their paths also first meet at node 2 — the SAME node, because node 2 gave rise to the shark on one side and to the whole lizard-plus-mouse lineage on the other.`,
        `Since both comparisons land on the identical most recent common ancestor, the shark is exactly as closely related to the lizard as it is to the mouse. The lizard and mouse are the ones that are closer to each other, meeting at the more recent node 3.`,
        `Check the trap: the shark is DRAWN beside the lizard, which tempts you to pick the lizard. Rotate node 3 and the tips read lamprey, shark, mouse, lizard, with every relationship untouched — proof that the drawing order carried no information.`,
      ],
      example: { problem: `A cladogram compares four animals. The lamprey branches off first. The remaining lineage then splits into the shark and a branch that later splits into the lizard and the mouse. Reading the tips across the page they are drawn in the order lamprey, shark, lizard, mouse. Is the shark more closely related to the lizard, or to the mouse?`, solution: `Equally related to both — the shark's most recent common ancestor with the lizard is the very same node it shares with the mouse.` },
      relatedLoIds: ['bio.phylogenetics-cladograms'],
    },
    {
      title: 'Worked build from characters',
      steps: [
        `Find the outgroup: the lancelet has none of the derived characters, so it branches off at the base and sets the baseline for what counts as ancestral.`,
        `Count how many species share each character: backbone = 3 (salmon, frog, lizard); four limbs = 2 (frog, lizard); amniotic egg = 1 (lizard only).`,
        `The most widely shared derived character marks the DEEPEST node. Place "backbone" on the branch above the lancelet split, so the salmon, frog, and lizard form one group. The salmon has nothing beyond the backbone, so it branches off next.`,
        `The next character up is "four limbs," shared by the frog and the lizard. It marks the node those two share, so the remaining lineage splits into the frog and the lizard.`,
        `The amniotic egg appears in the lizard alone, so it sits on the lizard's own branch and groups nothing — a character in a single species never defines a node.`,
        `Assemble the order: lancelet splits off first, then the salmon, and the last node splits the frog from the lizard.`,
      ],
      example: { problem: `Four animals are scored for three characters. The lancelet has none of them. The salmon has a backbone. The frog has a backbone and four limbs. The lizard has a backbone, four limbs, and an amniotic (shelled) egg. Work out the branching order and say which two are most closely related.`, solution: `Branching order: lancelet, then salmon, then a final split between frog and lizard. The frog and the lizard are most closely related — they share the most recent node, the one marked by four limbs.` },
      relatedLoIds: ['bio.phylogenetics-cladograms'],
    },
  ],
  pointers: [
    { content: `Trace back from the crocodile: the first node you reach is shared with the BIRDS. The lizards join only at the deeper node below that, so crocodiles and birds are each other's closest relatives here — which is exactly the evidence behind the claim that birds are dinosaurs. The drawing proves the point on its own: rotate that upper node and the tips read lizards, birds, crocodiles, with the ancestry completely unchanged. Read the nodes, never the spacing.`, kind: 'common-error' },
    { content: `Tips are the groups compared; nodes are common ancestors, and each node is a split into two lineages.`, kind: 'tip' },
    { content: `Relatedness = how RECENT the shared node is. Trace back from both groups and see where the paths meet.`, kind: 'tip' },
    { content: `Tip order carries no information — any node can be rotated, so "drawn next to" never means "closely related."`, kind: 'tip' },
    { content: `A derived character marked on a branch is inherited by every group above it; shared derived characters define groups, and a character in one group alone defines nothing.`, kind: 'tip' },
    { content: `The outgroup lacks the derived characters and branches off at the base, setting the baseline. A tree branches, it does not rank: living tips are cousins, never one another's ancestors.`, kind: 'tip' },
    { content: `Never judge relatedness by how close two tips are drawn. Any node can be rotated like a mobile without changing a single relationship. Always trace back to the shared node instead — this is the #1 error in the unit.`, kind: 'common-error' },
    { content: `When one branch splits off *before* a pair, it is equally related to BOTH members of that pair. Shark vs. lizard and shark vs. mouse trace to the same node, so 'equally related' is a legitimate answer — don't force a single winner.`, kind: 'edge-case' },
    { content: `A derived character found in only ONE species (amniotic egg in the lizard alone) sits on that species' own branch and defines no group. Only characters shared by two or more tips mark a node.`, kind: 'gotcha' },
    { content: `Order characters by how MANY species share them, not by the order listed in the table. Most widely shared = deepest node, closest to the base; least shared = nearest the tips.`, kind: 'tip' },
    { content: `Use 'node' for a branch point (a common ancestor) and 'tip' for a group being compared. Don't say a tip 'evolved from' another tip — living tips are cousins. No modern species is another modern species' ancestor.`, kind: 'vocab-note' },
    { content: `A cladogram is not a ranking. The tip drawn last is not 'most evolved' or 'most advanced' — every living tip has been evolving for exactly the same time since any shared node.`, kind: 'common-error' },
    { content: `The outgroup is defined by LACKING the shared derived characters, not by being 'oldest' or 'most primitive.' It's the baseline that tells you which state is ancestral — it's still a living group evolving today.`, kind: 'vocab-note' },
    { content: `A character mark on a branch means the trait evolved once there and is inherited by EVERY group above it — including groups that may have later lost or modified it. Read marks downward from a tip to list its traits.`, kind: 'gotcha' },
  ],
};
