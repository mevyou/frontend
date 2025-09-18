"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { WalletConnect } from "./WalletConnect";
import { formatWeiToEther, formatAddress, cn } from "@/lib/utils";
import { AppIcons } from "@/lib/assets";
// Removed unused search context import
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { AppImages } from "@/lib/appImages";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { SearchSuggestions } from "./SearchSuggestions";
import { useSearch as useSearchHook } from "@/hooks/useSearch";

interface TopHeaderProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  onCreateBetClick?: () => void;
  hideSearch?: boolean;
  hideTokenBalance?: boolean;
}

export function TopHeader({ isSidebarCollapsed, onSidebarToggle, onCreateBetClick, hideSearch, hideTokenBalance }: TopHeaderProps) {
  const { address, isConnected } = useAccount();
  const { data: nativeBalance } = useBalance({ address });
  // ERC20 token balances (mainnet addresses by default)
  const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as `0x${string}`;
  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48" as `0x${string}`;
  const { data: usdtBalance } = useBalance({ address, token: USDT_ADDRESS });
  const { data: usdcBalance } = useBalance({ address, token: USDC_ADDRESS });
  const { disconnect } = useDisconnect();
  // Removed old search context - now using custom search hook
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTokenMenuOpen, setIsTokenMenuOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<"USDT" | "USDC">("USDT");
  const profileRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();
  const router = useRouter();
  // Avoid hydration mismatch for wallet-dependent UI
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search functionality
  const {
    query: searchInput,
    setQuery: setSearchInput,
    isOpen: isSearchOpen,
    setIsOpen: setIsSearchOpen,
    searchRef,
    performSearch,
    handleSelect,
    handleKeyDown,
  } = useSearchHook();
  // Debounced search effect
  useEffect(() => {
    if (searchInput && searchInput.length >= 2) {
      const timeoutId = setTimeout(() => {
        performSearch(searchInput);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchInput, performSearch]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (
        tokenRef.current &&
        !tokenRef.current.contains(event.target as Node)
      ) {
        setIsTokenMenuOpen(false);
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
          {!hideSearch && (
            <div ref={searchRef} className="relative flex items-center space-x-2">
              <div className="relative w-64 lg:w-80">
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
                  placeholder="Search users, bets, addresses..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchInput.length >= 2 && setIsSearchOpen(true)}
                  className="border-0 rounded-lg pl-10 pr-4 py-2 h-10 text-white placeholder-gray-400 focus:outline-none focus:ring-0 w-full font-nunito-sans"
                  style={{ backgroundColor: '#242429' }}
                />
                <SearchSuggestions
                  query={searchInput}
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Balance & Wallet */}
        <div className="flex items-center space-x-4">
          {/* Token Balance with dropdown */}
          {mounted && isConnected && !hideTokenBalance && (
            <div ref={tokenRef} className="relative hidden sm:flex">
              <button
                onClick={() => setIsTokenMenuOpen(!isTokenMenuOpen)}
                className="inline-flex items-center gap-2 rounded-[99px] px-3 py-2"
                style={{ backgroundColor: '#121214', outline: '1px solid rgba(34,197,94,0.2)' }}
              >
                <Image src={selectedToken === 'USDT' ? AppIcons.usdt : AppIcons.usdc} alt="Token" width={20} height={20} />
                <span className="text-white font-nunito-sans font-semibold">
                  {selectedToken === "USDT"
                    ? `${Number(usdtBalance?.formatted || 0).toFixed(2)} USDT`
                    : `${Number(usdcBalance?.formatted || 0).toFixed(2)} USDC`}
                </span>
                <Image src={AppIcons.arrowDown} alt="Open" width={16} height={16} />
              </button>

              {isTokenMenuOpen && (
                <div className="absolute right-0 mt-12 rounded-xl shadow-xl w-44 -px-6 -py-2 z-50" style={{ backgroundColor: '#121214', border: '1px solid #2d2d33', minWidth: '100%' }}>
                  <button
                    onClick={() => {
                      setSelectedToken("USDT");
                      setIsTokenMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white"
                    style={{ background: 'transparent' }}
                  >
                    <Image src={AppIcons.usdt} alt="USDT" width={16} height={16} />
                    <span>USDT — {Number(usdtBalance?.formatted || 0).toFixed(2)}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedToken("USDC");
                      setIsTokenMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white"
                    style={{ background: 'transparent' }}
                  >
                    <Image src={AppIcons.usdc} alt="USDC" width={16} height={16} />
                    <span>USDC — {Number(usdcBalance?.formatted || 0).toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Wallet Connection */}
          {!mounted ? null : !isConnected ? (
            <WalletConnect />
          ) : (
            // <div ref={profileRef} className="relative">
            //   <button
            //     onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            //     className="flex items-center space-x-2 bg-search-input hover:bg-search-input/80 text-white rounded-lg px-4 py-2 transition-colors font-nunito-sans font-medium"
            //   >
            //     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            //       <Image
            //         src={AppIcons.user}
            //         alt="User"
            //         width={14}
            //         height={14}
            //         className="text-white"
            //       />
            //     </div>
            //     <span className="hidden sm:inline">
            //       {address && formatAddress(address)}
            //     </span>
            //     <svg
            //       className={cn(
            //         "w-4 h-4 transition-transform duration-200",
            //         isProfileMenuOpen && "rotate-180"
            //       )}
            //       fill="none"
            //       stroke="currentColor"
            //       viewBox="0 0 24 24"
            //     >
            //       <path
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //         strokeWidth={2}
            //         d="M19 9l-7 7-7-7"
            //       />
            //     </svg>
            //   </button>

            //   {/* Profile Dropdown */}
            //   {isProfileMenuOpen && (
            //     <div className="absolute right-0 mt-2 w-64 bg-search-input border border-gray-700 rounded-xl shadow-xl py-2 z-50">
            //       {/* User Info */}
            //       <div className="px-4 py-3 border-b border-gray-700">
            //         <div className="flex items-center space-x-3">
            //           <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            //             <Image
            //               src={AppIcons.user}
            //               alt="User"
            //               width={20}
            //               height={20}
            //               className="text-primary"
            //             />
            //           </div>
            //           <div>
            //             <p className="text-white font-nunito-sans font-medium">
            //               {address && formatAddress(address)}
            //             </p>
            //             {balance && (
            //               <p className="text-gray-400 text-sm font-nunito-sans">
            //                 {formatWeiToEther(balance.value)} ETH
            //               </p>
            //             )}
            //           </div>
            //         </div>
            //       </div>

            //       {/* Menu Items */}
            //       <div className="py-2">
            //         <button
            //           onClick={copyAddress}
            //           className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-nunito-sans"
            //         >
            //           <Image
            //             src={AppIcons.file}
            //             alt="Copy"
            //             width={16}
            //             height={16}
            //             className="text-gray-400"
            //           />
            //           <span>Copy Address</span>
            //         </button>

            //         <a
            //           href={`https://etherscan.io/address/${address}`}
            //           target="_blank"
            //           rel="noopener noreferrer"
            //           className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors font-nunito-sans"
            //         >
            //           <Image
            //             src={AppIcons.share}
            //             alt="External"
            //             width={16}
            //             height={16}
            //             className="text-gray-400"
            //           />
            //           <span>View on Etherscan</span>
            //         </a>
            //       </div>

            //       {/* Disconnect Button */}
            //       <div className="border-t border-gray-700 pt-2">
            //         <button
            //           onClick={handleDisconnect}
            //           className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors font-nunito-sans"
            //         >
            //           <Image
            //             src={AppIcons.cancelCircle}
            //             alt="Disconnect"
            //             width={24}
            //             height={24}
            //             className="text-red-400"
            //           />
            //           <span>Disconnect Wallet</span>
            //         </button>
            //       </div>
            //     </div>
            //   )}
            // </div>
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 bg-search-input hover:bg-search-input/80 text-white rounded-lg px-4 py-2 transition-colors font-nunito-sans font-medium"
              >
                <Link href="/profile" className="flex items-center justify-center">
                  <Image
                    src={profile?.image || AppImages.defaultAvatar}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                </Link>
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

              {isProfileMenuOpen && (
                <div className="absolute bg-black right-0 mt-2 w-64 rounded-xl shadow-xl py-2 z-50" style={{ backgroundColor: '#121214', border: '1px solid #2d2d33' }}>
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Image
                          src={profile?.image || AppImages.defaultAvatar}
                          alt="User"
                          width={36}
                          height={36}
                          className="text-primary rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-nunito-sans font-medium">Profile</p>
                        {nativeBalance && (
                          <p className="text-gray-400 text-sm font-nunito-sans">
                            {formatWeiToEther(nativeBalance.value)} ETH
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer hover:text-white transition-colors font-nunito-sans"
                    >
                      <Image
                        src={profile?.image || AppImages.defaultAvatar}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="text-gray-400 rounded-full object-cover"
                      />
                      <span>View Profile</span>
                    </button>
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
                  <Link href="/profile" className="flex items-center justify-center">
                    <Image
                      src={profile?.image || AppImages.defaultAvatar}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  </Link>
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
                  <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl py-2 z-50" style={{ backgroundColor: '#121214', border: '1px solid #2d2d33' }}>
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Image
                            src={profile?.image || AppImages.defaultAvatar}
                            alt="User"
                            width={20}
                            height={20}
                            className="text-primary rounded-full object-cover"
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
                          src={profile?.image || AppImages.defaultAvatar}
                          alt="Copy"
                          width={16}
                          height={16}
                          className="text-gray-400 rounded-full object-cover"
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
          {!hideSearch && (
            <div ref={searchRef} className="flex-1 relative">
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
                placeholder="Search users, bets, addresses..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchInput.length >= 2 && setIsSearchOpen(true)}
                className="w-full border-0 rounded-lg pl-10 pr-4 py-2 h-10 text-white placeholder-gray-400 focus:outline-none focus:ring-0 font-nunito-sans"
                style={{ backgroundColor: '#242429' }}
              />
              <SearchSuggestions
                query={searchInput}
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={handleSelect}
              />
            </div>
          )}

          {/* Plus Icon Container */}
          {!hideSearch && (
            <button
              onClick={onCreateBetClick}
              className="text-white p-2 h-10 w-10 rounded-lg transition-colors duration-200 flex items-center justify-center hover:opacity-80"
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
    </header>
  );
}
