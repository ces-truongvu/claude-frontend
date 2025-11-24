/**
 * Leaderboard type definitions
 */

export interface Player {
  id: string
  rank: number
  name: string
  username: string
  avatar: string
  score: number
  trend: "up" | "down" | "neutral"
  trendValue: number
  isVerified?: boolean
  isTopRank?: boolean
}

export interface LeaderboardData {
  period: "week" | "alltime"
  players: Player[]
  currentUser: Player
}
