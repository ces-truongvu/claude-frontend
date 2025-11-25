import * as React from "react"
import { cn } from "@/lib/utils"
import type { Player } from "@/types/leaderboard"
import { LeaderboardTabs } from "@/components/LeaderboardTabs"
import { LeaderboardItem } from "@/components/LeaderboardItem"
import { CurrentUserBanner } from "@/components/CurrentUserBanner"
import { LeaderboardFooter } from "@/components/LeaderboardFooter"

interface LeaderboardCardProps extends React.ComponentProps<"div"> {
  players: Player[]
  currentUser: Player
  activePeriod: "week" | "alltime"
  onPeriodChange: (period: "week" | "alltime") => void
}

function LeaderboardCard({
  players,
  currentUser,
  activePeriod,
  onPeriodChange,
  className,
  ...props
}: LeaderboardCardProps) {
  const getVariant = (rank: number): "top1" | "top3" | "default" => {
    if (rank === 1) return "top1"
    if (rank <= 3) return "top3"
    return "default"
  }

  return (
    <div
      data-slot="leaderboard-card"
      className={cn(
        "bg-white rounded-[2rem] shadow-xl shadow-stone-200/60 border border-stone-100 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Tabs */}
      <div className="flex items-center justify-between p-2 border-b border-stone-100">
        <LeaderboardTabs
          activePeriod={activePeriod}
          onPeriodChange={onPeriodChange}
        />
        <div className="hidden sm:flex items-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-wider px-4">
          <span>Rank</span>
          <span>Player</span>
          <span className="ml-auto">Score</span>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="flex flex-col p-3 gap-2">
        {players.map((player, index) => (
          <React.Fragment key={player.id}>
            <LeaderboardItem
              player={player}
              variant={getVariant(player.rank)}
            />
            {/* Divider after rank 3 */}
            {index === 2 && players.length > 3 && (
              <div className="h-px bg-stone-100 mx-4 my-1" />
            )}
          </React.Fragment>
        ))}

        {/* Current user banner */}
        <div className="mt-2 p-1">
          <CurrentUserBanner player={currentUser} />
        </div>
      </div>

      {/* Footer */}
      <LeaderboardFooter />
    </div>
  )
}

export { LeaderboardCard }
