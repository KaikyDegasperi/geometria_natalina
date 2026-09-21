"use client";

import { useCallback, useEffect, useState } from "react";
import { CHALLENGES } from "./challenges";

export type ChallengeProgress = {
  completed: boolean;
  bestCorrectPoints: number;
  totalPoints: number;
  attempts: number;
  stars: number;
};

export type ProgressState = {
  xp: number;
  challenges: Record<string, ChallengeProgress>;
};

const STORAGE_KEY = "geometria-natalina-progress";
const PROGRESS_EVENT = "geometria-natalina-progress-changed";

function emptyState(): ProgressState {
  return { xp: 0, challenges: {} };
}

function loadState(): ProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { xp: parsed.xp ?? 0, challenges: parsed.challenges ?? {} };
  } catch {
    return emptyState();
  }
}

function saveState(state: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

export function isChallengeUnlocked(state: ProgressState, challengeId: string) {
  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) return false;
  if (challenge.order === 1) return true;
  const previous = CHALLENGES.find((c) => c.order === challenge.order - 1);
  if (!previous) return true;
  return Boolean(state.challenges[previous.id]?.completed);
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
    const onChange = () => setState(loadState());
    window.addEventListener(PROGRESS_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const addXp = useCallback((amount: number) => {
    setState((prev) => {
      const next = { ...prev, xp: prev.xp + amount };
      saveState(next);
      return next;
    });
  }, []);

  const recordAttempt = useCallback((challengeId: string, correct: boolean) => {
    setState((prev) => {
      const existing = prev.challenges[challengeId] ?? {
        completed: false,
        bestCorrectPoints: 0,
        totalPoints: 0,
        attempts: 0,
        stars: 0,
      };
      const next: ProgressState = {
        ...prev,
        challenges: {
          ...prev.challenges,
          [challengeId]: {
            ...existing,
            attempts: existing.attempts + 1,
          },
        },
      };
      saveState(next);
      return next;
    });
  }, []);

  const completeChallenge = useCallback(
    (challengeId: string, totalPoints: number, attempts: number, stars: number) => {
      setState((prev) => {
        const existing = prev.challenges[challengeId];
        const next: ProgressState = {
          ...prev,
          challenges: {
            ...prev.challenges,
            [challengeId]: {
              completed: true,
              bestCorrectPoints: totalPoints,
              totalPoints,
              attempts: existing?.attempts ?? attempts,
              stars: Math.max(existing?.stars ?? 0, stars),
            },
          },
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const resetProgress = useCallback(() => {
    const next = emptyState();
    saveState(next);
    setState(next);
  }, []);

  return { state, ready, addXp, recordAttempt, completeChallenge, resetProgress };
}
