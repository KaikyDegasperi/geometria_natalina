"use client";

import { useMemo, useRef } from "react";
import { Decoration, GRID_MAX, GRID_MIN, Point } from "@/lib/challenges";

export type DrawnSegment = { points: Point[]; color: string; strokeColor?: string; fill?: boolean; thickness?: number };

type Props = {
  drawnSegments: DrawnSegment[];
  onPick: (point: Point) => void;
  disabled?: boolean;
  fillWhenDone?: boolean;
  decorations?: Decoration[];
};

const SIZE = 340;
const MARGIN = 18;
const TOTAL = SIZE + MARGIN * 2;
const CELLS = GRID_MAX - GRID_MIN;
const CELL = SIZE / CELLS;

function toSvg(p: Point) {
  return { sx: (p.x - GRID_MIN) * CELL, sy: (GRID_MAX - p.y) * CELL };
}

export function CartesianPlane({ drawnSegments, onPick, disabled, fillWhenDone, decorations }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
    for (let i = GRID_MIN; i <= GRID_MAX; i++) {
      lines.push({ x1: 0, y1: (GRID_MAX - i) * CELL, x2: SIZE, y2: (GRID_MAX - i) * CELL, key: `h${i}` });
      lines.push({ x1: (i - GRID_MIN) * CELL, y1: 0, x2: (i - GRID_MIN) * CELL, y2: SIZE, key: `v${i}` });
    }
    return lines;
  }, []);

  const gridDots = useMemo(() => {
    const dots: { cx: number; cy: number; key: string }[] = [];
    for (let x = GRID_MIN; x <= GRID_MAX; x++) {
      for (let y = GRID_MIN; y <= GRID_MAX; y++) {
        const { sx, sy } = toSvg({ x, y });
        dots.push({ cx: sx, cy: sy, key: `${x},${y}` });
      }
    }
    return dots;
  }, []);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (disabled || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * TOTAL - MARGIN;
    const py = ((e.clientY - rect.top) / rect.height) * TOTAL - MARGIN;
    const rawX = px / CELL + GRID_MIN;
    const rawY = GRID_MAX - py / CELL;
    const x = Math.max(GRID_MIN, Math.min(GRID_MAX, Math.round(rawX)));
    const y = Math.max(GRID_MIN, Math.min(GRID_MAX, Math.round(rawY)));
    onPick({ x, y });
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${TOTAL} ${TOTAL}`}
      width="100%"
      height={TOTAL}
      onClick={handleClick}
      style={{ cursor: disabled ? "default" : "crosshair", display: "block", touchAction: "manipulation" }}
      role="img"
      aria-label="Plano cartesiano interativo"
    >
      <rect x={0} y={0} width={TOTAL} height={TOTAL} fill="#f7f5ee" />
      <g transform={`translate(${MARGIN},${MARGIN})`}>
      {gridLines.map((l) => (
        <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#dcd6c4" strokeWidth={1} />
      ))}
      <line x1={0} y1={(GRID_MAX - 0) * CELL} x2={SIZE} y2={(GRID_MAX - 0) * CELL} stroke="#17241f" strokeWidth={2} />
      <line x1={(0 - GRID_MIN) * CELL} y1={0} x2={(0 - GRID_MIN) * CELL} y2={SIZE} stroke="#17241f" strokeWidth={2} />

      {Array.from({ length: CELLS + 1 }, (_, i) => GRID_MIN + i)
        .filter((n) => n !== 0)
        .map((n) => (
          <text
            key={`xlabel${n}`}
            x={(n - GRID_MIN) * CELL}
            y={(GRID_MAX - 0) * CELL + 14}
            fontSize={9}
            fill="#5c6d63"
            textAnchor="middle"
          >
            {n}
          </text>
        ))}
      {Array.from({ length: CELLS + 1 }, (_, i) => GRID_MIN + i)
        .filter((n) => n !== 0)
        .map((n) => (
          <text
            key={`ylabel${n}`}
            x={(0 - GRID_MIN) * CELL - 7}
            y={(GRID_MAX - n) * CELL + 3}
            fontSize={9}
            fill="#5c6d63"
            textAnchor="end"
          >
            {n}
          </text>
        ))}
      <text x={(0 - GRID_MIN) * CELL - 7} y={(GRID_MAX - 0) * CELL + 14} fontSize={9} fill="#5c6d63" textAnchor="end">
        0
      </text>

      {gridDots.map((d) => (
        <circle key={d.key} cx={d.cx} cy={d.cy} r={2} fill="#b7ae94" />
      ))}

      {fillWhenDone &&
        drawnSegments.map((segment, si) => {
          const pts = segment.points;
          const first = pts[0];
          const last = pts[pts.length - 1];
          if (!segment.fill || pts.length < 3 || !first || !last || first.x !== last.x || first.y !== last.y) return null;
          const svgPts = pts.map((p) => toSvg(p)).map((s) => `${s.sx},${s.sy}`).join(" ");
          return <polygon key={`fill-${si}`} points={svgPts} fill={segment.color} fillOpacity={0.95} />;
        })}

      {drawnSegments.map((segment, si) => {
        if (segment.points.length < 2) return null;
        const svgPts = segment.points.map((p) => toSvg(p)).map((s) => `${s.sx},${s.sy}`).join(" ");
        return (
          <polyline
            key={si}
            points={svgPts}
            fill="none"
            stroke={segment.strokeColor ?? segment.color}
            strokeWidth={segment.thickness ?? 3}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        );
      })}

      {drawnSegments.map((segment, si) =>
        segment.points.map((p, i) => {
          const { sx, sy } = toSvg(p);
          const r = Math.max(5, (segment.thickness ?? 3) * 0.6);
          return (
            <circle
              key={`${si}-${i}`}
              cx={sx}
              cy={sy}
              r={r}
              fill={segment.color}
              stroke={segment.strokeColor ?? segment.color}
              strokeWidth={1.5}
            />
          );
        })
      )}

      {decorations?.map((d, i) => {
        if (d.kind === "circle") {
          const { sx, sy } = toSvg({ x: d.x, y: d.y });
          const r = d.r * CELL;
          return (
            <g key={`deco-${i}`}>
              <circle cx={sx} cy={sy} r={r} fill={d.color} stroke={d.strokeColor ?? d.color} strokeWidth={1.5} />
              {d.highlight && (
                <circle cx={sx - r * 0.35} cy={sy - r * 0.35} r={r * 0.3} fill="#ffffff" fillOpacity={0.55} />
              )}
            </g>
          );
        }
        if (d.kind === "band") {
          const svgPts = d.points.map((p) => toSvg(p)).map((s) => `${s.sx},${s.sy}`).join(" ");
          return (
            <polyline
              key={`deco-${i}`}
              points={svgPts}
              fill="none"
              stroke={d.color}
              strokeWidth={CELL * 0.4}
              strokeLinecap="round"
            />
          );
        }
        const svgPts = d.points.map((p) => toSvg(p)).map((s) => `${s.sx},${s.sy}`).join(" ");
        return (
          <polygon
            key={`deco-${i}`}
            points={svgPts}
            fill={d.color}
            stroke={d.strokeColor ?? d.color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        );
      })}
      </g>
    </svg>
  );
}
