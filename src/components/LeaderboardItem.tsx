import * as React from "react"
import {
  BadgeCheck,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Player } from "@/types/leaderboard"

interface LeaderboardItemProps extends React.ComponentProps<"div"> {
  player: Player
  variant?: "top1" | "top3" | "default"
}

function getRankBadgeStyles(
  variant?: "top1" | "top3" | "default",
  rank?: number
) {
  switch (variant) {
    case "top1":
      return "bg-yellow-100 text-yellow-700 w-10 h-10 border-2 border-white shadow-sm"
    case "top3":
      if (rank === 2) {
        return "bg-stone-100 text-stone-600 w-10 h-10 border-2 border-white shadow-sm"
      }
      return "bg-orange-100 text-orange-800 w-10 h-10 border-2 border-white shadow-sm"
    case "default":
      return "text-stone-400 w-10 h-10"
  }
}

function getTrendIcon(trend: "up" | "down" | "neutral", size = "w-3 h-3") {
  switch (trend) {
    case "up":
      return <TrendingUp className={cn(size, "text-green-600")} strokeWidth={1.5} />
    case "down":
      return <TrendingDown className={cn(size, "text-red-500")} strokeWidth={1.5} />
    case "neutral":
      return <Minus className={cn(size, "text-stone-400")} strokeWidth={1.5} />
  }
}

function getTrendBadgeStyles(trend: "up" | "down" | "neutral") {
  switch (trend) {
    case "up":
      return "bg-green-50 text-green-600"
    case "down":
      return "bg-red-50 text-red-500"
    case "neutral":
      return "text-stone-400"
  }
}

function getHoverStyles(variant?: "top1" | "top3" | "default", rank?: number) {
  switch (variant) {
    case "top1":
      return "hover:bg-yellow-50/50 hover:border-yellow-100 hover-bounce"
    case "top3":
      if (rank === 2) {
        return "hover:bg-stone-50 hover:border-stone-200 hover-bounce"
      }
      return "hover:bg-orange-50/50 hover:border-orange-100 hover-bounce"
    case "default":
      return "hover:bg-stone-50 hover:border-stone-200"
  }
}

function getLeftAccentColor(variant?: "top1" | "top3" | "default") {
  switch (variant) {
    case "top1":
      return "left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-2xl"
    default:
      return ""
  }
}

function LeaderboardItemComponent({
  player,
  variant = "default",
  className,
  ...props
}: LeaderboardItemProps) {
  return (
    <div
      data-slot="leaderboard-item"
      className={cn(
        "group relative flex items-center gap-4 p-3 rounded-2xl border border-transparent transition-all duration-200 cursor-pointer",
        getHoverStyles(variant, player.rank),
        className
      )}
      onClick={() => console.log("Player:", player.name)}
      {...props}
    >
      {/* Left accent bar - Only for Rank 1 in HTML example, but let's keep logic generic if needed */}
      {variant === "top1" && (
        <div
          className={cn(
            "absolute opacity-0 group-hover:opacity-100 transition-opacity",
            getLeftAccentColor(variant)
          )}
        />
      )}

      {/* Rank badge */}
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center rounded-full font-semibold text-lg",
          getRankBadgeStyles(variant, player.rank)
        )}
      >
        {player.rank}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0 relative">
        <img
          src={player.avatar}
          alt={player.name}
          loading="lazy"
          className={cn(
            "w-12 h-12 rounded-full bg-stone-100 border border-stone-100",
            variant !== "top1" &&
            variant !== "top3" &&
            "grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
          )}
        />
        {variant === "top1" && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-stone-100">
            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[10px]">
              👑
            </div>
          </div>
        )}
      </div>

      {/* Player info */}
      <div className="flex flex-col">
        <span className="text-stone-900 font-semibold text-base flex items-center gap-1">
          {player.name}
          {player.isVerified && (
            <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-50" strokeWidth={1.5} />
          )}
        </span>
        <span className="text-stone-400 text-sm font-normal">
          @{player.username}
        </span>
      </div>

      {/* Score and trend */}
      <div className="ml-auto flex flex-col items-end">
        <span className="text-stone-900 font-semibold text-lg tracking-tight">
          {player.score.toLocaleString()}
        </span>
        <span
          className={cn(
            "text-xs font-medium flex items-center gap-0.5 px-1.5 rounded-md",
            getTrendBadgeStyles(player.trend)
          )}
        >
          {getTrendIcon(player.trend)} {Math.abs(player.trendValue)}%
        </span>
      </div>
    </div>
  )
}

const LeaderboardItem = React.memo(LeaderboardItemComponent)

export { LeaderboardItem }
