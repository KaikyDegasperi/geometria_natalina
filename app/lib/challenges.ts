export type Point = { x: number; y: number };

export type Segment = {
  points: Point[];
  color: string;
  strokeColor?: string;
  fill?: boolean;
  thickness?: number;
};

export type Decoration =
  | { kind: "circle"; x: number; y: number; r: number; color: string; strokeColor?: string; highlight?: boolean }
  | { kind: "band"; points: Point[]; color: string; strokeColor?: string }
  | { kind: "polygon"; points: Point[]; color: string; strokeColor?: string };

export type Challenge = {
  id: string;
  order: number;
  title: string;
  theme: string;
  accent: string;
  segments: Segment[];
  decorations?: Decoration[];
};

export const GRID_MIN = -5;
export const GRID_MAX = 5;

const HOLLY = "#c22a3e";
const HOLLY_DARK = "#7a1626";
const GOLD = "#e0ac48";
const GOLD_DARK = "#a97a1e";
const GOLD_LIGHT = "#f6d691";
const PINE = "#14533f";
const PINE_DARK = "#0a2e21";
const TRUNK = "#7c4a24";
const TRUNK_DARK = "#4d2c14";

export const CHALLENGES: Challenge[] = [
  {
    id: "presente",
    order: 1,
    title: "Presente",
    theme: "Pares ordenados e segmentos",
    accent: HOLLY,
    segments: [
      {
        color: HOLLY,
        strokeColor: HOLLY_DARK,
        fill: true,
        points: [
          { x: -3, y: -3 },
          { x: 3, y: -3 },
          { x: 3, y: 1 },
          { x: -3, y: 1 },
          { x: -3, y: -3 },
        ],
      },
      {
        color: GOLD,
        strokeColor: GOLD_DARK,
        fill: true,
        points: [
          { x: -3, y: -1 },
          { x: 3, y: -1 },
          { x: 3, y: 0 },
          { x: -3, y: 0 },
          { x: -3, y: -1 },
        ],
      },
      {
        color: GOLD,
        strokeColor: GOLD_DARK,
        fill: true,
        points: [
          { x: -1, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: -3 },
          { x: -1, y: -3 },
          { x: -1, y: 1 },
        ],
      },
      {
        color: GOLD_LIGHT,
        points: [
          { x: 0, y: 1 },
          { x: 0, y: -3 },
        ],
      },
      {
        color: GOLD,
        strokeColor: GOLD_DARK,
        fill: true,
        points: [
          { x: -1, y: 2 },
          { x: 1, y: 2 },
          { x: 1, y: 1 },
          { x: -1, y: 1 },
          { x: -1, y: 2 },
        ],
      },
      {
        color: GOLD,
        strokeColor: GOLD_DARK,
        fill: true,
        points: [
          { x: -1, y: 2 },
          { x: -4, y: 4 },
          { x: -4, y: 3 },
          { x: -1, y: 1 },
          { x: -1, y: 2 },
        ],
      },
      {
        color: GOLD,
        strokeColor: GOLD_DARK,
        fill: true,
        points: [
          { x: 1, y: 2 },
          { x: 4, y: 4 },
          { x: 4, y: 3 },
          { x: 1, y: 1 },
          { x: 1, y: 2 },
        ],
      },
    ],
  },
  {
    id: "estrela",
    order: 2,
    title: "Estrela",
    theme: "Simetria e polígonos",
    accent: GOLD,
    segments: [
      {
        color: GOLD,
        strokeColor: GOLD_DARK,
        fill: true,
        points: [
          { x: 0, y: 4 },
          { x: 1, y: 1 },
          { x: 4, y: 1 },
          { x: 2, y: -1 },
          { x: 3, y: -4 },
          { x: 0, y: -2 },
          { x: -3, y: -4 },
          { x: -2, y: -1 },
          { x: -4, y: 1 },
          { x: -1, y: 1 },
          { x: 0, y: 4 },
        ],
      },
    ],
  },
  {
    id: "arvore",
    order: 3,
    title: "Árvore de Natal",
    theme: "Quatro quadrantes e triângulos",
    accent: PINE,
    segments: [
      {
        color: PINE,
        strokeColor: PINE_DARK,
        fill: true,
        points: [
          { x: -4, y: -3 },
          { x: 4, y: -3 },
          { x: 0, y: -1 },
          { x: -4, y: -3 },
        ],
      },
      {
        color: PINE,
        strokeColor: PINE_DARK,
        fill: true,
        points: [
          { x: -3, y: -1 },
          { x: 3, y: -1 },
          { x: 0, y: 1 },
          { x: -3, y: -1 },
        ],
      },
      {
        color: PINE,
        strokeColor: PINE_DARK,
        fill: true,
        points: [
          { x: -2, y: 1 },
          { x: 2, y: 1 },
          { x: 0, y: 3 },
          { x: -2, y: 1 },
        ],
      },
      {
        color: TRUNK,
        strokeColor: TRUNK_DARK,
        fill: true,
        points: [
          { x: -1, y: -3 },
          { x: -1, y: -4 },
          { x: 1, y: -4 },
          { x: 1, y: -3 },
          { x: -1, y: -3 },
        ],
      },
    ],
    decorations: [
      { kind: "band", color: GOLD, strokeColor: GOLD_DARK, points: [{ x: -4, y: -3 }, { x: 4, y: -3 }] },
      { kind: "band", color: GOLD, strokeColor: GOLD_DARK, points: [{ x: -3, y: -1 }, { x: 3, y: -1 }] },
      { kind: "band", color: GOLD, strokeColor: GOLD_DARK, points: [{ x: -2, y: 1 }, { x: 2, y: 1 }] },
      { kind: "circle", x: -1.6, y: -2.1, r: 0.32, color: HOLLY, strokeColor: HOLLY_DARK, highlight: true },
      { kind: "circle", x: 1.6, y: -2.1, r: 0.32, color: HOLLY, strokeColor: HOLLY_DARK, highlight: true },
      { kind: "circle", x: -1.1, y: -0.1, r: 0.32, color: HOLLY, strokeColor: HOLLY_DARK, highlight: true },
      { kind: "circle", x: 1.1, y: -0.1, r: 0.32, color: HOLLY, strokeColor: HOLLY_DARK, highlight: true },
      { kind: "circle", x: -0.65, y: 1.7, r: 0.28, color: HOLLY, strokeColor: HOLLY_DARK, highlight: true },
      { kind: "circle", x: 0.65, y: 1.7, r: 0.28, color: HOLLY, strokeColor: HOLLY_DARK, highlight: true },
      {
        kind: "polygon",
        color: GOLD,
        strokeColor: GOLD_DARK,
        points: [
          { x: 0, y: 5.1 },
          { x: 0.32, y: 4.55 },
          { x: 0.95, y: 4.45 },
          { x: 0.48, y: 4.05 },
          { x: 0.6, y: 3.5 },
          { x: 0, y: 3.8 },
          { x: -0.6, y: 3.5 },
          { x: -0.48, y: 4.05 },
          { x: -0.95, y: 4.45 },
          { x: -0.32, y: 4.55 },
          { x: 0, y: 5.1 },
        ],
      },
    ],
  },
];

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}

export type Step = { point: Point; segmentIndex: number; startsNewSegment: boolean };

export function buildSteps(segments: Segment[]): Step[] {
  const steps: Step[] = [];
  segments.forEach((segment, segmentIndex) => {
    segment.points.forEach((point, i) => {
      steps.push({ point, segmentIndex, startsNewSegment: i === 0 });
    });
  });
  return steps;
}

export function totalPointCount(challenge: Challenge): number {
  return challenge.segments.reduce((sum, s) => sum + s.points.length, 0);
}
