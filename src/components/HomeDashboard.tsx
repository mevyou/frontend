"use client";

import { useState, useMemo } from "react";
import { BannerCarousel } from "./BannerCarousel";
import { BettingCard } from "./BettingCard";
import { PredictionCard } from "./PredictionCard";
import { ExpandedBettingCard } from "./ExpandedBettingCard";
import { AppIcons } from "@/lib/assets";
import { dummyBets } from "@/lib/dummyData";
import { Bet, BetType, Options } from "@/lib/contracts/BettingContract";
import { useSearch } from "@/contexts/SearchContext";
import { useBetCreateds } from "@/hooks/useGraphData";
import { transformBetCreatedToBet, TransformedBet } from "@/lib/betUtils";
import Image from "next/image";

export function HomeDashboard() {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const { searchQuery } = useSearch();

  // Fetch real bet data from The Graph
  const { data: betCreateds, isLoading, error } = useBetCreateds(20);

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
    return filteredBets.map(bet => ({
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
    } as Bet));
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
    setSelectedBet(bet);
  };

  const handleBackClick = () => {
    setSelectedBet(null);
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
      <div className="p-6 flex justify-center">
        <div className="max-w-md w-full">
          <ExpandedBettingCard
            bet={selectedBet}
            onBackAction={handleBackClick}
          />
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
