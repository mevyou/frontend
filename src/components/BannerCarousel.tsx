"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AppImages } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: () => void;
  backgroundImage: string;
  backgroundGradient: string;
}

const banners: BannerData[] = [
  {
    id: "1",
    title: "Top 10 stakers share $5,000 in rewards this Season.",
    subtitle: "",
    buttonText: "Start Earning Points",
    buttonAction: () => console.log("Start earning"),
    backgroundImage: AppImages.banner,
    backgroundGradient: "from-primary/80 to-primary-light/60",
  },
  {
    id: "2",
    title: "100% transparent & on-chain. No middleman!",
    subtitle: "",
    buttonText: "Connect Wallet Now!",
    buttonAction: () => console.log("Connect wallet"),
    backgroundImage: AppImages.banner2,
    backgroundGradient: "from-purple-500/80 to-pink-500/60",
  },
  {
    id: "3",
    title: "Be the House! Create your own bets in seconds",
    subtitle: "",
    buttonText: "Create A Bet",
    buttonAction: () => console.log("Create bet"),
    backgroundImage: AppImages.banner4,
    backgroundGradient: "from-yellow-400/80 to-orange-500/60",
  },
];

export function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
  };

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-8">
      {/* Banner Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentBanner * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="min-w-full h-full relative flex items-center justify-between px-8 lg:px-12"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.backgroundImage}
                alt="Banner background"
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>

            {/* Content - Button aligned to bottom left */}
            <div className="relative z-10 flex items-end justify-start w-full h-full p-6 lg:p-12">
              <button
                onClick={banner.buttonAction}
                className="bg-white hover:bg-gray-100 text-gray-900 font-nunito-sans font-bold px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                {banner.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToBanner(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentBanner
                ? "bg-white shadow-lg scale-110"
                : "bg-white/50 hover:bg-white/70"
            )}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() =>
          goToBanner(
            currentBanner === 0 ? banners.length - 1 : currentBanner - 1
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => goToBanner((currentBanner + 1) % banners.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
