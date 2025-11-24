import * as React from "react"
import { cn } from "@/lib/utils"

interface LeaderboardTabsProps extends React.ComponentProps<"div"> {
  activePeriod: "week" | "alltime"
  onPeriodChange: (period: "week" | "alltime") => void
}

function LeaderboardTabs({
  activePeriod,
  onPeriodChange,
  className,
  ...props
}: LeaderboardTabsProps) {
  return (
    <div
      data-slot="leaderboard-tabs"
      className={cn(
        "bg-stone-50 rounded-xl p-1 flex gap-1 w-fit",
        className
      )}
      {...props}
    >
      <button
        onClick={() => onPeriodChange("week")}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          activePeriod === "week"
            ? "bg-white text-stone-900 shadow-sm border border-stone-200"
            : "text-stone-500 hover:text-stone-700"
        )}
      >
        This Week
      </button>
      <button
        onClick={() => onPeriodChange("alltime")}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          activePeriod === "alltime"
            ? "bg-white text-stone-900 shadow-sm border border-stone-200"
            : "text-stone-500 hover:text-stone-700"
        )}
      >
        All Time
      </button>
    </div>
  )
}

export { LeaderboardTabs }
