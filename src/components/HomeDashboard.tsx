"use client";

import { useState, useMemo } from "react";
import { BannerCarousel } from "./BannerCarousel";
import { BettingCard } from "./BettingCard";
import { PredictionCard } from "./PredictionCard";
import { ExpandedBettingCard } from "./ExpandedBettingCard";
import { AppIcons } from "@/lib/assets";
import { dummyBets } from "@/lib/dummyData";
import { Bet, BetStatus } from "@/lib/contracts/BettingContract";
import { useSearch } from "@/contexts/SearchContext";
import { useBetCreateds } from "@/hooks/useGraphData";
import { transformBetCreatedToBet, TransformedBet } from "@/lib/betUtils";
import Image from "next/image";

export function HomeDashboard() {
  const [selectedBet, setSelectedBet] = useState<TransformedBet | null>(null);
  const { searchQuery } = useSearch();

  // Fetch real bet data from The Graph
  const { data: betCreateds, isLoading, error } = useBetCreateds(20);

  // Transform and filter bets based on search query
  const filteredBets = useMemo(() => {
    if (!betCreateds) {
      // Convert dummy bets to TransformedBet format for consistency
      return dummyBets.map((bet, index) => ({
        id: bet.id.toString(),
        creator: bet.creator,
        opponent: bet.opponent,
        description: bet.description,
        amount: (Number(bet.amount) / 1e18).toString(),
        deadline: Number(bet.deadline),
        status: bet.status,
        winner: bet.winner,
        name: bet.description, // Use description as name for dummy data
        link: '',
        image: undefined,
        privateBet: false,
        betType: 0,
        options: [{ option: 'Yes', odds: '1.0' }, { option: 'No', odds: '1.0' }],
        createdAt: Math.floor(Date.now() / 1000) - (index * 3600), // Stagger creation times
        updatedAt: Math.floor(Date.now() / 1000) - (index * 3600),
        result: '',
      }));
    }

    const transformedBets = betCreateds.map(transformBetCreatedToBet);

    if (!searchQuery.trim()) {
      return transformedBets;
    }

    return transformedBets.filter(bet =>
      bet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [betCreateds, searchQuery]);

  // Create compatible bet objects for the existing components
  const compatibleBets = useMemo(() => {
    return filteredBets.map(bet => ({
      id: BigInt(parseInt(bet.id) || 0),
      creator: bet.creator,
      opponent: bet.opponent || '', // Not available in GraphQL data
      description: bet.description,
      amount: BigInt(Math.floor(parseFloat(bet.amount) * 1e18)), // Convert to wei
      deadline: BigInt(bet.deadline),
      status: bet.status,
      winner: bet.winner,
      // Additional fields for compatibility
      name: bet.name,
      link: bet.link,
      image: bet.image,
      privateBet: bet.privateBet,
      betType: bet.betType,
      options: bet.options,
      createdAt: bet.createdAt,
      updatedAt: bet.updatedAt,
      result: bet.result,
    }));
  }, [filteredBets]);

  // Sort bets by deadline (closing soon first) and creation time
  const sortedBets = useMemo(() => {
    return [...compatibleBets].sort((a, b) => {
      // First sort by deadline (closing soon first)
      const deadlineDiff = Number(a.deadline) - Number(b.deadline);
      if (deadlineDiff !== 0) return deadlineDiff;

      // Then sort by creation time (newest first)
      return b.createdAt - a.createdAt;
    });
  }, [compatibleBets]);

  const closingSoonBets = sortedBets.slice(0, 3);
  const latestBets = sortedBets.slice(3, 6);

  const handleBetClick = (bet: unknown) => {
    // Convert back to TransformedBet format for the expanded view
    const betData = bet as Record<string, unknown>;
    const transformedBet: TransformedBet = {
      id: String(betData.id || '0'),
      creator: String(betData.creator || ''),
      opponent: String(betData.opponent || ''),
      description: String(betData.description || ''),
      amount: (Number(betData.amount) / 1e18).toString(),
      deadline: Number(betData.deadline || 0),
      status: betData.status as BetStatus,
      winner: String(betData.winner || ''),
      name: String(betData.name || ''),
      link: String(betData.link || ''),
      image: betData.image ? String(betData.image) : undefined,
      privateBet: Boolean(betData.privateBet),
      betType: Number(betData.betType || 0),
      options: Array.isArray(betData.options) ? betData.options as Array<{ option: string; odds: string }> : [],
      createdAt: Number(betData.createdAt || 0),
      updatedAt: Number(betData.updatedAt || 0),
      result: String(betData.result || ''),
    };
    setSelectedBet(transformedBet);
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
    // Convert TransformedBet back to Bet format for ExpandedBettingCard
    const betForExpanded: Bet = {
      id: BigInt(parseInt(selectedBet.id) || 0),
      creator: selectedBet.creator,
      opponent: selectedBet.opponent,
      description: selectedBet.description,
      amount: BigInt(Math.floor(parseFloat(selectedBet.amount) * 1e18)),
      deadline: BigInt(selectedBet.deadline),
      status: selectedBet.status,
      winner: selectedBet.winner,
    };

    return (
      <div className="p-6 flex justify-center">
        <div className="max-w-md w-full">
          <ExpandedBettingCard
            bet={betForExpanded}
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
