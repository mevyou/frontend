"use client";

import { useEffect, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-2 px-4 overflow-hidden">
      <div className="bg-gray-700/80 rounded-full px-4 py-2 relative overflow-hidden">
        <div className="relative flex items-center">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${newsItems.length * 100}%`,
            }}
          >
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-center w-full px-4"
                style={{ width: `${100 / newsItems.length}%` }}
              >
                <div className="flex items-center space-x-2 text-sm font-nunito-sans">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-white font-semibold">
                    {item.username}
                  </span>
                  <span className="text-gray-300">won</span>
                  <span
                    className="font-bold"
                    style={{ color: AppColors.primary }}
                  >
                    {item.amount} {item.currency}
                  </span>
                  <span className="text-gray-300">on</span>
                  <span className="text-white font-medium">
                    &ldquo;{item.betTitle}&rdquo;
                  </span>
                  <span className="text-gray-400">–</span>
                  <span className="text-gray-400">{item.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays for smooth transition effect */}
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-gray-700 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-gray-700 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center space-x-1 pb-2">
        {newsItems.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              index === currentIndex
                ? "bg-primary"
                : "bg-gray-600 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
