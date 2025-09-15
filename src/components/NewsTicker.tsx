"use client";

import { AppColors } from "@/lib/assets";

interface NewsItem {
  id: string;
  username: string;
  amount: string;
  currency: string;
  betTitle: string;
  timeAgo: string;
  emoji: string;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    username: "J***n",
    amount: "1200",
    currency: "USDC",
    betTitle: "BTC hits $50K?",
    timeAgo: "2 mins ago",
    emoji: "🎉",
  },
  {
    id: "2",
    username: "So***h",
    amount: "5.25",
    currency: "ETH",
    betTitle: "Premier League Top...",
    timeAgo: "5 mins ago",
    emoji: "🏆",
  },
  {
    id: "3",
    username: "A**x",
    amount: "0.83",
    currency: "ETH",
    betTitle: "Will Trump win the blue state?",
    timeAgo: "10 mins ago",
    emoji: "💰",
  },
  {
    id: "4",
    username: "M***a",
    amount: "850",
    currency: "USDT",
    betTitle: "Tesla stock over $300?",
    timeAgo: "15 mins ago",
    emoji: "🚀",
  },
  {
    id: "5",
    username: "K***r",
    amount: "2.1",
    currency: "ETH",
    betTitle: "NBA Finals winner",
    timeAgo: "18 mins ago",
    emoji: "🏀",
  },
];

export function NewsTicker() {
  return (
    <div className="py-1 px-0 lg:px-4 overflow-hidden">
      <div className="bg-news-ticker-bg border border-news-ticker-border rounded-none lg:rounded-full px-4 py-1 lg:py-2 relative overflow-hidden" style={{border: '0.5px solid #363636', background: '#242429'}}>
        <div className="animate-scroll flex items-center space-x-8 whitespace-nowrap">
          {/* Duplicate the array for seamless looping */}
          {[...newsItems, ...newsItems].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex items-center space-x-2 text-sm font-nunito-sans"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-white font-semibold">{item.username}</span>
              <span className="text-gray-300">won</span>
              <span className="font-bold" style={{ color: AppColors.primary }}>
                {item.amount} {item.currency}
              </span>
              <span className="text-gray-300">on</span>
              <span className="text-white font-medium">
                &ldquo;{item.betTitle}&rdquo;
              </span>
              <span className="text-gray-400">–</span>
              <span className="text-gray-400">{item.timeAgo}</span>
            </div>
          ))}
        </div>

        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-news-ticker-bg to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-news-ticker-bg to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}