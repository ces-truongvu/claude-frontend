import * as React from "react"
import {
  BadgeCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Player } from "@/types/leaderboard"

interface LeaderboardItemProps extends React.ComponentProps<"div"> {
  player: Player
  variant?: "top1" | "top3" | "default"
}

function getRankBadgeStyles(variant?: string) {
  switch (variant) {
    case "top1":
      return "bg-yellow-100 text-yellow-700 w-10 h-10"
    case "top3":
      return "bg-orange-100 text-orange-800 w-10 h-10"
    default:
      if (variant === "top1" || variant === "top3") return ""
      return "text-stone-400 w-10 h-10"
  }
}

function getTrendIcon(trend: "up" | "down" | "neutral", size = "w-4 h-4") {
  switch (trend) {
    case "up":
      return <TrendingUp className={cn(size, "text-green-600")} />
    case "down":
      return <TrendingDown className={cn(size, "text-red-500")} />
    case "neutral":
      return <Minus className={cn(size, "text-stone-400")} />
  }
}

function getTrendBadgeStyles(trend: "up" | "down" | "neutral") {
  switch (trend) {
    case "up":
      return "bg-green-50 text-green-600"
    case "down":
      return "bg-red-50 text-red-500"
    case "neutral":
      return "bg-stone-50 text-stone-400"
  }
}

function getHoverStyles(variant?: string) {
  switch (variant) {
    case "top1":
      return "hover:bg-yellow-50/50 hover:border-yellow-100 hover:-translate-y-0.5"
    case "top3":
      return "hover:bg-orange-50/50 hover:border-orange-100 hover:-translate-y-0.5"
    default:
      return "hover:bg-stone-50 hover:border-stone-200 hover:-translate-y-0.5 grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
  }
}

function getLeftAccentColor(variant?: string) {
  switch (variant) {
    case "top1":
      return "left-0 top-0 bottom-0 w-1 bg-yellow-400"
    case "top3":
      return "left-0 top-0 bottom-0 w-1 bg-orange-400"
    default:
      return ""
  }
}

function LeaderboardItem({
  player,
  variant = "default",
  className,
  ...props
}: LeaderboardItemProps) {
  return (
    <div
      data-slot="leaderboard-item"
      className={cn(
        "relative bg-white border border-stone-100 rounded-lg p-3 flex items-center gap-3 transition-all duration-200",
        getHoverStyles(variant),
        className
      )}
      onClick={() => console.log("Player:", player.name)}
      {...props}
    >
      {/* Left accent bar */}
      {(variant === "top1" || variant === "top3") && (
        <div className={cn("absolute", getLeftAccentColor(variant))} />
      )}

      {/* Rank badge */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold text-sm flex-shrink-0",
          getRankBadgeStyles(variant)
        )}
      >
        {variant === "top1" ? (
          <Crown className="w-5 h-5" />
        ) : (
          <span>{player.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <img
        src={player.avatar}
        alt={player.name}
        className={cn(
          "w-12 h-12 rounded-full flex-shrink-0",
          variant !== "top1" && variant !== "top3" && "grayscale opacity-80"
        )}
      />

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-base text-stone-900 truncate">
            {player.name}
          </span>
          {player.isVerified && (
            <BadgeCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
          )}
        </div>
        <span className="text-stone-400 text-sm">@{player.username}</span>
      </div>

      {/* Score and trend */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="font-semibold text-lg tracking-tight text-stone-900">
          {player.score.toLocaleString()}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
            getTrendBadgeStyles(player.trend)
          )}
        >
          {getTrendIcon(player.trend, "w-3 h-3")}
          <span>{Math.abs(player.trendValue)}</span>
        </div>
      </div>
    </div>
  )
}

export { LeaderboardItem }
