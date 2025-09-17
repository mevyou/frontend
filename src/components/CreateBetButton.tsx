"use client";

import Image from "next/image";
import { AppIcons } from "@/lib/appIcons";

interface CreateBetButtonProps {
  onClick: () => void;
  isCollapsed?: boolean;
  className?: string;
}

export function CreateBetButton({ onClick, isCollapsed = false, className = "" }: CreateBetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-white font-nunito-sans font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer hover:opacity-80 ${className}`}
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
      {!isCollapsed && <span>Create Bet</span>}
    </button>
  );
}
