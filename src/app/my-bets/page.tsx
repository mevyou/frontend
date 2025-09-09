"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { MainLayout } from "@/components/MainLayout";
import { BetCard } from "@/components/BetCard";
import { Filter, TrendingUp, Clock, Trophy, TrendingDown } from "lucide-react";
import { BetStatus } from "@/lib/contracts/BettingContract";
import { cn } from "@/lib/utils";
import { dummyBets, getUserStats } from "@/lib/dummyData";

type FilterType = "all" | "open" | "matched" | "resolved";

export default function MyBetsPage() {
  const { address } = useAccount();
  const [filter, setFilter] = useState<FilterType>("all");

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

  const filteredBets = userBets.filter((bet) => {
    switch (filter) {
      case "open":
        return bet.status === BetStatus.OPEN;
      case "matched":
        return bet.status === BetStatus.MATCHED;
      case "resolved":
        return bet.status === BetStatus.RESOLVED;
      default:
        return true;
    }
  });

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

  const filterOptions = [
    { value: "all", label: "All Bets", count: userBets.length },
    {
      value: "open",
      label: "Open",
      count: userBets.filter((b) => b.status === BetStatus.OPEN).length,
    },
    {
      value: "matched",
      label: "Matched",
      count: userBets.filter((b) => b.status === BetStatus.MATCHED).length,
    },
    {
      value: "resolved",
      label: "Resolved",
      count: userBets.filter((b) => b.status === BetStatus.RESOLVED).length,
    },
  ];

  const refetch = () => {
    // Placeholder for refetch functionality
  };

  if (!address) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please connect your wallet to view your bets
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Bets
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your betting activity and performance
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp
                size={20}
                className="text-blue-500 dark:text-blue-400"
              />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Total Bets
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.totalBets}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock
                size={20}
                className="text-yellow-500 dark:text-yellow-400"
              />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Active
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.activeBets}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Trophy
                size={20}
                className="text-green-500 dark:text-green-400"
              />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Won
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.wonBets}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown
                size={20}
                className="text-red-500 dark:text-red-400"
              />
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Lost
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats.lostBets}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Filter size={16} />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as FilterType)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                filter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>

        {/* Bets Grid */}
        {filteredBets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id.toString()} bet={bet} onUpdate={refetch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              {filter === "all" ? "No bets found" : `No ${filter} bets found`}
            </div>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              {filter === "all"
                ? "Start betting to see your activity here!"
                : "Try adjusting your filter"}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
