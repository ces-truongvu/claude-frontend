import * as React from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "max-w-2xl mx-auto w-full flex items-center justify-center gap-2 py-6 text-stone-400 text-sm",
        className
      )}
      {...props}
    >
      <span>Made with</span>
      <Heart className="w-3 h-3 fill-current" />
      <span>for wigglers everywhere</span>
    </footer>
  )
}

export { Footer }
