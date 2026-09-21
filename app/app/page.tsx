"use client";

import Link from "next/link";
import { CHALLENGES } from "@/lib/challenges";
import { isChallengeUnlocked, useProgress } from "@/lib/useProgress";
import { levelFromXp, xpIntoLevel, xpToNextLevel } from "@/lib/gamification";

export default function Home() {
  const { state, ready } = useProgress();

  if (!ready) {
    return <div style={{ minHeight: "100vh", background: "#f7f5ee" }} />;
  }

  const level = levelFromXp(state.xp);
  const into = xpIntoLevel(state.xp);
  const toNext = xpToNextLevel(state.xp);
  const pct = Math.round((into / (into + toNext)) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5ee" }}>
      <header
        style={{
          background: "linear-gradient(180deg, #0f3d2e 0%, #14533f 100%)",
          padding: "28px 20px 32px",
          borderRadius: "0 0 28px 28px",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div>
            <div style={{ color: "#c9d6cd", fontSize: 12 }}>Bem-vindo(a) de volta,</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Explorador(a)</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 14px" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{state.xp} XP</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 14px" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Nível {level}</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ width: "100%", height: 8, borderRadius: 999, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#b9832e,#d9a441)" }} />
            </div>
            <div style={{ color: "#c9d6cd", fontSize: 11, marginTop: 4 }}>
              {toNext} XP para o nível {level + 1}
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "24px 20px 40px" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: "#17241f" }}>Caderno de Desafios</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CHALLENGES.map((challenge) => {
            const unlocked = isChallengeUnlocked(state, challenge.id);
            const progress = state.challenges[challenge.id];
            const completed = Boolean(progress?.completed);

            const card = (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: unlocked ? "#fff" : "#f2ede0",
                  borderRadius: 16,
                  padding: 14,
                  boxShadow: unlocked ? "0 2px 8px rgba(15,61,46,0.08)" : "none",
                  border: completed ? "1px solid #eee6d3" : unlocked ? "2px solid #b5233a22" : "none",
                  opacity: unlocked ? 1 : 0.7,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: unlocked ? challenge.accent : "#cfc7ae",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                  }}
                >
                  {challenge.order}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: unlocked ? "#17241f" : "#7c7560" }}>{challenge.title}</div>
                  <div style={{ fontSize: 12, color: unlocked ? "#5c6d63" : "#9a927b" }}>{challenge.theme}</div>
                  {progress && progress.attempts > 0 && (
                    <div style={{ fontSize: 11, color: "#9a927b" }}>
                      {progress.stars > 0 ? "★".repeat(progress.stars) : ""} {progress.attempts} tentativas
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: unlocked ? challenge.accent : "#8a8168" }}>
                  {completed ? "Concluído" : unlocked ? "Jogar" : "Bloqueado"}
                </div>
              </div>
            );

            return unlocked ? (
              <Link key={challenge.id} href={`/desafio/${challenge.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {card}
              </Link>
            ) : (
              <div key={challenge.id}>{card}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
