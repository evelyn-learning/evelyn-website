/**
 * Biology — Evolution: Phylogenetic Trees & Cladograms.
 *
 * The diagram-reading template for the HS Biology fan-out (NGSS HS-LS4-1).
 * Almost every error here is the same error wearing a different hat: reading
 * the PICTURE (which tips sit next to each other, which tip is drawn last)
 * instead of the NODES. Every tree in this plan is therefore described
 * entirely in words, and the concept segment is organized around "trace back
 * to the shared node" as the one move that always works.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U8_PHYLOGENETICS_CLADOGRAMS: LessonPlan = {
  id: 'evelyn.hs.bio.phylogenetics-cladograms.v1',
  title: 'Phylogenetic Trees & Cladograms',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.phylogenetics-cladograms',
      standard: 'BIO-8.2',
      description:
        'Interpret a cladogram to determine evolutionary relationships from the most recent common ancestor and shared derived characters, and construct a simple branching order from a table of characters (NGSS HS-LS4-1).',
    },
  ],
  prerequisites: ['bio.taxonomy-classification'],
  followUps: ['bio.domains-kingdoms-diversity'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the cladogram as the working tool behind outbreak tracing and the birds-are-dinosaurs result.',
      script:
        'When a new outbreak starts, the first thing epidemiologists do is sequence the virus and put it on a tree. Where the new sample lands tells them which animal it jumped from and roughly when. The same kind of tree settled a far older argument: when you score the skeletons, birds fall INSIDE the dinosaur group — the sparrow on your windowsill really is a living dinosaur. A cladogram is the diagram that carries claims like these, and it is very easy to misread. By the end of this lesson you will read one the way a biologist does: from the branch points, not from how the picture happens to be arranged.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-cladograms',
      kind: 'concept',
      goal: 'Nodes as common ancestors, relatedness read from the most recent shared node, derived characters on branches, outgroups, and rotation.',
      keyIdeas: [
        'WHAT THE DIAGRAM IS — a cladogram is a branching diagram of ancestry. The TIPS at the ends are the groups being compared (living species, usually). The internal BRANCH POINTS, called nodes, are common ancestors. Every line is a lineage travelling forward through time.',
        'A NODE IS A SPLIT — each node marks the moment one ancestral lineage divided into two that stopped exchanging genes. The node itself is the most recent common ancestor of everything above it.',
        'RELATEDNESS IS READ FROM THE MOST RECENT SHARED NODE — to compare two tips, trace back from each until the paths meet. The pair whose paths meet at the more recent node (closer to the tips) is the more closely related pair. This single move answers every relatedness question.',
        'THE PAGE LIES: TIP PROXIMITY MEANS NOTHING — a cladogram can be ROTATED at any node, like a hanging mobile, without changing a single relationship. Rotate one node and two tips that were side by side end up at opposite ends. Because the tip order can be rearranged freely, "drawn next to" never means "closely related." This is the number-one error in the unit.',
        'DERIVED CHARACTERS SIT ON BRANCHES — a character mark placed on a branch means the trait evolved once in that lineage, so EVERY group above the mark inherits it. Characters shared by two or more tips are what define groups; a character found in only one tip groups nothing.',
        'THE OUTGROUP — the group that branches off at the very base, lacking the derived characters the others share. It is the baseline that tells you which character state is ancestral and which is derived, so the rest of the tree has something to be measured against.',
        'BUILDING A TREE FROM A CHARACTER TABLE — rank the derived characters by how many species share them. The most widely shared character marks the DEEPEST node; the next most widely shared marks the next node up, and so on. Work outward from the base to the tips.',
        'NOT A LADDER, AND NO TIP DESCENDS FROM ANOTHER TIP — the tree does not rank species from primitive to advanced, and the group drawn last is not the "most evolved." Every living tip has been evolving for exactly the same amount of time since any shared node. Living tips are cousins; none of them is another one\'s ancestor.',
      ],
      vocabulary: [
        { term: 'node', definition: 'a branch point on a tree, representing the most recent common ancestor of everything above it.' },
        { term: 'derived character', definition: 'a trait that evolved in one lineage and is inherited by all descendants of that lineage.' },
        { term: 'outgroup', definition: 'the group branching off at the base, lacking the derived characters, used as a baseline for comparison.' },
        { term: 'clade', definition: 'a node plus every descendant of that node — an ancestor and all of its offspring lineages.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-relatedness',
      kind: 'worked_example',
      problem:
        'A cladogram compares four animals. The lamprey branches off first. The remaining lineage then splits into the shark and a branch that later splits into the lizard and the mouse. Reading the tips across the page they are drawn in the order lamprey, shark, lizard, mouse. Is the shark more closely related to the lizard, or to the mouse?',
      steps: [
        'Rebuild the branch points from the description. Node 1 (deepest) separates the lamprey from everything else. Node 2 separates the shark from a lineage that continues upward. Node 3 splits that lineage into the lizard and the mouse.',
        'Trace back from the shark and the lizard: their paths first meet at node 2.',
        'Trace back from the shark and the mouse: their paths also first meet at node 2 — the SAME node, because node 2 gave rise to the shark on one side and to the whole lizard-plus-mouse lineage on the other.',
        'Since both comparisons land on the identical most recent common ancestor, the shark is exactly as closely related to the lizard as it is to the mouse. The lizard and mouse are the ones that are closer to each other, meeting at the more recent node 3.',
        'Check the trap: the shark is DRAWN beside the lizard, which tempts you to pick the lizard. Rotate node 3 and the tips read lamprey, shark, mouse, lizard, with every relationship untouched — proof that the drawing order carried no information.',
      ],
      answer:
        'Equally related to both — the shark\'s most recent common ancestor with the lizard is the very same node it shares with the mouse.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-build-from-characters',
      kind: 'worked_example',
      problem:
        'Four animals are scored for three characters. The lancelet has none of them. The salmon has a backbone. The frog has a backbone and four limbs. The lizard has a backbone, four limbs, and an amniotic (shelled) egg. Work out the branching order and say which two are most closely related.',
      steps: [
        'Find the outgroup: the lancelet has none of the derived characters, so it branches off at the base and sets the baseline for what counts as ancestral.',
        'Count how many species share each character: backbone = 3 (salmon, frog, lizard); four limbs = 2 (frog, lizard); amniotic egg = 1 (lizard only).',
        'The most widely shared derived character marks the DEEPEST node. Place "backbone" on the branch above the lancelet split, so the salmon, frog, and lizard form one group. The salmon has nothing beyond the backbone, so it branches off next.',
        'The next character up is "four limbs," shared by the frog and the lizard. It marks the node those two share, so the remaining lineage splits into the frog and the lizard.',
        'The amniotic egg appears in the lizard alone, so it sits on the lizard\'s own branch and groups nothing — a character in a single species never defines a node.',
        'Assemble the order: lancelet splits off first, then the salmon, and the last node splits the frog from the lizard.',
      ],
      answer:
        'Branching order: lancelet, then salmon, then a final split between frog and lizard. The frog and the lizard are most closely related — they share the most recent node, the one marked by four limbs.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-most-related',
      kind: 'try_yourself',
      problem:
        'A cladogram compares four plant groups. The mosses branch off first. The remaining lineage then splits into the flowering plants and a branch that later splits into the ferns and the pine trees. Reading the tips across the page they are drawn in the order mosses, flowering plants, ferns, pines. Which group is most closely related to the ferns?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Flowering plants, because they are drawn immediately beside the ferns on the page' },
        { id: 'b', text: 'Pine trees, because the ferns and pines meet at a more recent common ancestor than the ferns share with anything else', correct: true },
        { id: 'c', text: 'Mosses, because the mosses sit at the base and every other group descended from them' },
        { id: 'd', text: 'Flowering plants, because they are the most recently evolved group and so sit at the top of the ladder' },
      ],
      expectedAnswer:
        'Pine trees, because the ferns and pines meet at a more recent common ancestor than the ferns share with anything else',
      hints: [
        'Ignore where the tips are printed — a cladogram can be rotated at any node without changing its meaning.',
        'Trace backward from the ferns. Which group do you meet at the very first node you reach?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-branching-order',
      kind: 'try_yourself',
      problem:
        'Four species are scored for three characters. Species Q has none of them. Species R has a jaw. Species S has a jaw and lungs. Species T has a jaw, lungs, and feathers. Which description of the branching order is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'T branches off first because it has the most characters, and Q branches off last' },
        { id: 'b', text: 'Q, R, S, and T all branch from one single node, because they were scored on the same table' },
        { id: 'c', text: 'R is descended from Q, and S is descended from R, forming a straight line from simplest to most complex' },
        { id: 'd', text: 'Q branches off first, then R, and the final node splits S from T', correct: true },
      ],
      expectedAnswer: 'Q branches off first, then R, and the final node splits S from T',
      hints: [
        'Count how many species share each character. The one shared by the most species marks the deepest split.',
        'The species with none of the derived characters is the outgroup at the base, and a character found in only one species (feathers) groups nothing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-character-on-branch',
      kind: 'try_yourself',
      problem:
        'On a vertebrate cladogram, the character "amniotic egg" is marked on the branch just below the node whose descendants are the lizards, the birds, and the mammals. What does that placement tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Lizards, birds, and mammals all inherited the amniotic egg from the common ancestor at that node', correct: true },
        { id: 'b', text: 'Only the lizards have the amniotic egg, because the mark sits closest to the lizard branch' },
        { id: 'c', text: 'The amniotic egg evolved three separate times, once in each of the three groups above the mark' },
        { id: 'd', text: 'Birds must be descended from lizards, since the birds are drawn higher up the tree than the lizards' },
      ],
      expectedAnswer: 'Lizards, birds, and mammals all inherited the amniotic egg from the common ancestor at that node',
      hints: [
        'A character drawn on a branch means the trait appeared once, in the lineage at that point.',
        'Everything above the mark inherits the trait — and those tips are living cousins, not one another\'s ancestors.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-tip-proximity',
      kind: 'misconception_check',
      question:
        'A cladogram of reptiles shows the lizards branching off first, and the remaining lineage then splitting into the crocodiles and the birds. The tips are drawn in the order lizards, crocodiles, birds. A student says: "Crocodiles are drawn right next to lizards, so crocodiles must be more closely related to lizards than to birds." What went wrong?',
      commonErrors: [
        {
          answer: 'Crocodiles are more closely related to lizards than to birds',
          misconception:
            'Judging relatedness by how close two tips sit on the page instead of by which node they trace back to.',
          correctsTo:
            'Trace back from the crocodile: the first node you reach is shared with the BIRDS. The lizards join only at the deeper node below that, so crocodiles and birds are each other\'s closest relatives here — which is exactly the evidence behind the claim that birds are dinosaurs. The drawing proves the point on its own: rotate that upper node and the tips read lizards, birds, crocodiles, with the ancestry completely unchanged. Read the nodes, never the spacing.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tips are the groups compared; nodes are common ancestors, and each node is a split into two lineages.',
        'Relatedness = how RECENT the shared node is. Trace back from both groups and see where the paths meet.',
        'Tip order carries no information — any node can be rotated, so "drawn next to" never means "closely related."',
        'A derived character marked on a branch is inherited by every group above it; shared derived characters define groups, and a character in one group alone defines nothing.',
        'The outgroup lacks the derived characters and branches off at the base, setting the baseline. A tree branches, it does not rank: living tips are cousins, never one another\'s ancestors.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Phylogenetic Trees & Cladograms' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
