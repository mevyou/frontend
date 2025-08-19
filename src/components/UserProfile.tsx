'use client'

import { useMemo } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { Trophy, TrendingUp, TrendingDown, Clock, DollarSign, User, Copy, ExternalLink } from 'lucide-react'
import { useGetAllBets } from '@/hooks/useBetting'
import { BetStatus } from '@/lib/contracts/BettingContract'
import { formatWeiToEther, formatAddress, getBetStatusText, getBetStatusColor, cn, truncateText } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { dummyBets, getUserStats } from '@/lib/dummyData'

export function UserProfile() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const bets = dummyBets
  const isLoading = false

  const userStats = useMemo(() => {
    if (!address) {
      return {
        totalBets: 0,
        activeBets: 0,
        wonBets: 0,
        lostBets: 0,
        totalStaked: BigInt(0),
        totalWinnings: BigInt(0),
        winRate: 0
      }
    }
    return getUserStats(address)
  }, [address])

  const userBets = useMemo(() => {
    if (!address) return []
    return dummyBets
      .filter(bet => 
        bet.creator.toLowerCase() === address.toLowerCase() || 
        bet.opponent.toLowerCase() === address.toLowerCase()
      )
      .sort((a, b) => Number(b.id) - Number(a.id))
  }, [address])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    }
  }

  const openInExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank')
    }
  }

  if (!isConnected || !address) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">Your Profile</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">Address:</span>
              <span className="text-white font-mono">{formatAddress(address)}</span>
              <button
                onClick={copyAddress}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy address"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={openInExplorer}
                className="text-gray-400 hover:text-white transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink size={16} />
              </button>
            </div>
            {balance && (
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400" />
                <span className="text-white font-medium">
                  {parseFloat(formatWeiToEther(balance.value)).toFixed(4)} ETH
                </span>
                <span className="text-gray-400">Balance</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-400" />
            <span className="text-gray-400 text-sm">Total Bets</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.totalBets}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-yellow-400" />
            <span className="text-gray-400 text-sm">Active</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.activeBets}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-green-400" />
            <span className="text-gray-400 text-sm">Won</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.wonBets}</div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-red-400" />
            <span className="text-gray-400 text-sm">Lost</span>
          </div>
          <div className="text-2xl font-bold text-white">{userStats.lostBets}</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Total Staked</div>
          <div className="text-xl font-bold text-white">
            {formatWeiToEther(userStats.totalStaked)} ETH
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Total Winnings</div>
          <div className="text-xl font-bold text-green-400">
            {formatWeiToEther(userStats.totalWinnings)} ETH
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">Win Rate</div>
          <div className="text-xl font-bold text-white">
            {userStats.winRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Betting History */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your Betting History</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-700 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded mb-1"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : userBets.length > 0 ? (
          <div className="space-y-3">
            {userBets.map(bet => {
              const isCreator = bet.creator.toLowerCase() === address.toLowerCase()
              const isWinner = bet.winner.toLowerCase() === address.toLowerCase()
              const isResolved = bet.status === BetStatus.RESOLVED
              
              return (
                <div key={bet.id.toString()} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">
                        {truncateText(bet.description, 80)}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Role: {isCreator ? 'Creator' : 'Opponent'}</span>
                        <span>Stake: {formatWeiToEther(bet.amount)} ETH</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getBetStatusColor(bet.status)
                      )}>
                        {getBetStatusText(bet.status)}
                      </span>
                      {isResolved && (
                        <div className={cn(
                          'text-sm font-medium mt-1',
                          isWinner ? 'text-green-400' : 'text-red-400'
                        )}>
                          {isWinner ? 'Won' : 'Lost'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-400">No betting history yet</p>
            <p className="text-gray-500 text-sm">Create or join your first bet to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}