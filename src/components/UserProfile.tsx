"use client";

import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import { Trophy, TrendingUp, TrendingDown, Clock, DollarSign, User, Copy, ExternalLink } from "lucide-react";
import { AppImages } from "@/lib/appImages";
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
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export function UserProfile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const isLoading = false;
  const { profile } = useAuth();

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

  // At this point we know address is defined
  const ensuredAddress = address as string;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="self-stretch p-6 bg-zinc-900 rounded-lg outline outline-offset-[-1px] inline-flex flex-col justify-start items-start gap-6 overflow-hidden" style={{ borderColor: 'rgba(45,45,51,1)' }}>
        <div className="self-stretch inline-flex justify-between items-center">
          <div className="text-white text-2xl font-semibold leading-7">Profile</div>
          <button onClick={copyAddress} className="pl-3 pr-4 py-2 bg-cyan-400/10 rounded-[99px] outline outline-offset-[-0.50px] outline-cyan-400 flex items-center gap-1 text-white text-sm font-medium">
            <span>Share profile link</span>
          </button>
        </div>

        <div className="self-stretch outline outline-offset-[-1px] rounded-2xl p-4" style={{ borderColor: 'rgba(45,45,51,1)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left: Profile card (spans 2) */}
            <div className="lg:col-span-2 bg-neutral-900 rounded-2xl outline p-6 flex items-center gap-6" style={{ borderColor: 'rgba(45,45,51,1)' }}>
              <div className="w-20 h-20 bg-neutral-800 rounded-full overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={profile?.image || AppImages.defaultAvatar} alt="avatar" />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <div className="text-white text-2xl font-bold leading-normal truncate">{profile?.name || profile?.username || 'Your Profile'}</div>
                <div className="inline-flex items-center gap-2">
                  <div className="text-gray-400 text-base font-medium leading-none">{formatAddress(ensuredAddress)}</div>
                  <button onClick={openInExplorer} className="text-gray-400 hover:text-white" title="View on Etherscan"><ExternalLink size={16} /></button>
                </div>
              </div>
            </div>

            {/* Right: 3 stat tiles */}
            <div className="bg-neutral-800 rounded-2xl outline p-6 flex flex-col items-center justify-center" style={{ borderColor: 'rgba(45,45,51,1)' }}>
              <div className="text-gray-400 text-base font-semibold leading-none">Points</div>
              <div className="text-white text-2xl font-bold leading-loose">2.5k pts</div>
            </div>
            <div className="bg-neutral-800 rounded-2xl outline p-6 flex flex-col items-center justify-center" style={{ borderColor: 'rgba(45,45,51,1)' }}>
              <div className="text-gray-400 text-base font-semibold leading-none">Total Profit/Loss</div>
              <div className="text-green-400 text-2xl font-bold leading-loose">+ $9,353.25</div>
            </div>
            <div className="bg-neutral-800 rounded-2xl outline p-6 flex flex-col items-center justify-center" style={{ borderColor: 'rgba(45,45,51,1)' }}>
              <div className="text-gray-400 text-base font-semibold leading-none">Rank</div>
              <div className="text-white text-2xl font-bold leading-loose">48,101</div>
            </div>
          </div>
        </div>

          <div className="self-stretch p-1 bg-neutral-800 rounded-2xl outline outline-offset-[-1px] flex flex-col justify-start items-start overflow-hidden" style={{ borderColor: 'rgba(45,45,51,1)' }}>
            <div className="self-stretch px-4 pt-4 pb-3 inline-flex justify-between items-center">
              <div className="w-28 flex items-center gap-2">
                <div className="text-white text-base font-medium leading-normal">Analytics</div>
              </div>
              <div className="px-4 py-2 rounded-[99px] outline outline-offset-[-1px] outline-gray-400/25 flex items-center gap-1">
                <div className="text-white text-sm font-bold leading-none">Overall</div>
              </div>
            </div>

            <div className="self-stretch bg-neutral-900 rounded-xl flex flex-col justify-start items-start overflow-hidden">
              <div className="self-stretch p-4 inline-flex justify-center items-center gap-2">
                <div className="flex-1 p-4 bg-neutral-800 rounded-xl inline-flex flex-col justify-center items-start gap-2">
                  <div className="text-gray-400 text-sm">Total wagers</div>
                  <div className="text-white text-xl font-bold">{userStats.totalBets}</div>
                </div>
                <div className="flex-1 p-4 bg-neutral-800 rounded-xl inline-flex flex-col justify-center items-start gap-2">
                  <div className="text-gray-400 text-sm">Total Amount staked</div>
                  <div className="text-white text-xl font-bold">{formatWeiToEther(userStats.totalStaked)} ETH</div>
                </div>
                <div className="flex-1 p-4 bg-neutral-800 rounded-xl inline-flex flex-col justify-center items-start gap-2">
                  <div className="text-gray-400 text-sm">Win rate</div>
                  <div className="text-white text-xl font-bold">{userStats.winRate.toFixed(1)}%</div>
                </div>
              </div>

              <div className="self-stretch h-[0.50px] bg-neutral-800" />

              <div className="self-stretch py-4 flex flex-col justify-start items-start">
                <div className="px-4 inline-flex items-center gap-2.5">
                  <div className="text-white text-base font-medium">Badges</div>
                </div>
                <div className="self-stretch p-4 flex flex-col gap-3">
                  <div className="self-stretch inline-flex justify-between items-center">
                    <div className="w-24 h-20 px-6 py-4 bg-cyan-400/10 rounded-2xl outline outline-cyan-400" />
                    <div className="w-24 h-20 px-6 py-4 bg-neutral-800 rounded-2xl" />
                    <div className="w-24 h-20 px-6 py-4 bg-neutral-800 rounded-2xl" />
                    <div className="w-24 h-20 px-6 py-4 bg-neutral-800 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Betting history (kept) */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm w-full">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Your Betting History</h2>
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
                const isCreator = bet.creator.toLowerCase() === ensuredAddress.toLowerCase();
                const isWinner = bet.winner.toLowerCase() === ensuredAddress.toLowerCase();
                const isResolved = bet.status === BetStatus.RESOLVED;

                return (
                  <div key={bet.id.toString()} className="bg-muted border border-border rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-card-foreground mb-1">{truncateText(bet.description, 80)}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Role: {isCreator ? "Creator" : "Opponent"}</span>
                          <span>Stake: {formatWeiToEther(bet.amount)} ETH</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getBetStatusColor(bet.status))}>{getBetStatusText(bet.status)}</span>
                        {isResolved && (
                          <div className={cn("text-sm font-medium mt-1", isWinner ? "text-green-500" : "text-brand-red")}>{isWinner ? "Won" : "Lost"}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No betting history yet</p>
              <p className="text-muted-foreground/70 text-sm">Create or join your first bet to get started!</p>
            </div>
          )}
        </div>
      </div>
  );
}
