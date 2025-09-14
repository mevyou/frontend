"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { LogOut } from "lucide-react";
import Image from "next/image";
import { getIconWithColor } from "@/lib/assets";



export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-card-foreground font-medium">
            {formatAddress(address)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-1 text-brand-red hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <ConnectWalletButton />
  );
}

export function ConnectWalletButton() {
  const { open } = useWeb3Modal();

  const handleConnect = () => {
    open();
  };

  return (
    <button 
      onClick={handleConnect}
      className="flex items-center gap-2 bg-[#02FEFE] hover:bg-[#02FEFE]/90 text-black px-4 py-2 rounded-lg font-bold transition-colors border border-[#02FEFE] h-10"
    >
      <Image
        src={getIconWithColor('wallet', 'black').src}
        alt="Wallet"
        width={20}
        height={20}
        style={getIconWithColor('wallet', 'black').style}
      />
      <span>Connect Wallet</span>
    </button>
  );
}
