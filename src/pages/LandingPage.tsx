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
      className={cn("min-h-screen flex flex-col bg-stone-50", className)}
      {...props}
    >
      <div className="relative flex flex-col flex-1">
        <Navigation />
        <Header />

        <div className="max-w-2xl mx-auto w-full px-4 py-8">
          <LeaderboardCard
            players={currentData.players}
            currentUser={currentData.currentUser}
            activePeriod={period}
            onPeriodChange={setPeriod}
          />
        </div>

        <Footer />
      </div>
    </div>
  )
}

export { LandingPage }
