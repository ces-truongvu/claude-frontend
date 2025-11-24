import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn(
        "max-w-2xl mx-auto w-full flex flex-col gap-4 py-8 px-4",
        className
      )}
      {...props}
    >
      <div className="inline-flex items-center gap-2 w-fit">
        <div className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          Weekly Refresh
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-semibold text-stone-900">
        Top Wigglers
      </h1>

      <p className="text-stone-500 max-w-md">
        The friendliest competition on the internet. Join the wiggle, track your
        rank, and celebrate your fellow wigglers.
      </p>
    </header>
  )
}

export { Header }
