import * as React from "react"
import { cn } from "@/lib/utils"

function Navigation({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="navigation"
      className={cn(
        "max-w-2xl mx-auto w-full flex items-center justify-between py-6 px-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center text-white font-semibold -rotate-3">
          LB
        </div>
        <span className="font-semibold tracking-tight text-stone-900">
          Leaderboard
        </span>
      </div>

      <button
        className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
        onClick={() => console.log("Login clicked")}
      >
        Login
      </button>
    </nav>
  )
}

export { Navigation }
