import * as React from "react"
import { Navigation } from "@/components/Navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { cn } from "@/lib/utils"

function LandingPage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="landing-page"
      className={cn("min-h-screen flex flex-col bg-stone-50", className)}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50 to-white pointer-events-none" />

      <div className="relative flex flex-col flex-1">
        <Navigation />
        <Header />

        <div className="max-w-2xl mx-auto w-full px-4 flex-1 flex items-center justify-center">
          {/* Main content area - will contain LeaderboardCard in future phases */}
          <div className="w-full" />
        </div>

        <Footer />
      </div>
    </div>
  )
}

export { LandingPage }
