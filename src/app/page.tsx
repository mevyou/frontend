import { Header } from '@/components/Header'
import { BettingDashboard } from '@/components/BettingDashboard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <BettingDashboard />
    </div>
  )
}
