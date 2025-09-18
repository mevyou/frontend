"use client";

import { useState, useMemo, useEffect } from "react";
import { BannerCarousel } from "./BannerCarousel";
import { BettingCard } from "./BettingCard";
import { PredictionCard } from "./PredictionCard";
import { ContractBetOption, ContractBet } from "@/lib/contracts/BettingContract";
import { getBetFromContract } from "@/lib/contracts/BettingContract";
import TxButton from "./TxButton";
import { gameABI, gameAddress } from "@/contract/contract";
import { Abi, parseEther } from "viem";
import { cn } from "@/lib/utils";
import { AppIcons } from "@/lib/assets";
import { dummyBets } from "@/lib/dummyData";
import { Bet, BetType, Options } from "@/lib/contracts/BettingContract";
import { useSearch } from "@/contexts/SearchContext";
import { useBetCreateds } from "@/hooks/useGraphData";
import { transformBetCreatedToBet, TransformedBet } from "@/lib/betUtils";
import { formatWeiToEther } from "@/lib/utils";
import Image from "next/image";

export function HomeDashboard() {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [contractBet, setContractBet] = useState<ContractBet | null>(null);
  const [isLoadingContractBet, setIsLoadingContractBet] = useState<boolean>(false);
  const [stakeAmounts, setStakeAmounts] = useState<Record<string, string>>({});
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);
  const { searchQuery } = useSearch();

  // Fetch real bet data from The Graph
  const { data: betCreateds, isLoading, error } = useBetCreateds(20);
  console.log('selectedBet', selectedBet);

  // Transform and filter bets based on search query
  const filteredBets = useMemo(() => {
    if (!betCreateds) {
      // Convert dummy bets to TransformedBet format for consistency
      return dummyBets.map((bet, index) => ({
        id: bet.id,
        betId: bet.betId,
        owner: bet.owner,
        description: bet.description,
        amount: (Number(bet.amount) / 1e18).toString(),
        deadline: Number(bet.deadline),
        status: bet.status,
        name: bet.name,
        link: bet.link,
        image: bet.image || "",
        privateBet: bet.privateBet,
        betType: bet.betType,
        options: [],
        createdAt: Number(bet.createdAt) - (index * 3600),
        updatedAt: Number(bet.updatedAt ?? bet.createdAt),
        result: -1,
        betDuration: 86400,
      } as unknown as TransformedBet));
    }

    const transformedBets = betCreateds.map(transformBetCreatedToBet);
    console.log(transformedBets);

    if (!searchQuery.trim()) {
      return transformedBets;
    }

    return transformedBets.filter(bet =>
      bet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [betCreateds, searchQuery]);

  // Create compatible bet objects for the existing components
  console.log('filteredBets', filteredBets);
  const compatibleBets = useMemo(() => {
    return filteredBets.map(bet => {
      console.log('Creating compatible bet:', { id: bet.id, betId: bet.betId, name: bet.name });
      return {
        id: BigInt(bet.id),
        betId: BigInt(bet.betId || 0),
        // creator: bet.owner,
        // opponent: "",
        description: bet.description,
        // amount: BigInt(0),
        deadline: BigInt((bet.createdAt || Math.floor(Date.now() / 1000)) + 86400),
        status: bet.status,
        winner: "",
        options: [] as Options[],
        betType: bet.betType as BetType,
        name: bet.name,
        image: bet.image,
        link: bet.link,
        owner: bet.owner,
        result: BigInt(bet.result ?? -1),
        createdAt: BigInt(bet.createdAt || 0),
        updatedAt: BigInt(bet.updatedAt || 0),
        betDuration: BigInt(86400),
        privateBet: Boolean(bet.privateBet),
      } as Bet;
    });
  }, [filteredBets]);

  // Sort bets by deadline (closing soon first) and creation time
  const sortedBets = useMemo(() => {
    return [...compatibleBets].sort((a, b) => {
      // First sort by deadline (closing soon first)
      const deadlineDiff = Number(a.deadline) - Number(b.deadline);
      if (deadlineDiff !== 0) return deadlineDiff;

      // Then sort by creation time (newest first)
      return Number(b.createdAt) - Number(a.createdAt);
    });
  }, [compatibleBets]);

  const closingSoonBets = sortedBets.slice(0, 3);
  const latestBets = sortedBets.slice(3, 6);

  const handleBetClick = (bet: Bet) => {
    console.log('Bet clicked:', bet);
    console.log('Bet betId:', bet.betId);
    console.log('Bet id:', bet.id);
    setSelectedBet(bet);
  };

  const handleBackClick = () => {
    setSelectedBet(null);
  };

  // Fetch on-chain bet details when a bet is selected
  useEffect(() => {
    if (selectedBet) {
      const fetchContractBet = async () => {
        try {
          setIsLoadingContractBet(true);
          console.log('Fetching contract bet for betId:', selectedBet.betId);
          console.log('selectedBet.betId type:', typeof selectedBet.betId);
          console.log('selectedBet.betId value:', selectedBet.betId);

          // Check if betId is valid
          if (Number(selectedBet.betId) === 0) {
            console.warn('Invalid betId: 0, cannot fetch from contract');
            setContractBet(null);
            return;
          }

          const data = await getBetFromContract(BigInt(selectedBet.betId));
          console.log('Contract bet data:', data);
          setContractBet(data);
        } catch (e) {
          console.error('Failed to load bet from contract:', e);
          setContractBet(null);
        } finally {
          setIsLoadingContractBet(false);
        }
      };
      fetchContractBet();
    }
  }, [selectedBet]);

  // Fetch ETH/USD price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setIsPriceLoading(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthUsd(data.ethereum.usd);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      } finally {
        setIsPriceLoading(false);
      }
    };
    fetchEthPrice();
  }, []);

  // Calculate total staked amount
  const totalStaked = contractBet?.options?.reduce((sum: bigint, opt: ContractBetOption) => sum + (opt.totalStaked ?? BigInt(0)), BigInt(0)) ?? BigInt(0);

  // Get status color and text
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return "bg-yellow-500/20 text-yellow-400"; // Active
      case 1: return "bg-green-500/20 text-green-400"; // Resolved
      case 2: return "bg-red-500/20 text-red-400"; // Cancelled
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "Active";
      case 1: return "Resolved";
      case 2: return "Cancelled";
      default: return "Unknown";
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-8 rounded-t-2xl" style={{ backgroundColor: '#1A1A1E' }}>
        <BannerCarousel />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          <span className="ml-3 text-gray-400">Loading bets...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 space-y-8 rounded-t-2xl" style={{ backgroundColor: '#1A1A1E' }}>
        <BannerCarousel />
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Failed to load bets from blockchain</p>
          <p className="text-gray-400 text-sm">Using demo data instead</p>
        </div>
      </div>
    );
  }

  if (selectedBet) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        <div className="bg-neutral-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white text-lg font-semibold">Bet Details</h3>
            <div className="flex items-center gap-5">
              <button
                onClick={handleBackClick}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {(() => {
            const bet = filteredBets.find(b => Number(b.betId) === Number(selectedBet.betId));
            console.log('Looking for bet with betId:', Number(selectedBet.betId));
            console.log('Available bets:', filteredBets.map(b => ({ id: b.id, betId: b.betId, name: b.name })));
            console.log('Found bet:', bet);
            if (!bet) return (
              <div className="text-center py-8">
                <div className="text-gray-400">Bet not found</div>
              </div>
            );

            return (
              <div className="space-y-4">
                {isLoadingContractBet && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto mb-2"></div>
                    <div className="text-gray-400 text-sm">Loading bet details...</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-400 text-sm mb-1">Title</div>
                  <div className="text-white text-sm">{bet.name}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Description</div>
                  <div className="text-white text-sm">{bet.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <div className={cn("px-2 py-1 rounded-full text-xs font-medium inline-block", getStatusColor(bet.status))}>
                      {getStatusText(bet.status)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Staked</div>
                    <div className="text-white text-sm">
                      {formatWeiToEther(BigInt(totalStaked))} ETH
                      {ethUsd && (
                        <span className="ml-1 text-gray-400">
                          (${(parseFloat(formatWeiToEther(BigInt(totalStaked))) * ethUsd).toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>


                <div className="flex gap-2 pt-4">
                  {/* Options list with stake buttons */}
                  <div className="space-y-2 w-full">
                    <div className="text-gray-400 text-sm">Options</div>
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const opts: ContractBetOption[] = (contractBet && !isLoadingContractBet)
                          ? (contractBet.options)
                          : (bet.options as ContractBetOption[] || []);
                        return Array.isArray(opts) && opts.length > 0 ? (
                          opts.map((opt, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-neutral-700/50 rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-medium">{opt.option}</span>
                                <span className="text-gray-400 text-xs">
                                  Staked: {formatWeiToEther(contractBet?.options[idx]?.totalStaked ?? BigInt(0))} ETH
                                  {ethUsd && (
                                    <span className="ml-1">
                                      (${(parseFloat(formatWeiToEther(contractBet?.options[idx]?.totalStaked ?? BigInt(0))) * ethUsd).toFixed(2)})
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div>

                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Amount (USD)"
                                    className="w-32 px-2 py-1 rounded bg-neutral-800 text-white text-xs border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                                    value={stakeAmounts[`${bet.betId}-${idx}`] ?? ''}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setStakeAmounts((prev) => ({ ...prev, [`${bet.betId}-${idx}`]: v }));
                                    }}
                                  />
                                  <div className="text-gray-400 text-[10px] w-24">
                                    {(() => {
                                      const usdStr = stakeAmounts[`${bet.betId}-${idx}`];
                                      const usdVal = Number(usdStr);
                                      if (!ethUsd || Number.isNaN(usdVal) || usdVal <= 0) return '≈ 0 ETH';
                                      const ethAmt = usdVal / ethUsd;
                                      return `≈ ${ethAmt.toFixed(6)} ETH`;
                                    })()}
                                  </div>
                                </div>
                                <TxButton
                                  address={gameAddress as `0x${string}`}
                                  abi={gameABI as unknown as Abi}
                                  functionName="stake"
                                  args={[BigInt(bet.betId), BigInt(idx)]}
                                  value={(() => {
                                    const usdStr = stakeAmounts[`${bet.betId}-${idx}`];
                                    const usdVal = Number(usdStr);
                                    if (!ethUsd || Number.isNaN(usdVal) || usdVal <= 0) return undefined as unknown as bigint;
                                    try {
                                      const ethAmt = usdVal / ethUsd;
                                      return parseEther(ethAmt.toFixed(6));
                                    } catch {
                                      return undefined as unknown as bigint;
                                    }
                                  })()}
                                  idleLabel="Stake"
                                  pendingLabel="Staking..."
                                  successLabel="Staked"
                                  className="w-24"
                                  showCancel={false}
                                  disabled={isPriceLoading || !ethUsd || !(Number(stakeAmounts[`${bet.betId}-${idx}`]) > 0)}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-xs">No options found</div>
                        );
                      })()}
                    </div>
                  </div>



                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 rounded-t-2xl" style={{ backgroundColor: '#1A1A1E' }}>
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Data Source Indicator */}
      {betCreateds && betCreateds.length > 0 && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-teal-400 text-sm font-medium">
              Live data from blockchain • {betCreateds.length} bets loaded
            </span>
          </div>
        </div>
      )}

      {/* Closing Soon Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Image
                src={AppIcons.timer}
                alt="Timer"
                width={20}
                height={20}
                className="text-primary"
              />
              <h2 className="text-xl font-nunito-sans font-bold text-gray-900 dark:text-white">
                Closing soon
              </h2>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 hover:opacity-80 transition-colors font-nunito-sans font-medium text-white" style={{ backgroundColor: '#242429', borderRadius: '12px' }}>
            <span>Explore Market</span>
            <Image
              src={AppIcons.arrowRight}
              alt="Arrow Right"
              width={16}
              height={16}
              className="text-white"
            />
          </button>
        </div>

        {closingSoonBets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {closingSoonBets.map((bet, index) => (
              <div
                key={bet.id.toString()}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                {index % 2 === 0 ? (
                  <BettingCard
                    bet={bet}
                    onUpdateAction={() => { }}
                    onClick={() => handleBetClick(bet)}
                  />
                ) : (
                  <PredictionCard
                    bet={bet}
                    onUpdateAction={() => { }}
                    onClick={() => handleBetClick(bet)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              {searchQuery ? `No bets found matching "${searchQuery}"` : 'No bets closing soon'}
            </p>
          </div>
        )}
      </section>

      {/* Latest Bets Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Image
                src={AppIcons.fire}
                alt="Fire"
                width={20}
                height={20}
                className="text-primary"
              />
              <h2 className="text-xl font-nunito-sans font-bold text-gray-900 dark:text-white">
                Latest bets
              </h2>
            </div>
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 hover:opacity-80 transition-colors font-nunito-sans font-medium text-white" style={{ backgroundColor: '#242429', borderRadius: '12px' }}>
            <span>Explore Market</span>
            <Image
              src={AppIcons.arrowRight}
              alt="Arrow Right"
              width={16}
              height={16}
              className="text-white"
            />
          </button>
        </div>

        {latestBets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestBets.map((bet, index) => (
              <div
                key={bet.id.toString()}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                {index % 2 === 0 ? (
                  <BettingCard
                    bet={bet}
                    onUpdateAction={() => { }}
                    onClick={() => handleBetClick(bet)}
                  />
                ) : (
                  <PredictionCard
                    bet={bet}
                    onUpdateAction={() => { }}
                    onClick={() => handleBetClick(bet)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No latest bets found matching &quot;{searchQuery}&quot;</p>
          </div>
        ) : null}
      </section>


    </div>
  );
}
