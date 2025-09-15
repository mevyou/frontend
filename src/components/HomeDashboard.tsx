"use client";

import { useState, useMemo } from "react";
import { BannerCarousel } from "./BannerCarousel";
import { BettingCard } from "./BettingCard";
import { PredictionCard } from "./PredictionCard";
import { ExpandedBettingCard } from "./ExpandedBettingCard";
import { AppIcons } from "@/lib/assets";
import { dummyBets } from "@/lib/dummyData";
import { Bet } from "@/lib/contracts/BettingContract";
import { useSearch } from "@/contexts/SearchContext";
import Image from "next/image";

export function HomeDashboard() {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const { searchQuery } = useSearch();
  
  // Filter bets based on search query
  const filteredBets = useMemo(() => {
    if (!searchQuery.trim()) {
      return dummyBets;
    }
    return dummyBets.filter(bet => 
      bet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  const closingSoonBets = filteredBets.slice(0, 3);
  const latestBets = filteredBets.slice(3, 6);

  const handleBetClick = (bet: Bet) => {
    setSelectedBet(bet);
  };

  const handleBackClick = () => {
    setSelectedBet(null);
  };

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
                key={bet.id}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                {index % 2 === 0 ? (
                  <BettingCard 
                    bet={bet} 
                    onUpdateAction={() => {}} 
                    onClick={() => handleBetClick(bet)}
                  />
                ) : (
                  <PredictionCard 
                    bet={bet} 
                    onUpdateAction={() => {}} 
                    onClick={() => handleBetClick(bet)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
             <p className="text-gray-400">No bets found matching &quot;{searchQuery}&quot;</p>
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
                key={bet.id}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                {index % 2 === 0 ? (
                  <BettingCard 
                    bet={bet} 
                    onUpdateAction={() => {}} 
                    onClick={() => handleBetClick(bet)}
                  />
                ) : (
                  <PredictionCard 
                    bet={bet} 
                    onUpdateAction={() => {}} 
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
