"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { WalletConnect } from "./WalletConnect";
import { formatWeiToEther, formatAddress, cn } from "@/lib/utils";
import { AppIcons } from "@/lib/assets";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface TopHeaderProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export function TopHeader({ isSidebarCollapsed, onSidebarToggle }: TopHeaderProps) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsProfileMenuOpen(false);
    toast.success("Wallet disconnected");
  };

  return (
    <header className="bg-sidebar border-b border-transparent px-6 py-4">
      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button (when collapsed) */}
          {isSidebarCollapsed && onSidebarToggle && (
            <button
              onClick={onSidebarToggle}
              className="bg-sidebar rounded-full p-1.5 border border-transparent hover:bg-gray-700 transition-colors"
            >
              <Image
                 src={AppIcons.sidebarLeft}
                 alt="Toggle"
                 width={20}
                 height={20}
                 className="text-gray-400 transition-transform duration-300 rotate-180"
               />
            </button>
          )}
          {/* Search Bar */}
          <div className="relative flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Image
                  src={AppIcons.search}
                  alt="Search"
                  width={16}
                  height={16}
                  className="text-gray-400"
                />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="border-0 rounded-lg pl-10 pr-4 py-2 h-10 text-white placeholder-gray-400 focus:outline-none focus:ring-0 w-64 lg:w-80 font-nunito-sans"
                style={{ backgroundColor: '#242429' }}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Balance & Wallet */}
        <div className="flex items-center space-x-4">
          {/* Balance Display */}
          {isConnected && balance && (
            <div className="hidden sm:flex items-center space-x-2 bg-search-input rounded-lg px-4 py-2">
              <Image
                src={AppIcons.dollar}
                alt="Balance"
                width={16}
                height={16}
                className="text-primary"
              />
              <span className="text-white font-nunito-sans font-semibold">
                {formatWeiToEther(balance.value)} USDT
              </span>
            </div>
          )}

          {/* Wallet Connection */}
          {!isConnected ? (
            <WalletConnect />
          ) : (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 bg-search-input hover:bg-search-input/80 text-white rounded-lg px-4 py-2 transition-colors font-nunito-sans font-medium"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Image
                    src={AppIcons.user}
                    alt="User"
                    width={14}
                    height={14}
                    className="text-white"
                  />
                </div>
                <span className="hidden sm:inline">
                  {address && formatAddress(address)}
                </span>
                <svg
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isProfileMenuOpen && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-search-input border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Image
                          src={AppIcons.user}
                          alt="User"
                          width={20}
                          height={20}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <p className="text-white font-nunito-sans font-medium">
                          {address && formatAddress(address)}
                        </p>
                        {balance && (
                          <p className="text-gray-400 text-sm font-nunito-sans">
                            {formatWeiToEther(balance.value)} ETH
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={copyAddress}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-nunito-sans"
                    >
                      <Image
                        src={AppIcons.file}
                        alt="Copy"
                        width={16}
                        height={16}
                        className="text-gray-400"
                      />
                      <span>Copy Address</span>
                    </button>

                    <a
                      href={`https://etherscan.io/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-nunito-sans"
                    >
                      <Image
                        src={AppIcons.share}
                        alt="External"
                        width={16}
                        height={16}
                        className="text-gray-400"
                      />
                      <span>View on Etherscan</span>
                    </a>
                  </div>

                  {/* Disconnect Button */}
                  <div className="border-t border-gray-700 pt-2">
                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors font-nunito-sans"
                    >
                      <Image
                        src={AppIcons.cancelCircle}
                        alt="Disconnect"
                        width={24}
                        height={24}
                        className="text-red-400"
                      />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Top Row - Logo and Connect Wallet */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image
              src={AppIcons.logo}
              alt="Logo"
              width={48}
              height={48}
              className="text-primary"
            />
          </div>
          <div>
            {!isConnected ? (
              <WalletConnect />
            ) : (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-search-input hover:bg-search-input/80 text-white rounded-lg px-4 py-2 transition-colors font-nunito-sans font-medium"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Image
                      src={AppIcons.user}
                      alt="User"
                      width={14}
                      height={14}
                      className="text-white"
                    />
                  </div>
                  <span className="hidden sm:inline">
                    {address && formatAddress(address)}
                  </span>
                  <svg
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isProfileMenuOpen && "rotate-180"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-search-input border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Image
                            src={AppIcons.user}
                            alt="User"
                            width={20}
                            height={20}
                            className="text-primary"
                          />
                        </div>
                        <div>
                          <p className="text-white font-nunito-sans font-semibold">
                            {address && formatAddress(address)}
                          </p>
                          <p className="text-gray-400 text-sm font-nunito-sans">
                            Connected
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={copyAddress}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-nunito-sans"
                      >
                        <Image
                          src={AppIcons.user}
                          alt="Copy"
                          width={16}
                          height={16}
                          className="text-gray-400"
                        />
                        <span>Copy Address</span>
                      </button>

                      <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors font-nunito-sans"
                      >
                        <Image
                          src={AppIcons.cancelCircle}
                          alt="Disconnect"
                          width={24}
                          height={24}
                          className="text-red-400"
                        />
                        <span>Disconnect Wallet</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row - Search and Plus Icon */}
        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Image
                src={AppIcons.search}
                alt="Search"
                width={16}
                height={16}
                className="text-gray-400"
              />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full border-0 rounded-lg pl-10 pr-4 py-2 h-10 text-white placeholder-gray-400 focus:outline-none focus:ring-0 font-nunito-sans"
              style={{ backgroundColor: '#242429' }}
            />
          </div>
          
          {/* Plus Icon Container */}
          <button 
            className="text-white p-2 h-10 w-10 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
        </div>
      </div>
    </header>
  );
}
