"use client";

import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  User,
  Copy,
  ExternalLink,
} from "lucide-react";
import { BetStatus } from "@/lib/contracts/BettingContract";
import {
  formatWeiToEther,
  formatAddress,
  getBetStatusText,
  getBetStatusColor,
  cn,
  truncateText,
} from "@/lib/utils";
import { toast } from "react-hot-toast";
import { dummyBets, getUserStats } from "@/lib/dummyData";

export function UserProfile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const isLoading = false;

  const userStats = useMemo(() => {
    if (!address) {
      return {
        totalBets: 0,
        activeBets: 0,
        wonBets: 0,
        lostBets: 0,
        totalStaked: BigInt(0),
        totalWinnings: BigInt(0),
        winRate: 0,
      };
    }
    return getUserStats(address);
  }, [address]);

  const userBets = useMemo(() => {
    if (!address) return [];
    return dummyBets
      .filter(
        (bet) =>
          bet.creator.toLowerCase() === address.toLowerCase() ||
          bet.opponent.toLowerCase() === address.toLowerCase()
      )
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, "_blank");
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-brand-blue to-primary rounded-full flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Your Profile
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-muted-foreground">Address:</span>
              <span className="text-card-foreground font-mono">
                {formatAddress(address)}
              </span>
              <button
                onClick={copyAddress}
                className="text-muted-foreground hover:text-card-foreground transition-colors"
                title="Copy address"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={openInExplorer}
                className="text-muted-foreground hover:text-card-foreground transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink size={16} />
              </button>
            </div>
            {balance && (
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-muted-foreground" />
                <span className="text-card-foreground font-medium">
                  {parseFloat(formatWeiToEther(balance.value)).toFixed(4)} ETH
                </span>
                <span className="text-muted-foreground">Balance</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-brand-blue" />
            <span className="text-muted-foreground text-sm">Total Bets</span>
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {userStats.totalBets}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-yellow-500" />
            <span className="text-muted-foreground text-sm">Active</span>
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {userStats.activeBets}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={20} className="text-green-500" />
            <span className="text-muted-foreground text-sm">Won</span>
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {userStats.wonBets}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-brand-red" />
            <span className="text-muted-foreground text-sm">Lost</span>
          </div>
          <div className="text-2xl font-bold text-card-foreground">
            {userStats.lostBets}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="text-muted-foreground text-sm mb-1">Total Staked</div>
          <div className="text-xl font-bold text-card-foreground">
            {formatWeiToEther(userStats.totalStaked)} ETH
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="text-muted-foreground text-sm mb-1">
            Total Winnings
          </div>
          <div className="text-xl font-bold text-green-500">
            {formatWeiToEther(userStats.totalWinnings)} ETH
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="text-muted-foreground text-sm mb-1">Win Rate</div>
          <div className="text-xl font-bold text-card-foreground">
            {userStats.winRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Betting History */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-card-foreground mb-4">
          Your Betting History
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                <div className="h-3 bg-muted-foreground/20 rounded mb-1"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : userBets.length > 0 ? (
          <div className="space-y-3">
            {userBets.map((bet) => {
              const isCreator =
                bet.creator.toLowerCase() === address.toLowerCase();
              const isWinner =
                bet.winner.toLowerCase() === address.toLowerCase();
              const isResolved = bet.status === BetStatus.RESOLVED;

              return (
                <div
                  key={bet.id.toString()}
                  className="bg-muted border border-border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground mb-1">
                        {truncateText(bet.description, 80)}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Role: {isCreator ? "Creator" : "Opponent"}</span>
                        <span>Stake: {formatWeiToEther(bet.amount)} ETH</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getBetStatusColor(bet.status)
                        )}
                      >
                        {getBetStatusText(bet.status)}
                      </span>
                      {isResolved && (
                        <div
                          className={cn(
                            "text-sm font-medium mt-1",
                            isWinner ? "text-green-500" : "text-brand-red"
                          )}
                        >
                          {isWinner ? "Won" : "Lost"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrendingUp
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <p className="text-muted-foreground">No betting history yet</p>
            <p className="text-muted-foreground/70 text-sm">
              Create or join your first bet to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
