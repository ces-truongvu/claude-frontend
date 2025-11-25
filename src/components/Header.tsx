import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn("text-center py-10 space-y-3", className)}
      {...props}
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium mb-2 border border-purple-200">
        <Sparkles className="w-3 h-3" strokeWidth={1.5} />
        <span>Weekly Refresh</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900">
        Top Wigglers
      </h1>

      <p className="text-stone-500 text-lg font-light max-w-md mx-auto">
        The friendliest competition on the internet.
        <br className="hidden sm:block" />
        Keep wiggling to reach the top!
      </p>
    </header>
  )
}

export { Header }
