"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcons } from "@/lib/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TabProps {
  name: string;
  activeIcon: string;
  inactiveIcon: string;
  path: string;
  isActive: boolean;
}

function Tab({ name, activeIcon, inactiveIcon, path, isActive }: TabProps) {
  return (
    <Link
      href={path}
      className="h-10 relative shrink-0 w-[62.5px] flex flex-col items-center justify-center"
    >
      <div className="absolute aspect-[24/24] bottom-[41.25%] top-[-1.25%] translate-x-[-50%]" style={{ left: "calc(50% - 0.25px)" }}>
        <Image
          src={isActive ? activeIcon : inactiveIcon}
          alt={name}
          width={24}
          height={24}
          className={cn(
            "transition-colors",
            isActive ? "text-white" : "text-gray-400"
          )}
        />
      </div>
      <div className="absolute font-nunito-sans inset-[70%_-1.04%_-5%_-1.04%] leading-[0] text-[10px] text-center">
        <p className={cn(
          "leading-[normal]",
          isActive 
            ? "text-white font-bold" 
            : "text-gray-400 font-medium"
        )}>
          {name}
        </p>
      </div>
    </Link>
  );
}

export function MobileNavigation() {
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
      name: "My bets",
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
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="relative backdrop-blur-[25px] backdrop-filter" style={{background: '#121214'}}>
        <div className="flex items-start justify-between px-4 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Tab
                key={item.name}
                name={item.name}
                activeIcon={item.activeIcon}
                inactiveIcon={item.inactiveIcon}
                path={item.path}
                isActive={isActive}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}