"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcons } from "@/lib/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      icon: AppIcons.home,
      path: "/",
    },
    {
      name: "Market",
      icon: AppIcons.analytics,
      path: "/market",
    },
    {
      name: "Games",
      icon: AppIcons.game,
      path: "/games",
    },
    {
      name: "My Bets",
      icon: AppIcons.coins,
      path: "/my-bets",
    },
    {
      name: "Earn",
      icon: AppIcons.gift,
      path: "/earn",
    },
    {
      name: "Wallet",
      icon: AppIcons.wallet,
      path: "/wallet",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-gray-900 dark:bg-black border-r border-gray-800 dark:border-gray-700 transition-all duration-300 h-full relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-transparent">
        {!isCollapsed && (
          <div className="flex justify-start w-full">
            <Image
              src={AppIcons.logo}
              alt="Logo"
              width={56}
              height={56}
              className="text-primary"
            />
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <Image
              src={AppIcons.logo}
              alt="Logo"
              width={40}
              height={40}
              className="text-primary"
            />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "absolute -right-3 top-8 bg-gray-800 dark:bg-gray-700 rounded-full p-1.5 border border-gray-700 dark:border-gray-600 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors z-10",
            isCollapsed && "-right-3"
          )}
        >
          <Image
            src={AppIcons.sidebarLeft}
            alt="Toggle"
            width={16}
            height={16}
            className={cn(
              "text-gray-400 transition-transform duration-300",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gray-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    )}
                  />
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "font-nunito-sans",
                        isActive
                          ? "text-white font-bold"
                          : "text-gray-400 group-hover:text-white"
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-transparent">
        {!isCollapsed ? (
          <button className="w-full bg-primary hover:bg-primary/90 text-black font-nunito-sans font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <Image
              src={AppIcons.plusSign}
              alt="Plus"
              width={16}
              height={16}
              className="text-black"
            />
            <span>Create Bet</span>
          </button>
        ) : (
          <button className="w-full bg-primary hover:bg-primary/90 text-black font-nunito-sans font-semibold p-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <Image
              src={AppIcons.plusSign}
              alt="Plus"
              width={20}
              height={20}
              className="text-black"
            />
          </button>
        )}
      </div>
    </div>
  );
}
