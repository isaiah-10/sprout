// ============================================================
// SPROUT — XP & Leveling System
// ============================================================

export interface XPLevel {
  level: number
  title: string
  emoji: string
  minXP: number
  maxXP: number
  color: string
}

export const XP_LEVELS: XPLevel[] = [
  { level: 1,  title: 'Seed',          emoji: '🌱', minXP: 0,     maxXP: 100,   color: '#95D5B2' },
  { level: 2,  title: 'Sprout',        emoji: '🌿', minXP: 100,   maxXP: 250,   color: '#74C69D' },
  { level: 3,  title: 'Penny Saver',   emoji: '🪙', minXP: 250,   maxXP: 500,   color: '#52B788' },
  { level: 4,  title: 'Budget Boss',   emoji: '💼', minXP: 500,   maxXP: 900,   color: '#40916C' },
  { level: 5,  title: 'Coin Collector',emoji: '💰', minXP: 900,   maxXP: 1400,  color: '#2D6A4F' },
  { level: 6,  title: 'Market Watcher',emoji: '👀', minXP: 1400,  maxXP: 2000,  color: '#FBBF24' },
  { level: 7,  title: 'Stock Picker',  emoji: '📊', minXP: 2000,  maxXP: 2800,  color: '#F59E0B' },
  { level: 8,  title: 'Portfolio Pro', emoji: '📈', minXP: 2800,  maxXP: 3800,  color: '#D97706' },
  { level: 9,  title: 'Investor',      emoji: '🏦', minXP: 3800,  maxXP: 5000,  color: '#2563EB' },
  { level: 10, title: 'Fund Manager',  emoji: '🎩', minXP: 5000,  maxXP: 7000,  color: '#7C3AED' },
  { level: 11, title: 'Wealth Builder',emoji: '🏗️', minXP: 7000,  maxXP: 9500,  color: '#DB2777' },
  { level: 12, title: 'Stock Legend',  emoji: '🌟', minXP: 9500,  maxXP: Infinity, color: '#DC2626' },
]

export function getLevelFromXP(xp: number): XPLevel {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) return XP_LEVELS[i]
  }
  return XP_LEVELS[0]
}

export function getProgressToNextLevel(xp: number): number {
  const current = getLevelFromXP(xp)
  if (current.maxXP === Infinity) return 100
  const range = current.maxXP - current.minXP
  const progress = xp - current.minXP
  return Math.min(100, Math.round((progress / range) * 100))
}

export function getXPToNextLevel(xp: number): number {
  const current = getLevelFromXP(xp)
  if (current.maxXP === Infinity) return 0
  return current.maxXP - xp
}

// XP rewards for various actions
export const XP_REWARDS = {
  GAME_PLAYED:        15,
  GAME_COMPLETED:     25,
  GAME_PERFECT:       75,
  LESSON_COMPLETED:   40,
  FIRST_TRADE:        100,
  TRADE_EXECUTED:     20,
  GOAL_CREATED:       25,
  GOAL_COMPLETED:     150,
  DAILY_LOGIN:        10,
  STREAK_3:           30,
  STREAK_7:           75,
  STREAK_30:          300,
  ACHIEVEMENT_EARNED: 50,
} as const
