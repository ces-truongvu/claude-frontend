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
      <div className="p-4 border-b border-stone-100">
        <LeaderboardTabs
          activePeriod={activePeriod}
          onPeriodChange={onPeriodChange}
        />
      </div>

      {/* Leaderboard list */}
      <div className="p-3 flex flex-col gap-2">
        {players.map((player, index) => (
          <React.Fragment key={player.id}>
            <LeaderboardItem
              player={player}
              variant={getVariant(player.rank)}
            />
            {/* Divider after rank 3 */}
            {index === 2 && players.length > 3 && (
              <div className="h-px bg-stone-100 my-1" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current user banner */}
      <div className="px-4 py-3 bg-stone-50/50">
        <CurrentUserBanner player={currentUser} />
      </div>

      {/* Footer */}
      <LeaderboardFooter />
    </div>
  )
}

export { LeaderboardCard }
