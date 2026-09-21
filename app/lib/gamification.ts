export const XP_PER_POINT = 10;
export const XP_COMPLETION_BONUS = 50;
export const XP_PER_LEVEL = 150;

export function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp: number) {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number) {
  return XP_PER_LEVEL - xpIntoLevel(xp);
}

export function starsForAttempts(totalPoints: number, attempts: number) {
  if (attempts <= totalPoints) return 3;
  if (attempts <= totalPoints + 3) return 2;
  return 1;
}
