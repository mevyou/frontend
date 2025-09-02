'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { BetCard } from './BetCard'
import { CreateBetModal } from './CreateBetModal'
import { Plus, RefreshCw, Filter } from 'lucide-react'
import { BetStatus } from '@/lib/contracts/BettingContract'
import { cn } from '@/lib/utils'
import { dummyBets } from '@/lib/dummyData'

type FilterType = 'all' | 'open' | 'matched' | 'resolved' | 'my-bets'

export function BettingDashboard() {
  const { address } = useAccount()
  const [bets] = useState(dummyBets)
  const [isLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const refetch = () => {
    // Placeholder for refetch functionality
  }

  const filteredBets = bets.filter(bet => {
    switch (filter) {
      case 'open':
        return bet.status === BetStatus.OPEN
      case 'matched':
        return bet.status === BetStatus.MATCHED
      case 'resolved':
        return bet.status === BetStatus.RESOLVED
      case 'my-bets':
        return address && (bet.creator.toLowerCase() === address.toLowerCase() ||
          bet.opponent.toLowerCase() === address.toLowerCase())
      default:
        return true
    }
  })

  const filterOptions = [
    { value: 'all', label: 'All Bets', count: bets.length },
    { value: 'open', label: 'Open', count: bets.filter(b => b.status === BetStatus.OPEN).length },
    { value: 'matched', label: 'Matched', count: bets.filter(b => b.status === BetStatus.MATCHED).length },
    { value: 'resolved', label: 'Resolved', count: bets.filter(b => b.status === BetStatus.RESOLVED).length },
    {
      value: 'my-bets', label: 'My Bets', count: address ? bets.filter(b =>
        b.creator.toLowerCase() === address.toLowerCase() ||
        b.opponent.toLowerCase() === address.toLowerCase()).length : 0
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Betting Dashboard</h1>
          <p className="text-muted-foreground mt-1">Create and join peer-to-peer bets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent hover:text-accent-foreground text-card-foreground rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={cn(isRefreshing && 'animate-spin')} />
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={16} />
            Create Bet
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter size={16} />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as FilterType)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
              filter === option.value
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border-gray-200 hover:border-accent'
            )}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>

      {/* Bets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse shadow-sm">
              <div className="h-4 bg-muted-foreground/20 rounded mb-4"></div>
              <div className="h-3 bg-muted-foreground/20 rounded mb-2"></div>
              <div className="h-3 bg-muted-foreground/20 rounded mb-4"></div>
              <div className="h-8 bg-muted-foreground/20 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredBets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBets.map(bet => (
            <BetCard key={bet.id.toString()} bet={bet} onUpdate={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">
            {filter === 'all' ? 'No bets available' : `No ${filter.replace('-', ' ')} found`}
          </div>
          <p className="text-muted-foreground/70 text-sm">
            {filter === 'all' ? 'Be the first to create a bet!' : 'Try adjusting your filter'}
          </p>
        </div>
      )}

      {/* Create Bet Modal */}
      <CreateBetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          refetch()
        }}
      />
    </div>
  )
}