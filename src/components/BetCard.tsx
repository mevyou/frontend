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
    <div className="bg-card border-[1px] border-gray-200 rounded-xl p-6 hover:border-accent transition-all duration-200 hover:shadow-sm border-border">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          getBetStatusColor(bet.status)
        )}>
          {getBetStatusText(bet.status)}
        </span>
        <div className="text-right">
          <div className="text-2xl font-bold text-card-foreground">
            {formatWeiToEther(bet.amount)} ETH
          </div>
          <div className="text-sm text-muted-foreground">Stake Amount</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {truncateText(bet.description, 60)}
        </h3>
      </div>

      {/* Participants */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Creator:</span>
          <span className="text-card-foreground font-medium">{formatAddress(bet.creator)}</span>
          {isCreator && <span className="text-brand-blue text-xs">(You)</span>}
        </div>
        {bet.opponent !== '0x0000000000000000000000000000000000000000' && (
          <div className="flex items-center gap-2 text-sm">
            <User size={14} className="text-muted-foreground" />
            <span className="text-muted-foreground">Opponent:</span>
            <span className="text-card-foreground font-medium">{formatAddress(bet.opponent)}</span>
            {isOpponent && <span className="text-brand-blue text-xs">(You)</span>}
          </div>
        )}
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Clock size={14} />
        <span>{getTimeUntilDeadline(bet.deadline)}</span>
        {isExpired && <span className="text-brand-red font-medium">(Expired)</span>}
      </div>

      {/* Winner (if resolved) */}
      {bet.status === BetStatus.RESOLVED && bet.winner !== '0x0000000000000000000000000000000000000000' && (
        <div className="flex items-center gap-2 text-sm mb-4 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <Trophy size={14} className="text-yellow-500" />
          <span className="text-muted-foreground">Winner:</span>
          <span className="text-green-500 font-medium">{formatAddress(bet.winner)}</span>
          {address && bet.winner.toLowerCase() === address.toLowerCase() && (
            <span className="text-yellow-500 text-xs">(You won!)</span>
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
            className="w-full bg-brand-red hover:bg-red-700 disabled:bg-brand-red/50 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X size={16} />
            {isCancelling ? 'Cancelling...' : 'Cancel Bet'}
          </button>
        )}

        {canResolve && !showResolveOptions && (
          <button
            onClick={() => setShowResolveOptions(true)}
            className="w-full bg-brand-blue hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trophy size={16} />
            Resolve Bet
          </button>
        )}

        {showResolveOptions && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground text-center mb-2">Who won this bet?</div>
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
              className="w-full bg-muted hover:bg-accent hover:text-accent-foreground text-card-foreground py-1 px-4 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {bet.status === BetStatus.OPEN && isExpired && (
          <div className="text-center text-brand-red text-sm py-2">
            This bet has expired
          </div>
        )}
      </div>
    </div>
  )
}