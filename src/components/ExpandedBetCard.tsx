"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Clock, User, Trophy, ArrowLeft } from "lucide-react";
import { Bet } from "@/lib/contracts/BettingContract";
import {
  getTimeUntilDeadline,
  cn,
} from "@/lib/utils";
import { GradientCircle, GradientPresets } from "./GradientCircle";
import { AppColors } from "@/lib/appColors";

interface ExpandedBetCardProps {
  bet: Bet;
  onBackAction: () => void;
  onUpdateAction: () => void;
}

export function ExpandedBetCard({ bet, onBackAction }: ExpandedBetCardProps) {
  useAccount();
  const [selectedAmount, setSelectedAmount] = useState<string>("30M");
  const [stakeAmount, setStakeAmount] = useState<string>("");

  const amounts = ["≥30M", "<40M", "<30M"];
  const percentages = ["55.5%", "21.1%", "23.4%"];

  return (
    <div 
      className="rounded-2xl p-6 max-w-md mx-auto"
      style={{ 
        backgroundColor: AppColors.darkSecondary,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBackAction}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <div className="flex items-center gap-3">
          <GradientCircle
            size={40}
            gradientColors={GradientPresets.pinkPurple}
            showBorder={true}
          >
            <Trophy size={16} className="text-white" />
          </GradientCircle>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="text-center mb-6">
        <div className="text-lg font-bold text-white mb-1">
          0x3B...CE2d4C
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-300">USDT</span>
        </div>
      </div>

      {/* Main Question */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white leading-tight">
          {bet.description}
        </h2>
      </div>

      {/* Betting Options with Percentages */}
      <div className="space-y-3 mb-6">
        {amounts.map((amount, index) => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200",
              selectedAmount === amount
                ? "bg-gray-600 border-2 border-blue-500"
                : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
            )}
          >
            <span className="text-white font-medium">{amount}</span>
            <span className="text-gray-300">{percentages[index]}</span>
          </button>
        ))}
      </div>

      {/* Stake Input */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Stake Amount</span>
          <span className="text-sm text-gray-400">Balance: $1,234</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            Stake
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-600">
        {/* Participants */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <User size={12} className="text-gray-300" />
            </div>
            <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
              <span className="text-xs text-gray-300">+104</span>
            </div>
          </div>
        </div>
        
        {/* Stake Amount and Deadline */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-300">$9.01k</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock size={14} />
            <span>{getTimeUntilDeadline(bet.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}