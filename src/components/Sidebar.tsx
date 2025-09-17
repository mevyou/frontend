"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcons } from "@/lib/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleAction: () => void;
  onCreateBetClick?: () => void;
}

export function Sidebar({ isCollapsed, onToggleAction, onCreateBetClick }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      activeIcon: AppIcons.homeActive,
      inactiveIcon: AppIcons.homeInactive,
      path: "/",
    },
    {
      name: "Market",
      activeIcon: AppIcons.marketActive,
      inactiveIcon: AppIcons.marketInactive,
      path: "/market",
    },
    {
      name: "Games",
      activeIcon: AppIcons.gameActive,
      inactiveIcon: AppIcons.gameInactive,
      path: "/games",
    },
    {
      name: "My Bets",
      activeIcon: AppIcons.betActive,
      inactiveIcon: AppIcons.betInactive,
      path: "/my-bets",
    },
    {
      name: "Earn",
      activeIcon: AppIcons.giftActive,
      inactiveIcon: AppIcons.earnInactive,
      path: "/earn",
    },
    {
      name: "Wallet",
      activeIcon: AppIcons.walletActive,
      inactiveIcon: AppIcons.walletInactive,
      path: "/wallet",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-transparent h-full relative",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{
        transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-transparent">
        {!isCollapsed && (
          <div className="flex justify-start w-full transition-all duration-300 ease-in-out">
            <Image
              src={AppIcons.logo}
              alt="Logo"
              width={56}
              height={56}
              className="text-primary transition-all duration-300 ease-in-out"
            />
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <Image
              src={AppIcons.logo}
              alt="Logo"
              width={48}
              height={48}
              className="text-primary"
            />
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={onToggleAction}
            className="bg-sidebar rounded-full p-1.5 border border-transparent hover:bg-gray-700 transition-colors"
          >
            <Image
               src={AppIcons.sidebarLeft}
               alt="Toggle"
               width={20}
               height={20}
               className="text-gray-400 transition-transform duration-300"
             />
          </button>
        )}
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
                      ? "text-white"
                      : "text-gray-400 hover:text-white",
                    isCollapsed && "justify-end px-2"
                  )}
                  style={{
                    backgroundColor: isActive ? '#242429' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#242429';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Image
                    src={isActive ? (item as any).activeIcon : (item as any).inactiveIcon}
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
                        "font-nunito-sans transition-all duration-300 ease-in-out",
                        isActive
                          ? "text-white font-bold"
                          : "text-gray-400 group-hover:text-white",
                        !isCollapsed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
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
          <button 
            onClick={onCreateBetClick}
            className="w-full text-white font-nunito-sans font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer hover:opacity-80"
            style={{ 
              border: '1px solid var(--create-bet-border)', 
              backgroundColor: 'var(--create-bet-fill)' 
            }}
          >
            <Image
              src={AppIcons.plusSign}
              alt="Create Bet"
              width={24}
              height={24}
              className="text-white"
            />
            <span>Create Bet</span>
          </button>
        ) : (
          <button 
            onClick={onCreateBetClick}
            className="w-full text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer hover:opacity-80"
            style={{ 
              border: '1px solid var(--create-bet-border)', 
              backgroundColor: 'var(--create-bet-fill)' 
            }}
          >
            <Image
              src={AppIcons.plusSign}
              alt="Create Bet"
              width={24}
              height={24}
              className="text-white"
            />
          </button>
        )}
      </div>
    </div>
  );
}
