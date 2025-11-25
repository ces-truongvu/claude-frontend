import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Player } from "@/types/leaderboard"

interface CurrentUserBannerProps extends React.ComponentProps<"button"> {
  player: Player
}

function CurrentUserBannerComponent({
  player,
  className,
  ...props
}: CurrentUserBannerProps) {
  return (
    <button
      type="button"
      data-slot="current-user-banner"
      className={cn(
        "bg-stone-900 text-white rounded-xl p-4 flex items-center justify-between shadow-lg shadow-stone-300/50 transform transition-transform hover:scale-[1.01] cursor-pointer w-full",
        className
      )}
      onClick={() => console.log("View profile")}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-700 text-sm font-semibold">
          {player.rank}
        </div>
        <div className="flex flex-col items-start">
          <span className="font-medium text-sm text-stone-200">You</span>
          <span className="font-semibold text-base">{player.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-lg font-semibold">
          {player.score.toLocaleString()}
        </span>
        <ChevronRight className="w-5 h-5 text-stone-500" strokeWidth={1.5} />
      </div>
    </button>
  )
}

const CurrentUserBanner = React.memo(CurrentUserBannerComponent)

export { CurrentUserBanner }
