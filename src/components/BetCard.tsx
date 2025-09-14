"use client";

import { useState } from "react";
import { Clock, User, Trophy } from "lucide-react";
import { Bet } from "@/lib/contracts/BettingContract";
import { useResolveBet } from "@/hooks/useBetting";
import {
  formatWeiToEther,
  getTimeUntilDeadline,
  getBetStatusText,
  getBetStatusColor,
  cn,
  truncateText,
} from "@/lib/utils";
import { GradientCircle, GradientPresets } from "./GradientCircle";
import { AppColors } from "@/lib/appColors";

interface BetCardProps {
  bet: Bet;
  onUpdateAction: () => void;
}

export function BetCard({ bet }: BetCardProps) {
  useResolveBet();
  useState(false);





  return (
    <div 
      className="rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{ 
        backgroundColor: AppColors.darkSecondary,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Header with Gradient Circle and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <GradientCircle
            size={48}
            gradientColors={GradientPresets.pinkPurple}
            showBorder={true}
          >
            <Trophy size={20} className="text-white" />
          </GradientCircle>
          <div>
            <div className="text-sm text-gray-400 mb-1">In-House created</div>
            <div className="text-xs text-gray-500">All Tokens</div>
          </div>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            getBetStatusColor(bet.status)
          )}
        >
          {getBetStatusText(bet.status)}
        </span>
      </div>

      {/* Main Question/Description */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-4 leading-tight">
          {truncateText(bet.description, 80)}
        </h3>
        
        {/* Betting Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400">57%</span>
            <span className="text-red-400">43%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-red-500" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        {/* Betting Options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
            Yes
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors">
            No
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
        
        {/* Stake Amount */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-300">${formatWeiToEther(bet.amount)}k</span>
          </div>
          
          {/* Deadline */}
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock size={14} />
            <span>{getTimeUntilDeadline(bet.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
