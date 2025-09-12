"use client";

import { BannerCarousel } from "./BannerCarousel";
import { BetCard } from "./BetCard";
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

          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-nunito-sans font-medium text-white">
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
              <BetCard bet={bet} onUpdate={() => {}} />
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

          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-nunito-sans font-medium text-white">
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
              <BetCard bet={bet} onUpdate={() => {}} />
            </div>
          ))}
        </div>
      </section>

      {/* Create Bet CTA */}
      <section className="bg-gradient-to-r from-primary/10 to-primary-light/5 border border-primary/20 rounded-2xl p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <Image
              src={AppIcons.addCircle}
              alt="Add"
              width={48}
              height={48}
              className="text-primary mx-auto"
            />
          </div>
          <h3 className="text-2xl font-nunito-sans font-bold text-gray-900 dark:text-white mb-2">
            Create Your First Bet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-nunito-sans mb-6">
            Start earning by creating custom bets on any topic. Set your terms
            and let others join!
          </p>
          <button className="bg-primary hover:bg-primary/80 text-white font-nunito-sans font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg">
            + Create Bet
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Image
                src={AppIcons.coins}
                alt="Total Bets"
                width={20}
                height={20}
                className="text-primary"
              />
            </div>
            <div>
              <p className="text-2xl font-nunito-sans font-bold text-gray-900 dark:text-white">
                1,234
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-nunito-sans">
                Total Bets
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Image
                src={AppIcons.chartUp}
                alt="Active Bets"
                width={20}
                height={20}
                className="text-success"
              />
            </div>
            <div>
              <p className="text-2xl font-nunito-sans font-bold text-gray-900 dark:text-white">
                89
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-nunito-sans">
                Active Bets
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Image
                src={AppIcons.dollar}
                alt="Volume"
                width={20}
                height={20}
                className="text-primary"
              />
            </div>
            <div>
              <p className="text-2xl font-nunito-sans font-bold text-gray-900 dark:text-white">
                $45.2K
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-nunito-sans">
                Total Volume
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Image
                src={AppIcons.user}
                alt="Users"
                width={20}
                height={20}
                className="text-success"
              />
            </div>
            <div>
              <p className="text-2xl font-nunito-sans font-bold text-gray-900 dark:text-white">
                567
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-nunito-sans">
                Active Users
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
