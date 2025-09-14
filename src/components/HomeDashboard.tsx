"use client";

import { BannerCarousel } from "./BannerCarousel";
import { BettingCard } from "./BettingCard";
import { AppIcons } from "@/lib/assets";
import { dummyBets } from "@/lib/dummyData";
import Image from "next/image";

export function HomeDashboard() {
  const closingSoonBets = dummyBets.slice(0, 3);
  const latestBets = dummyBets.slice(3, 6);

  return (
    <div className="p-6 space-y-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {closingSoonBets.map((bet) => (
            <div
              key={bet.id}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <BettingCard bet={bet} onUpdateAction={() => {}} />
            </div>
          ))}
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestBets.map((bet) => (
            <div
              key={bet.id}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <BettingCard bet={bet} onUpdateAction={() => {}} />
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
