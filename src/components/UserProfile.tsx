"use client";

import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import { Trophy, TrendingUp, TrendingDown, Clock, DollarSign, User, Copy, ExternalLink, InfoIcon } from "lucide-react";
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
import { AppIcons } from "@/lib/appIcons";

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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Profile</h1>
          <button 
            onClick={copyAddress} 
            className="px-4 py-2 bg-cyan-400/10 rounded-full flex items-center gap-2 text-white text-sm font-medium hover:bg-cyan-400/20 transition-colors"
          >
            <span>Share profile link</span>
          </button>
        </div>

        {/* Main Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Profile card (spans 2) */}
          <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 flex items-center gap-6">
            <div className="w-20 h-20 bg-neutral-800 rounded-full overflow-hidden shrink-0">
              <img className="w-full h-full object-cover" src={profile?.image || AppImages.defaultAvatar} alt="avatar" />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <div className="text-white text-2xl font-bold leading-normal truncate">{profile?.name || profile?.username || 'Your Profile'}</div>
              <div className="inline-flex items-center gap-2">
                <div className="text-gray-400 text-base font-medium leading-none">{formatAddress(ensuredAddress)}</div>
                <button onClick={openInExplorer} className="text-gray-400 hover:text-white transition-colors" title="View on Etherscan">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: 3 stat tiles with icons */}
          <div className="bg-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-16 mb-2 flex items-center justify-center">
              <Image src={AppIcons.dollar} alt="Points" width={24} height={24} className="w-full h-full" />
            </div>
            <div className="text-gray-400 text-sm font-medium text-center">Points</div>
            <div className="text-white text-2xl font-bold">2.5k pts</div>
          </div>
          
          <div className="bg-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-16 mb-2 flex items-center justify-center">
              <Image src={AppIcons.dollarCoin} alt="Points" width={24} height={24} className="w-full h-full" />
            </div>
            <div className="text-gray-400 text-sm font-medium text-center">Total Profit/Loss</div>
            <div className="text-green-400 text-2xl font-bold">+ $9,353.25</div>
          </div>
          
          <div className="bg-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center">
            <div className="w-24 h-16 mb-2 flex items-center justify-center">
              <Image src={AppIcons.ranks} alt="Points" width={64} height={64} className="w-44 h-44" />
            </div>
            <div className="text-gray-400 text-sm font-medium text-center">Rank</div>
            <div className="text-white text-2xl font-bold">48,101</div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-black rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg font-medium">Analytics</h2>
            <div className="relative">
              <button className="px-4 py-2 bg-neutral-700 rounded-full flex items-center gap-2 text-white text-sm font-medium hover:bg-neutral-600 transition-colors">
                <span>Overall</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image src={AppIcons.greenBet} alt="Total wagers" width={24} height={24} className="w-full h-full" />
                </div>
                <div className="text-gray-400 text-sm">Total wagers</div>
              </div>
              <div className="text-white text-xl font-bold">{userStats.totalBets}</div>
            </div>
            
            <div className="rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image src={AppIcons.blueWallet} alt="Total Amount staked" width={24} height={24} className="w-full h-full" />
                </div>
                <div className="text-gray-400 text-sm">Total Amount staked</div>
              </div>
              <div className="text-white text-xl font-bold">{formatWeiToEther(userStats.totalStaked)} ETH</div>
            </div>
            
            <div className="rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Image src={AppIcons.winRate} alt="Win rate" width={24} height={24} className="w-full h-full" />
                </div>
                <div className="text-gray-400 text-sm">Win rate</div>
              </div>
              <div className="text-white text-xl font-bold">{userStats.winRate.toFixed(1)}%</div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="self-stretch py-4 inline-flex flex-col justify-start items-start scale-[0.85] -ml-24">
            <div className="px-4 inline-flex justify-center items-center gap-2.5">
              <div className="justify-start text-white text-base font-medium font-['Nunito_Sans'] leading-normal">Badges</div>
            </div>
            <div className="self-stretch p-4 flex flex-col justify-start items-center gap-1">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="w-24 h-20 px-6 py-4 relative border-2 border-white bg-[#242429] rounded-2xl flex justify-center items-center gap-5">
                    <div className="w-24 h-20 relative">
                      <Image className="w-full h-full mt-12 rounded-2xl" src={AppIcons.polygonWhite} alt="Challenger" width={96} height={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image className="w-11 h-9" src={AppIcons.challenger} alt="Challenger" width={44} height={38} />
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-20 px-6 py-4 relative bg-[#242429] rounded-2xl flex justify-center items-center gap-5">
                    <div className="w-24 h-20 relative">
                      <Image className="w-full h-full rounded-2xl mt-12" src={AppIcons.polygon} alt="Rival" width={96} height={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image className="w-8 h-10" src={AppIcons.rival} alt="Rival" width={34} height={40} />
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-20 px-6 py-4 relative bg-[#242429] rounded-2xl flex justify-center items-center gap-5">
                    <div className="w-24 h-20 relative">
                      <Image className="w-full h-full rounded-2xl mt-12" src={AppIcons.polygon} alt="Oracle" width={96} height={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image className="w-9 h-12" src={AppIcons.oracle} alt="Oracle" width={42} height={38} />
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-20 px-6 py-4 relative bg-[#242429] rounded-2xl flex justify-center items-center gap-5">
                    <div className="w-24 h-20 relative">
                      <Image className="w-full h-full rounded-2xl mt-12" src={AppIcons.polygon} alt="Champion" width={96} height={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image className="w-10 h-9" src={AppIcons.champion} alt="Champion" width={42} height={38} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch px-4 flex flex-col justify-start items-start gap-2.5 mb-5 mt-3">
                  <div data-percentage="20" data-show-number="false" data-state="Default" className="self-stretch h-2 inline-flex justify-start items-center gap-2">
                    <div className="flex-1 relative inline-flex flex-col justify-start items-start">
                      <div data-colour="Slate" data-type="Background" className=" w-full h-2 relative bg-[#242429] rounded-[256px]" />
                      <div data-colour="Slate" data-type="Fill" className="w-14 h-2 left-0 top-0 absolute bg-white rounded-[256px]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[1260px] relative inline-flex justify-between items-center">
                <div className="left-[1172px] top-[0.50px] absolute justify-start text-white text-base font-medium font-['Nunito_Sans'] leading-normal">Champion</div>
                <div className="left-[795px] top-0 absolute flex justify-center items-center gap-2.5">
                  <div className="justify-start text-white text-base font-medium font-['Nunito_Sans'] leading-normal">Oracle</div>
                </div>
                <div className="left-[416px] top-0 absolute justify-start text-white text-base font-medium font-['Nunito_Sans'] leading-normal">Rival</div>
                <div className="left-[14.50px] top-0 absolute justify-start text-white text-base font-medium font-['Nunito_Sans'] leading-normal">Challenger</div>
              </div>
            </div>
            <div className="self-stretch p-4 rounded-lg shadow-[0px_0px_6px_-1px_rgba(32,32,32,0.04)] flex flex-col justify-center items-start gap-2 mt-10">
              <div className="self-stretch p-3 bg-slate-50/5 rounded-xl flex flex-col justify-center items-start gap-1">
                <div className="self-stretch inline-flex justify-start items-start gap-4">
                  <div className="w-4 h-4 relative">
                    <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] rounded-full absolute bg-gray-400" />
                      <InfoIcon size={16} className="text-black" />
                    {/* <div className="w-0 h-[3px] left-[8px] top-[7.67px] absolute" />
                    <div className="w-0 h-[0.01px] left-[8px] top-[5.34px] absolute" /> */}
                  </div>
                  <div className="w-[816px] justify-center text-white/80 text-lg font-normal font-['Nunito_Sans'] leading-tight">Get more quests done to increase your ranks and get points. Accumulated points can be used to redeem rewards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Betting history (kept) */}
        {/* <div className="bg-card border border-border rounded-xl p-6 shadow-sm w-full">
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
        </div> */}


      </div>
  );
}
