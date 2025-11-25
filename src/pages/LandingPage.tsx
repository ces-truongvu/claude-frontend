import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { LeaderboardCard } from "@/components/LeaderboardCard"
import { cn } from "@/lib/utils"
import { mockLeaderboardData } from "@/data/mockLeaderboard"

function LandingPage({ className, ...props }: React.ComponentProps<"div">) {
  const [period, setPeriod] = useState<"week" | "alltime">("week")

  const currentData = mockLeaderboardData[period]

  return (
    <div
      data-slot="landing-page"
      className={cn(
        "min-h-screen flex flex-col bg-stone-50 text-stone-800 antialiased selection:bg-purple-200 selection:text-purple-900",
        className
      )}
      {...props}
    >
      <div className="flex flex-col min-h-screen">
        <Navigation />

        <main className="flex-grow w-full max-w-2xl mx-auto px-4 sm:px-6 pb-12 flex flex-col">
          <Header />

          <LeaderboardCard
            players={currentData.players}
            currentUser={currentData.currentUser}
            activePeriod={period}
            onPeriodChange={setPeriod}
          />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export { LandingPage }
