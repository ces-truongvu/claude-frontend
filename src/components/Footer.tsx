import * as React from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "py-8 text-center text-stone-400 text-sm font-normal",
        className
      )}
      {...props}
    >
      <p className="flex items-center justify-center gap-2">
        Made with <Heart className="w-3 h-3 fill-stone-400" strokeWidth={1.5} /> for wigglers
        everywhere.
      </p>
    </footer>
  )
}

export { Footer }
