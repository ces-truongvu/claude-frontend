import * as React from "react"
import { cn } from "@/lib/utils"

function Navigation({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="navigation"
      className={cn(
        "w-full max-w-2xl mx-auto pt-8 pb-4 px-6 flex items-center justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-medium tracking-tighter text-sm rotate-3">
          LB
        </div>
        <span className="font-semibold tracking-tight text-lg text-stone-900">
          Leaderboard
        </span>
      </div>

      <button
        className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
        onClick={() => console.log("Login clicked")}
      >
        Log in
      </button>
    </nav>
  )
}

export { Navigation }
