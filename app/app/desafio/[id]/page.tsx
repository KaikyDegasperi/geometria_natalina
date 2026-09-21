"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartesianPlane, DrawnSegment } from "@/components/CartesianPlane";
import { buildSteps, getChallenge, Point } from "@/lib/challenges";
import { starsForAttempts, XP_COMPLETION_BONUS, XP_PER_POINT } from "@/lib/gamification";
import { isChallengeUnlocked, useProgress } from "@/lib/useProgress";

type Feedback = { kind: "correct" | "incorrect" | "done"; message: string } | null;

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const challenge = getChallenge(id);
  const { state, ready, addXp, recordAttempt, completeChallenge } = useProgress();

  const steps = useMemo(() => (challenge ? buildSteps(challenge.segments) : []), [challenge]);

  const [stepIndex, setStepIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [drawnSegments, setDrawnSegments] = useState<DrawnSegment[]>([]);

  if (!challenge) {
    return (
      <div style={{ padding: 24 }}>
        <p>Desafio não encontrado.</p>
        <Link href="/">Voltar</Link>
      </div>
    );
  }

  if (!ready) {
    return <div style={{ minHeight: "100vh", background: "#0f3d2e" }} />;
  }

  if (!isChallengeUnlocked(state, id)) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f3d2e", color: "#fff", padding: 24 }}>
        <p>Este desafio ainda está bloqueado. Conclua o desafio anterior primeiro.</p>
        <Link href="/" style={{ color: "#d9a441" }}>
          Voltar ao caderno
        </Link>
      </div>
    );
  }

  const isDone = stepIndex >= steps.length;
  const nextTarget = isDone ? null : steps[stepIndex].point;

  function handlePick(point: Point) {
    if (!nextTarget || !challenge) return;
    const correct = point.x === nextTarget.x && point.y === nextTarget.y;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    recordAttempt(challenge.id, correct);

    if (!correct) {
      setFeedback({
        kind: "incorrect",
        message: `Você marcou (${point.x}, ${point.y}). O ponto esperado é (${nextTarget.x}, ${nextTarget.y}).`,
      });
      return;
    }

    addXp(XP_PER_POINT);

    setDrawnSegments((prev) => {
      const step = steps[stepIndex];
      const shapeSegment = challenge.segments[step.segmentIndex];
      if (step.startsNewSegment) {
        return [
          ...prev,
          {
            points: [point],
            color: shapeSegment.color,
            strokeColor: shapeSegment.strokeColor,
            fill: shapeSegment.fill,
            thickness: shapeSegment.thickness,
          },
        ];
      }
      const copy = prev.map((seg) => ({ ...seg, points: seg.points.slice() }));
      copy[copy.length - 1].points.push(point);
      return copy;
    });

    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);

    if (nextIndex >= steps.length) {
      const stars = starsForAttempts(steps.length, newAttempts);
      addXp(XP_COMPLETION_BONUS);
      completeChallenge(challenge.id, steps.length, newAttempts, stars);
      setFeedback({ kind: "done", message: `Desenho concluído! +${XP_COMPLETION_BONUS} XP de bônus.` });
    } else {
      setFeedback({ kind: "correct", message: `Correto! +${XP_PER_POINT} XP · ponto (${point.x}, ${point.y}) marcado.` });
    }
  }

  function handleRestart() {
    setStepIndex(0);
    setAttempts(0);
    setDrawnSegments([]);
    setFeedback(null);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0c2e23 0%, #123a2c 55%, #0f3d2e 100%)",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ color: "#c9d6cd", fontSize: 13, textDecoration: "none" }}>
            ← Caderno
          </Link>
          <div style={{ color: "#fff", fontWeight: 700 }}>
            Desafio {challenge.order} · {challenge.title}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: challenge.accent }}>SUA MISSÃO</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#17241f" }}>
            {isDone
              ? "Você completou o desenho!"
              : `Marque o ponto (${nextTarget!.x}, ${nextTarget!.y}) para continuar`}
          </div>
        </div>

        <div style={{ background: "#f7f5ee", borderRadius: 18, padding: 14 }}>
          <CartesianPlane
            drawnSegments={drawnSegments}
            onPick={handlePick}
            disabled={isDone}
            fillWhenDone={isDone}
            decorations={isDone ? challenge.decorations : undefined}
          />
        </div>

        {feedback && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background:
                feedback.kind === "incorrect" ? "rgba(181,35,58,0.85)" : "rgba(15,61,46,0.85)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 14,
              padding: "10px 14px",
              color: "#f2ead6",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {feedback.message}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 10, textAlign: "center" }}>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>
              {stepIndex} / {steps.length}
            </div>
            <div style={{ color: "#c9d6cd", fontSize: 11, fontWeight: 700 }}>Pontos</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 10, textAlign: "center" }}>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>{attempts}</div>
            <div style={{ color: "#c9d6cd", fontSize: 11, fontWeight: 700 }}>Tentativas</div>
          </div>
        </div>

        {isDone && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleRestart}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Jogar novamente
            </button>
            <button
              onClick={() => router.push("/")}
              style={{
                flex: 1,
                background: challenge.accent,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Voltar ao caderno
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
