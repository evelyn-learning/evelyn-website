/**
 * Batch-6 fixtures, part "polygon" (coordinate_polygon) — GreenApple T2
 * geometry transformations. Kept local to the polygon tests (not pushed onto
 * FIGURE_FIXTURES), so no gallery or byte-pin list changes with them.
 */
import type { FigureFixture } from './practice-figure-fixtures';

export const FIXTURES: FigureFixture[] = [
  {
    id: 'poly-simple-translation',
    note: 'simple: a triangle and its translated image, captions "pre-image" / "image", an arrow from P to P′',
    question: 'Triangle PQR is translated to triangle P′Q′R′. Which rule describes the translation?',
    alt: 'A coordinate grid with triangle PQR and its image P′Q′R′, and an arrow from P to P′.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[-5, 1], [-2, 1], [-4, 4]], labels: ['P', 'Q', 'R'], name: 'pre-image' },
          { vertices: [[1, -3], [4, -3], [2, 0]], labels: ['P′', 'Q′', 'R′'], name: 'image', style: 'dashed' },
        ],
        arrows: [{ from: [-5, 1], to: [1, -3] }],
      },
    },
  },
  {
    id: 'poly-reflection-y-equals-x',
    note: 'simple: a reflection across the drawn line y = x',
    question: 'Triangle JKL is reflected across the line y = x. What are the coordinates of K′?',
    alt: 'A coordinate grid with triangle JKL, its image J′K′L′ and the line y = x.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-2, 8], yRange: [-2, 8],
        polygons: [
          { vertices: [[1, 4], [2, 7], [4, 5]], labels: ['J', 'K', 'L'] },
          { vertices: [[4, 1], [7, 2], [5, 4]], labels: ['J′', 'K′', 'L′'], style: 'dashed' },
        ],
        lines: [{ kind: 'through', points: [[0, 0], [1, 1]], label: 'y = x' }],
      },
    },
  },
  {
    id: 'poly-rotation-90-origin',
    note: 'simple: a quadrilateral rotated 90° counterclockwise about the origin',
    question: 'Quadrilateral KLMN is mapped to K′L′M′N′. Describe the transformation.',
    alt: 'A coordinate grid with quadrilateral KLMN and its image K′L′M′N′.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[1, 1], [5, 1], [5, 3], [2, 4]], labels: ['K', 'L', 'M', 'N'] },
          { vertices: [[-1, 1], [-1, 5], [-3, 5], [-4, 2]], labels: ['K′', 'L′', 'M′', 'N′'], style: 'dashed' },
        ],
      },
    },
  },
  {
    id: 'poly-dilation-half-shaded',
    note: 'simple: a shaded triangle dilated by 1/2 about a marked centre M',
    question: 'Triangle STU is dilated about point M to give triangle S′T′U′. What is the scale factor?',
    alt: 'A coordinate grid with a shaded triangle STU, its image S′T′U′ and a marked point M.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-6, 6], yRange: [-6, 6],
        polygons: [
          { vertices: [[-4, -4], [4, -4], [4, 4]], labels: ['S', 'T', 'U'], shade: true },
          { vertices: [[-4, 0], [0, 0], [0, 4]], labels: ['S′', 'T′', 'U′'], style: 'dashed' },
        ],
        points: [{ x: -4, y: 4, label: 'M' }],
      },
    },
  },
  {
    id: 'poly-dense-three-figures',
    note: 'dense: three quadrilaterals (Figure 1 → 2 by reflection across ℓ, 2 → 3 by a half-turn), primes and double primes, a labelled line',
    question: 'Figure 1 is reflected across line ℓ to give Figure 2, which is rotated 180° about the origin to give Figure 3. Which single transformation maps Figure 1 onto Figure 3?',
    alt: 'A coordinate grid with three quadrilaterals, Figures 1, 2 and 3, and a vertical line ℓ.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-8, 8], yRange: [-6, 6],
        polygons: [
          { vertices: [[-7, 1], [-3, 1], [-4, 4], [-7, 3]], labels: ['P', 'Q', 'R', 'S'], name: 'Figure 1' },
          { vertices: [[5, 1], [1, 1], [2, 4], [5, 3]], labels: ['P′', 'Q′', 'R′', 'S′'], name: 'Figure 2', style: 'dashed' },
          { vertices: [[-5, -1], [-1, -1], [-2, -4], [-5, -3]], labels: ['P″', 'Q″', 'R″', 'S″'], name: 'Figure 3', style: 'dashed' },
        ],
        lines: [{ kind: 'vertical', x: -1, label: 'ℓ' }],
      },
    },
  },
  {
    id: 'poly-symmetry-octagon',
    note: 'simple: one shaded octagon with no labels — for lines and order of symmetry',
    question: 'How many lines of symmetry does the octagon have?',
    alt: 'A coordinate grid with one shaded octagon centred on the origin.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-5, 5], yRange: [-5, 5],
        polygons: [{ vertices: [[-1, -3], [1, -3], [3, -1], [3, 1], [1, 3], [-1, 3], [-3, 1], [-3, -1]], shade: true }],
      },
    },
  },
  {
    id: 'poly-segment-coordinates',
    note: 'dense: two segments with their endpoint coordinates printed beside the labels',
    question: 'Segment MN is rotated to M′N′. Through what angle, and in which direction?',
    alt: 'A coordinate grid with segment MN and its image M′N′, each endpoint labelled with its coordinates.',
    spec: {
      type: 'coordinate_polygon',
      params: {
        xRange: [-5, 5], yRange: [-5, 5],
        polygons: [
          { vertices: [[-3, -2], [3, 2]], labels: ['M', 'N'] },
          { vertices: [[2, -3], [-2, 3]], labels: ['M′', 'N′'], style: 'dashed' },
        ],
        showVertexCoordinates: true,
      },
    },
  },
];
