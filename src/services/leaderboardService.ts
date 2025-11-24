/**
 * Leaderboard API Service
 *
 * This service handles all leaderboard-related API calls.
 * Currently uses mock data, but designed for easy integration with a real backend.
 */

import type { LeaderboardData } from "@/types/leaderboard"
import { mockLeaderboardData } from "@/data/mockLeaderboard"

/**
 * Fetch leaderboard data for a specific period
 *
 * @param period - The time period to fetch ('week' or 'alltime')
 * @returns Promise<LeaderboardData> - The leaderboard data for the requested period
 *
 * @example
 * const data = await fetchLeaderboard('week')
 * console.log(data.players)
 */
export async function fetchLeaderboard(
  period: "week" | "alltime"
): Promise<LeaderboardData> {
  // TODO: Replace with actual API call to backend
  // const response = await fetch(`/api/leaderboard?period=${period}`)
  // if (!response.ok) throw new Error('Failed to fetch leaderboard')
  // return response.json()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockLeaderboardData[period]
}

/**
 * Expected API Response Format
 *
 * GET /api/leaderboard?period=week
 *
 * Response:
 * {
 *   "period": "week",
 *   "players": [
 *     {
 *       "id": "1",
 *       "rank": 1,
 *       "name": "Felix",
 *       "username": "@felixcodes",
 *       "avatar": "https://api.dicebear.com/...",
 *       "score": 4250,
 *       "trend": "up",
 *       "trendValue": 120,
 *       "isVerified": true,
 *       "isTopRank": true
 *     },
 *     ...
 *   ],
 *   "currentUser": {
 *     "id": "guest",
 *     "rank": 42,
 *     "name": "Guest User",
 *     "username": "@guest",
 *     "avatar": "https://api.dicebear.com/...",
 *     "score": 2340,
 *     "trend": "up",
 *     "trendValue": 45,
 *     "isVerified": false,
 *     "isTopRank": false
 *   }
 * }
 */

/**
 * Future API Integration Notes:
 *
 * 1. Replace mock data with actual API calls
 * 2. Add error handling for network failures
 * 3. Implement request caching (optional)
 * 4. Add loading and error states to LandingPage
 * 5. Implement real-time updates via WebSocket (Phase 7)
 * 6. Add authentication if required by backend
 * 7. Rate limit API calls if necessary
 */
