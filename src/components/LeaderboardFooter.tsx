import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

function LeaderboardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="leaderboard-footer"
      className={cn(
        "bg-stone-50 border-t border-stone-100 p-4 flex items-center justify-center",
        className
      )}
      {...props}
    >
      <button
        type="button"
        className="text-sm text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-2 font-medium cursor-pointer"
        onClick={() => console.log("View full leaderboard")}
      >
        View full leaderboard
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export { LeaderboardFooter }
