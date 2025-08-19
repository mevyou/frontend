'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Clock, User, Trophy, X, Check } from 'lucide-react'
import { Bet, BetStatus } from '@/lib/contracts/BettingContract'
import { useJoinBet, useCancelBet, useResolveBet } from '@/hooks/useBetting'
import { formatWeiToEther, formatAddress, getTimeUntilDeadline, getBetStatusText, getBetStatusColor, cn, truncateText } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface BetCardProps {
  bet: Bet
  onUpdate: () => void
}

export function BetCard({ bet, onUpdate }: BetCardProps) {
  const { address } = useAccount()
  const { joinBet, isPending: isJoining } = useJoinBet()
  const { cancelBet, isPending: isCancelling } = useCancelBet()
  const { resolveBet, isPending: isResolving } = useResolveBet()
  const [showResolveOptions, setShowResolveOptions] = useState(false)

  const isCreator = address && bet.creator.toLowerCase() === address.toLowerCase()
  const isOpponent = address && bet.opponent.toLowerCase() === address.toLowerCase()
  const isParticipant = isCreator || isOpponent
  const canJoin = address && bet.status === BetStatus.OPEN && !isCreator
  const canCancel = isCreator && bet.status === BetStatus.OPEN
  const canResolve = isParticipant && bet.status === BetStatus.MATCHED
  const isExpired = getTimeUntilDeadline(bet.deadline) === 'Expired'

  const handleJoinBet = async () => {
    if (!address) {
      toast.error('Please connect your wallet')
      return
    }
    
    await joinBet(bet.id, bet.amount)
    onUpdate()
  }

  const handleCancelBet = async () => {
    await cancelBet(bet.id)
    onUpdate()
  }

  const handleResolveBet = async (winner: string) => {
    await resolveBet(bet.id, winner)
    setShowResolveOptions(false)
    onUpdate()
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          getBetStatusColor(bet.status)
        )}>
          {getBetStatusText(bet.status)}
        </span>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {formatWeiToEther(bet.amount)} ETH
          </div>
          <div className="text-sm text-gray-400">Stake Amount</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {truncateText(bet.description, 60)}
        </h3>
      </div>

      {/* Participants */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-gray-400" />
          <span className="text-gray-400">Creator:</span>
          <span className="text-white font-medium">{formatAddress(bet.creator)}</span>
          {isCreator && <span className="text-blue-400 text-xs">(You)</span>}
        </div>
        {bet.opponent !== '0x0000000000000000000000000000000000000000' && (
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-gray-400" />
            <span className="text-gray-400">Opponent:</span>
            <span className="text-white font-medium">{formatAddress(bet.opponent)}</span>
            {isOpponent && <span className="text-blue-400 text-xs">(You)</span>}
          </div>
        )}
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Clock size={14} />
        <span>{getTimeUntilDeadline(bet.deadline)}</span>
        {isExpired && <span className="text-red-400 font-medium">(Expired)</span>}
      </div>

      {/* Winner (if resolved) */}
      {bet.status === BetStatus.RESOLVED && bet.winner !== '0x0000000000000000000000000000000000000000' && (
        <div className="flex items-center gap-2 text-sm mb-4 p-2 bg-green-900/20 rounded-lg border border-green-800">
          <Trophy size={14} className="text-yellow-400" />
          <span className="text-gray-400">Winner:</span>
          <span className="text-green-400 font-medium">{formatAddress(bet.winner)}</span>
          {address && bet.winner.toLowerCase() === address.toLowerCase() && (
            <span className="text-yellow-400 text-xs">(You won!)</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {canJoin && !isExpired && (
          <button
            onClick={handleJoinBet}
            disabled={isJoining}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isJoining ? 'Joining...' : `Join Bet (${formatWeiToEther(bet.amount)} ETH)`}
          </button>
        )}

        {canCancel && (
          <button
            onClick={handleCancelBet}
            disabled={isCancelling}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} />
            {isCancelling ? 'Cancelling...' : 'Cancel Bet'}
          </button>
        )}

        {canResolve && !showResolveOptions && (
          <button
            onClick={() => setShowResolveOptions(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trophy size={16} />
            Resolve Bet
          </button>
        )}

        {showResolveOptions && (
          <div className="space-y-2">
            <div className="text-sm text-gray-400 text-center mb-2">Who won this bet?</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleResolveBet(bet.creator)}
                disabled={isResolving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Check size={14} />
                Creator
              </button>
              <button
                onClick={() => handleResolveBet(bet.opponent)}
                disabled={isResolving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Check size={14} />
                Opponent
              </button>
            </div>
            <button
              onClick={() => setShowResolveOptions(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {bet.status === BetStatus.OPEN && isExpired && (
          <div className="text-center text-red-400 text-sm py-2">
            This bet has expired
          </div>
        )}
      </div>
    </div>
  )
}