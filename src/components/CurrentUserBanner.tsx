import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Player } from "@/types/leaderboard"

interface CurrentUserBannerProps extends React.ComponentProps<"div"> {
  player: Player
}

function CurrentUserBanner({
  player,
  className,
  ...props
}: CurrentUserBannerProps) {
  return (
    <div
      data-slot="current-user-banner"
      className={cn(
        "bg-stone-900 text-white rounded-lg p-4 flex items-center justify-between shadow-lg shadow-stone-300/50 hover:scale-[1.01] transition-transform duration-200 cursor-pointer",
        className
      )}
      onClick={() => console.log("View profile")}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center font-semibold text-sm">
          {player.rank}
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-stone-200">You</span>
          <span className="font-semibold text-stone-100">{player.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-semibold">
          {player.score.toLocaleString()}
        </span>
        <ChevronRight className="w-5 h-5 text-stone-500" />
      </div>
    </div>
  )
}

export { CurrentUserBanner }
