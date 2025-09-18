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
    <div className="w-full mb-8">
      {/* Banner Container */}
      <div className="relative w-full rounded-2xl overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="min-w-full h-64 md:h-80 relative flex items-center justify-between px-4 md:px-12"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {/* Mobile image per slide */}
              <Image
                src={index === 0 ? AppImages.bannerMobile : index === 1 ? AppImages.bannerPinkMobile : banner.backgroundImage}
                alt="Banner background"
                fill
                className="object-cover md:hidden"
                priority={index === 0}
              />
              {/* Desktop image */}
              <Image
                src={banner.backgroundImage}
                alt="Banner background"
                fill
                className="object-cover hidden md:block"
                priority={index === 0}
              />
            </div>

            {/* Content - CTA bottom-left on both mobile and desktop */}
            <div className="relative z-10 w-full h-full p-4 md:p-12 flex items-end justify-start">
              <button
                onClick={banner.buttonAction}
                className="bg-white hover:bg-gray-100 text-gray-900 font-nunito-sans font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200 shadow-lg"
              >
                {banner.buttonText}
              </button>
            </div>
          </div>
        ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            goToBanner(
              currentBanner === 0 ? banners.length - 1 : currentBanner - 1
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-200 hidden md:block"
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
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors duration-200 hidden md:block"
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

      {/* Navigation bars BELOW carousel */}
      <div className="mt-3 w-full inline-flex justify-center items-center">
        <div className="inline-flex justify-start items-start gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToBanner(index)}
              className={cn(
                "h-1 w-12 rounded-[99px] transition-colors",
                index === currentBanner ? "bg-white" : "bg-white/25"
              )}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
