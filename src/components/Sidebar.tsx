"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcons } from "@/lib/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleAction: () => void;
}

export function Sidebar({ isCollapsed, onToggleAction }: SidebarProps) {
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
        "flex flex-col bg-sidebar border-r border-transparent transition-all duration-500 ease-in-out h-full relative transform",
        isCollapsed ? "w-16" : "w-64"
      )}
      style={{
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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
                      ? "bg-selected-state text-white"
                      : "text-gray-400 hover:bg-selected-state hover:text-white",
                    isCollapsed && "justify-end px-2"
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
            className="w-full text-white font-nunito-sans font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            style={{ 
              border: '1px solid var(--create-bet-border)', 
              backgroundColor: 'var(--create-bet-fill)' 
            }}
          >
            <Image
              src={AppIcons.plusSign}
              alt="Plus"
              width={24}
              height={24}
              className="text-white"
            />
            <span>Create Bet</span>
          </button>
        ) : (
          <button 
            className="w-full text-white p-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            style={{ 
              border: '1px solid var(--create-bet-border)', 
              backgroundColor: 'var(--create-bet-fill)' 
            }}
          >
            <Image
              src={AppIcons.plusSign}
              alt="Plus"
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
