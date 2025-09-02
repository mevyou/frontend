import { Header } from '@/components/Header'
import { BettingDashboard } from '@/components/BettingDashboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BettingDashboard />
    </div>
  )
}
