"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AppIcons } from "@/lib/appIcons";
import { cn, formatWeiToEther } from "@/lib/utils";
import { SearchResult } from "@/lib/search";
import { useBetCreateds } from "@/hooks/useGraphData";
import { transformBetCreatedToBet } from "@/lib/betUtils";
import { BetStatus, ContractBetOption, getTotalStaked, type Options } from "@/lib/contracts/BettingContract";
import { getBetFromContract, type ContractBet } from "@/lib/contracts/BettingContract";
import TxButton from "@/components/TxButton";
import { gameABI, gameAddress } from "@/contract/contract";
import type { Abi } from "viem";
import { parseEther } from "viem";
import { AppImages } from "@/lib/appImages";

type FilterType = "all" | "open" | "matched" | "resolved";
type ViewType = "grid" | "list";

// Local UI type for bets rendered here
type UIBet = {
  id: number;
  betId: number;
  title: string;
  description: string;
  market: string;
  token: string;
  prediction: string;
  staked: string;
  position: string;
  positionDetails: string;
  status: "open" | "matched" | "resolved" | "pending";
  user: { name: string; image: string };
  opponent: { name: string; image: string };
  moderator: "accepted" | "pending" | "rejected" | string;
  createdAt: string;
  totalStaked: string;
  participants: number;
  options: Options[];
};

// Map BetStatus enum to this component's status strings
function mapBetStatusToString(status: BetStatus): "open" | "matched" | "resolved" | "pending" {
  switch (status) {
    case BetStatus.OPEN:
      return "open";
    case BetStatus.MATCHED:
      return "matched";
    case BetStatus.RESOLVED:
      return "resolved";
    default:
      return "pending";
  }
}


export function MyBetsPage() {
  const { address } = useAccount();
  const router = useRouter();
  const { data: betCreateds } = useBetCreateds(50);
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [gameType, setGameType] = useState<"public" | "private">("public");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedBet, setSelectedBet] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [tokenFilter, setTokenFilter] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSearchQuery, setInviteSearchQuery] = useState("");
  const [selectedBetForInvite, setSelectedBetForInvite] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inviteMenuOpenFor, setInviteMenuOpenFor] = useState<string | null>(null);
  const USER_TYPE = { participant: 0, moderator: 1 } as const;
  const [contractBet, setContractBet] = useState<ContractBet | null>(null);
  const [isLoadingContractBet, setIsLoadingContractBet] = useState(false);
  const [stakeAmounts, setStakeAmounts] = useState<Record<string, string>>({});
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);
  const [totalStaked, setTotalStaked] = useState<number>(0);

  useEffect(() => {
    const fetchOnchain = async () => {
      console.log('fetchOnchain', selectedBet);
      if (!selectedBet) {
        setContractBet(null);
        return;
      }
      // selectedBet is a numeric uint256 id
      let betBigId: bigint | null = null;
      try {
        betBigId = BigInt(selectedBet);
      } catch {
        betBigId = null;
      }
      if (!betBigId) {
        setContractBet(null);
        return;
      }
      setIsLoadingContractBet(true);
      try {
        console.log('betBigId', betBigId);
        const res = await getBetFromContract(betBigId);
        console.log('res', res);
        const _totalStaked = await getTotalStaked(betBigId);
        setTotalStaked(Number(_totalStaked));
        const total = res.options.reduce((sum, o) => sum + (o.totalStaked ?? BigInt(0)), BigInt(0));
        setTotalStaked(Number(total));
        console.log('totalStaked', totalStaked);
        setContractBet(res);
      } catch (e) {
        console.error('Failed to load on-chain bet:', e);
        setContractBet(null);
      } finally {
        setIsLoadingContractBet(false);
      }
    };
    fetchOnchain();
  }, [selectedBet, totalStaked]);

  // Fetch ETH price in USD for USD→ETH conversion
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsPriceLoading(true);
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const json = await res.json();
        const price = Number(json?.ethereum?.usd);
        if (!Number.isNaN(price) && price > 0) setEthUsd(price);
      } catch (e) {
        console.error('Failed to fetch ETH price:', e);
      } finally {
        setIsPriceLoading(false);
      }
    };
    fetchPrice();
  }, []);

  const filteredBets: UIBet[] = useMemo(() => {
    if (!address) return [];
    const ownerLower = address.toLowerCase();
    console.log('betCreateds', betCreateds);
    const myTransformed = (betCreateds || [])
      .map((b) => transformBetCreatedToBet(b))
      .filter((b) => (b.owner || '').toLowerCase() === ownerLower);

    const uiBets: UIBet[] = myTransformed.map((b) => {
      const opts = (b.options as Options[]);
      const zero = BigInt(0);
      const totalStakedBig = opts.reduce((sum, o) => sum + (o.totalStaked ?? zero), zero);
      return {
        id: b.id,
        betId: b.betId,
        title: b.name,
        description: b.description,
        market: "Crypto",
        token: "ETH",
        prediction: opts[0]?.option || "",
        staked: "-",
        position: "-",
        positionDetails: "-",
        status: mapBetStatusToString(b.status),
        user: { name: "You", image: `${AppImages.defaultAvatar}` },
        opponent: { name: "-", image: `${AppImages.defaultAvatar2}` },
        moderator: "pending",
        createdAt: new Date(b.createdAt * 1000).toLocaleDateString(undefined, { month: 'short', day: '2-digit' }),
        totalStaked: totalStakedBig.toString(),
        participants: opts.length,
        options: opts,
      };
    });

    return uiBets.filter((bet) => {
      switch (filter) {
        case "open":
          return bet.status === "open";
        case "matched":
          return bet.status === "matched";
        case "resolved":
          return bet.status === "resolved";
        default:
          return true;
      }
    });
  }, [address, betCreateds, filter]);

  const toggleExpanded = (betId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(String(betId))) {
      newExpanded.delete(String(betId));
    } else {
      newExpanded.add(String(betId));
    }
    setExpandedItems(newExpanded);
  };

  const openBetModal = (betId: number | null) => {
    if (betId == null) return;
    setSelectedBet(betId);
  };

  const closeBetModal = () => {
    setSelectedBet(null);
  };

  const handleViewMore = (betId: number | null) => {
    if (betId == null) return;
    router.push(`/games/${betId}`);
  };

  const handleInviteClick = (betId: number | null) => {
    if (betId == null) return;
    setSelectedBetForInvite(betId);
    setShowInviteModal(true);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setSelectedBetForInvite(null);
    setInviteSearchQuery("");
  };

  // Real search functionality using the existing API
  const performUserSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&types=user,profile&limit=10`);
      const data = await response.json();

      // Filter only user results (not bets)
      const userResults = data.results?.filter((result: SearchResult) =>
        result.type === 'user' || result.type === 'profile'
      ) || [];

      setSearchResults(userResults);
    } catch (error) {
      console.error('User search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchQueryChange = useCallback((query: string) => {
    setInviteSearchQuery(query);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      performUserSearch(query);
    }, 300);
  }, [performUserSearch]);

  const handleInviteUser = (userId: string, role: 'participant' | 'moderator' = 'participant') => {
    // Here you would implement the actual invite logic
    console.log(`Inviting user ${userId} to bet ${selectedBetForInvite} as ${role}`);
    // For now, just close the modal
    closeInviteModal();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-500/20 text-yellow-400";
      case "matched":
        return "bg-blue-500/20 text-blue-400";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open";
      case "matched":
        return "Matched";
      case "resolved":
        return "Resolved";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getTokenIcon = (token: string) => {
    switch (token) {
      case "USDT":
        return AppIcons.usdt;
      case "USDC":
        return AppIcons.usdc;
      case "BNB":
        return AppIcons.bnb;
      case "ETH":
        return AppIcons.eth;
      default:
        return AppIcons.coins;
    }
  };

  const getMarketIcon = (market: string) => {
    switch (market) {
      case "Crypto":
        return AppIcons.blockchain;
      case "Politics":
        return AppIcons.analytics;
      case "Economy":
        return AppIcons.dollar;
      case "Sports":
        return AppIcons.trophy;
      case "Gaming":
        return AppIcons.gameActive;
      default:
        return AppIcons.analytics;
    }
  };

  const getPredictionColor = (prediction: string) => {
    if (prediction.includes("Yes") || prediction.includes("≥")) {
      return "bg-green-500/20 text-green-400";
    } else if (prediction.includes("No") || prediction.includes("<")) {
      return "bg-red-500/20 text-red-400";
    } else {
      return "bg-blue-500/20 text-blue-400";
    }
  };

  if (!address) {
    return (
      <div className="w-full p-6 bg-zinc-900 rounded-lg flex flex-col justify-center items-center gap-4">
        <div className="text-white text-xl font-semibold">Connect Your Wallet</div>
        <div className="text-gray-400 text-sm">Please connect your wallet to view your bets</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-zinc-900 rounded-lg flex flex-col justify-start items-start gap-6 overflow-hidden">
      {/* Header */}
      <div className="self-stretch flex justify-between items-center">
        <div className="text-white text-2xl font-semibold font-['Nunito_Sans'] leading-7">My Bets</div>
        <div className="flex items-center gap-4">
          {/* Game Type Tabs */}
          <div className="flex bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setGameType("public")}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                gameType === "public" ? "bg-cyan-400 text-zinc-800" : "text-gray-400 hover:text-white"
              )}
            >
              <Image src={AppIcons.list} alt="Public" width={16} height={16} />
              Public games
            </button>
            <button
              onClick={() => setGameType("private")}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                gameType === "private" ? "bg-cyan-400 text-zinc-800" : "text-gray-400 hover:text-white"
              )}
            >
              <Image src={AppIcons.gridView} alt="Private" width={16} height={16} />
              Private games
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setViewType("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewType === "list" ? "bg-cyan-400 text-zinc-800" : "text-gray-400 hover:text-white"
              )}
            >
              <Image src={AppIcons.list} alt="List" width={16} height={16} />
            </button>
            <button
              onClick={() => setViewType("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewType === "grid" ? "bg-cyan-400 text-zinc-800" : "text-gray-400 hover:text-white"
              )}
            >
              <Image src={AppIcons.gridView} alt="Grid" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="self-stretch flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image src={AppIcons.search} alt="Search" width={16} height={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Q Search"
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 bg-neutral-800 rounded-lg text-white text-sm font-medium appearance-none pr-8 border border-neutral-700"
            >
              <option value="all">Open</option>
              <option value="open">Open</option>
              <option value="matched">Matched</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Image src={AppIcons.arrowDown} alt="Dropdown" width={12} height={12} />
            </div>
          </div>

          <div className="relative">
            <select
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-800 rounded-lg text-white text-sm font-medium appearance-none pr-8 border border-neutral-700"
            >
              <option value="all">All tokens</option>
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
              <option value="BNB">BNB</option>
              <option value="ETH">ETH</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Image src={AppIcons.arrowDown} alt="Dropdown" width={12} height={12} />
            </div>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-neutral-800 rounded-lg text-white text-sm font-medium appearance-none pr-8 border border-neutral-700"
            >
              <option value="latest">Sort by</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Image src={AppIcons.filters} alt="Sort" width={12} height={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewType === "grid" ? (
        /* Grid View */
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.id}
              onClick={() => openBetModal(bet.betId)}
              className="bg-neutral-800 rounded-xl p-4 cursor-pointer hover:bg-neutral-700 transition-all duration-200 hover:scale-105"
            >
              {/* Status and Stake */}
              <div className="flex justify-between items-start mb-3">
                <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(bet.status))}>
                  {getStatusText(bet.status)}
                </div>
                <div className="text-white text-lg font-bold">Stake: ${bet.staked} {bet.token}</div>
              </div>

              {/* User Profile Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Image
                    src={bet.user.image}
                    alt={bet.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{bet.user.name}</div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={getTokenIcon(bet.token)}
                      alt={bet.token}
                      width={12}
                      height={12}
                    />
                    <span className="text-gray-400 text-xs">{bet.token}</span>
                  </div>
                </div>
              </div>

              {/* Bet Title */}
              <div className="text-white text-sm font-medium mb-3 line-clamp-2">{bet.title}</div>

              {/* Prediction */}
              <div className="text-gray-400 text-xs mb-2">Your Prediction:</div>
              <div className={cn("px-2 py-1 rounded-full text-xs font-medium inline-block", getPredictionColor(bet.prediction))}>
                {bet.prediction}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-700">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <Image
                      src={bet.opponent.image}
                      alt="Opponent"
                      width={16}
                      height={16}
                      className="rounded-full border border-neutral-800"
                    />
                    <Image
                      src={bet.user.image}
                      alt="User"
                      width={16}
                      height={16}
                      className="rounded-full border border-neutral-800"
                    />
                  </div>
                  <span className="text-gray-400 text-xs">+{bet.participants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={getTokenIcon(bet.token)}
                    alt={bet.token}
                    width={12}
                    height={12}
                  />
                  <span className="text-gray-400 text-xs">${bet.totalStaked}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Image
                    src={AppIcons.timer}
                    alt="Date"
                    width={12}
                    height={12}
                  />
                  <span className="text-gray-400 text-xs">{bet.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="self-stretch flex flex-col gap-2">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-neutral-800 rounded-lg text-gray-400 text-sm font-medium">
            <div>Market</div>
            <div>Token</div>
            <div>Your Prediction</div>
            <div>Staked</div>
            <div>Position</div>
            <div>Action</div>
          </div>

          {/* List Items */}
          {filteredBets.map((bet) => (
            <div key={bet.id} className="bg-neutral-800 rounded-lg">
              {/* Main Row */}
              <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                <div className="flex items-center gap-2">
                  <Image
                    src={getMarketIcon(bet.market)}
                    alt={bet.market}
                    width={16}
                    height={16}
                  />
                  <span className="text-white text-sm font-medium">{bet.market}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={getTokenIcon(bet.token)}
                    alt={bet.token}
                    width={16}
                    height={16}
                  />
                  <span className="text-white text-sm font-medium">{bet.token}</span>
                </div>
                <div className={cn("px-2 py-1 rounded-full text-xs font-medium inline-block", getPredictionColor(bet.prediction))}>
                  {bet.prediction}
                </div>
                <div className="text-white text-sm font-medium">${bet.staked}</div>
                <div className="text-white text-sm font-medium">{bet.position}</div>
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleExpanded(bet.id)}
                    className="p-1 hover:bg-neutral-700 rounded transition-colors"
                  >
                    <Image
                      src={AppIcons.chevronDown}
                      alt="Expand"
                      width={16}
                      height={16}
                      className={cn(
                        "transition-transform",
                        expandedItems.has(String(bet.id)) ? "rotate-180" : ""
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedItems.has(String(bet.id)) && (
                <div className="px-4 pb-4 border-t border-neutral-700">
                  <div className="pt-4 space-y-3">
                    {/* Opponent Info */}
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 text-sm">Opponent:</div>
                      <div className="flex items-center gap-2">
                        <Image
                          src={bet.opponent.image}
                          alt={bet.opponent.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-white text-sm">{bet.opponent.name}</span>
                      </div>
                    </div>

                    {/* Moderator Status */}
                    <div className="flex items-center gap-3">
                      <div className="text-gray-400 text-sm">Moderator:</div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        bet.moderator === "accepted" ? "bg-green-500/20 text-green-400" :
                          bet.moderator === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                      )}>
                        {bet.moderator === "accepted" ? "Accepted" :
                          bet.moderator === "pending" ? "Pending" : "Rejected"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <div className="relative">
                        <button
                          onClick={() => handleInviteClick(bet.id)}
                          className="px-4 py-2 bg-cyan-400/5 rounded-[99px] border border-cyan-400/20 inline-flex justify-start items-center gap-2 hover:bg-cyan-400/10 transition-colors"
                        >
                          <div className="w-6 h-6 relative">
                            <div className="w-2.5 h-2.5 left-[4px] top-[3.50px] absolute border border-white rounded-sm" />
                            <div className="w-3.5 h-1.5 left-[2px] top-[13.50px] absolute border border-white rounded-sm" />
                            <div className="w-1.5 h-1.5 left-[16px] top-[9px] absolute border border-white rounded-sm" />
                          </div>
                          <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-normal">Invite</div>
                        </button>
                      </div>
                      <button
                        onClick={() => handleViewMore(bet.id)}
                        className="px-3 py-1 bg-neutral-700 text-white rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredBets.length === 0 && (
        <div className="self-stretch flex flex-col justify-center items-center gap-4 py-12">
          <div className="text-gray-400 text-lg">No bets found</div>
          <div className="text-gray-500 text-sm">
            {filter === "all" ? "Start betting to see your activity here!" : "Try adjusting your filter"}
          </div>
        </div>
      )}

      {/* Bet Details Modal */}
      {selectedBet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-neutral-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-lg font-semibold">Bet Details</h3>
              <div className="flex items-center gap-5">

                <button
                  onClick={() => handleInviteClick(selectedBet)}
                  className="px-4 py-1 bg-cyan-400/5 rounded-lg border border-cyan-400/20 inline-flex justify-start items-center gap-2 hover:bg-cyan-400/10 transition-colors "
                >
                  <div className="w-6 h-6 relative">
                    <div className="w-2.5 h-2.5 left-[4px] top-[3.50px] absolute border border-white rounded-sm" />
                    <div className="w-3.5 h-1.5 left-[2px] top-[13.50px] absolute border border-white rounded-sm" />
                    <div className="w-1.5 h-1.5 left-[16px] top-[9px] absolute border border-white rounded-sm" />
                  </div>
                  <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-normal">Invite</div>
                </button>
                <button
                  onClick={closeBetModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {(() => {
              const bet = filteredBets.find(b => b.betId === selectedBet);
              if (!bet) return null;

              return (
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Title</div>
                    <div className="text-white text-sm">{bet.title}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Description</div>
                    <div className="text-white text-sm">{bet.description}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Status</div>
                      <div className={cn("px-2 py-1 rounded-full text-xs font-medium inline-block", getStatusColor(bet.status))}>
                        {getStatusText(bet.status)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Staked</div>
                      <div className="text-white text-sm">
                        {formatWeiToEther(BigInt(totalStaked))} ETH
                        {ethUsd && (
                          <span className="ml-1 text-gray-400">
                            (${(parseFloat(formatWeiToEther(BigInt(totalStaked))) * ethUsd).toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Opponent</div>
                    <div className="flex items-center gap-2">
                      <Image
                        src={bet.opponent.image}
                        alt={bet.opponent.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-white text-sm">{bet.opponent.name}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-1">Moderator</div>
                    <div className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium inline-block",
                      bet.moderator === "accepted" ? "bg-green-500/20 text-green-400" :
                        bet.moderator === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                    )}>
                      {bet.moderator === "accepted" ? "Accepted" :
                        bet.moderator === "pending" ? "Pending" : "Rejected"}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    {/* Options list with stake buttons */}
                    <div className="space-y-2 w-full">
                      <div className="text-gray-400 text-sm">Options</div>
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const opts: ContractBetOption[] = (contractBet && !isLoadingContractBet)
                            ? (contractBet.options)
                            : (bet.options);
                          return Array.isArray(opts) && opts.length > 0 ? (
                            opts.map((opt, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-neutral-700/50 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-white text-sm font-medium">{opt.option}</span>
                                  <span className="text-gray-400 text-xs">
                                    Staked: {formatWeiToEther(contractBet?.options[idx]?.totalStaked ?? BigInt(0))} ETH
                                    {ethUsd && (
                                      <span className="ml-1">
                                        (${(parseFloat(formatWeiToEther(contractBet?.options[idx]?.totalStaked ?? BigInt(0))) * ethUsd).toFixed(2)})
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div>

                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="Amount (USD)"
                                      className="w-32 px-2 py-1 rounded bg-neutral-800 text-white text-xs border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                                      value={stakeAmounts[`${bet.betId}-${idx}`] ?? ''}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setStakeAmounts((prev) => ({ ...prev, [`${bet.betId}-${idx}`]: v }));
                                      }}
                                    />
                                    <div className="text-gray-400 text-[10px] w-24">
                                      {(() => {
                                        const usdStr = stakeAmounts[`${bet.betId}-${idx}`];
                                        const usdVal = Number(usdStr);
                                        if (!ethUsd || Number.isNaN(usdVal) || usdVal <= 0) return '≈ 0 ETH';
                                        const ethAmt = usdVal / ethUsd;
                                        return `≈ ${ethAmt.toFixed(6)} ETH`;
                                      })()}
                                    </div>
                                  </div>
                                  <TxButton
                                    address={gameAddress as `0x${string}`}
                                    abi={gameABI as unknown as Abi}
                                    functionName="stake"
                                    args={[BigInt(bet.betId), BigInt(idx)]}
                                    value={(() => {
                                      const usdStr = stakeAmounts[`${bet.betId}-${idx}`];
                                      const usdVal = Number(usdStr);
                                      if (!ethUsd || Number.isNaN(usdVal) || usdVal <= 0) return undefined as unknown as bigint;
                                      try {
                                        const ethAmt = usdVal / ethUsd;
                                        return parseEther(ethAmt.toFixed(6));
                                      } catch {
                                        return undefined as unknown as bigint;
                                      }
                                    })()}
                                    idleLabel="Stake"
                                    pendingLabel="Staking..."
                                    successLabel="Staked"
                                    className="w-24"
                                    showCancel={false}
                                    disabled={isPriceLoading || !ethUsd || !(Number(stakeAmounts[`${bet.betId}-${idx}`]) > 0)}
                                  />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 text-xs">No options found</div>
                          );
                        })()}
                      </div>
                    </div>



                  </div>
                  <button
                    onClick={() => handleViewMore(bet.id)}
                    className="flex-1 px-4 py-2 underline text-white rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors w-full"
                  >
                    View More
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Invite Search Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-neutral-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-lg font-semibold">Invite to Bet</h3>
              <button
                onClick={closeInviteModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Image src={AppIcons.search} alt="Search" width={16} height={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={inviteSearchQuery}
                onChange={(e) => handleSearchQueryChange(e.target.value)}
                placeholder="Search users by name or address..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {isSearching && (
                <div className="text-center py-4">
                  <div className="text-gray-400 text-sm">Searching...</div>
                </div>
              )}

              {!isSearching && searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.title}
                        width={45}
                        height={45}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-white text-sm font-medium">
                        {user.title.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{user.title}</div>
                    <div className="text-gray-400 text-xs">
                      {user.subtitle || (user.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : '')}
                    </div>
                    {user.description && (
                      <div className="text-gray-500 text-xs mt-1 truncate w-[200px]">{user.description}</div>
                    )}
                  </div>
                  <div className="relative flex items-center gap-2">
                    <TxButton
                      address={gameAddress as `0x${string}`}
                      abi={gameABI as unknown as Abi}
                      functionName="addUserToGroup"
                      args={[
                        selectedBetForInvite != null ? BigInt(selectedBetForInvite) : BigInt(0),
                        (user.address || '') as `0x${string}`,
                        USER_TYPE.participant,
                      ]}
                      disabled={selectedBetForInvite == null || !user.address}
                      idleLabel="Invite"
                      pendingLabel="Inviting…"
                      successLabel="Invited"
                      className="px-3 py-1 text-zinc-800 rounded text-sm font-medium transition-colors bg-transparent"
                      showCancel={false}
                    />
                    <button
                      onClick={() => setInviteMenuOpenFor((prev) => (prev === user.id ? null : user.id))}
                      className="px-2 py-1 rounded text-white hover:bg-neutral-500/40"
                      aria-label="More options"
                    >
                      ⋯
                    </button>
                    {inviteMenuOpenFor === user.id && (
                      <div className="absolute right-0 top-8 z-10 w-40 rounded-md shadow-lg p-0 m-0">
                        <div className="p-1">
                          <TxButton
                            address={gameAddress as `0x${string}`}
                            abi={gameABI as unknown as Abi}
                            functionName="addUserToGroup"
                            args={[
                              selectedBetForInvite != null ? BigInt(selectedBetForInvite) : BigInt(0),
                              (user.address || '') as `0x${string}`,
                              USER_TYPE.moderator,
                            ]}
                            disabled={selectedBetForInvite == null || !user.address}
                            idleLabel="Invite as moderator"
                            pendingLabel="Inviting…"
                            successLabel="Invited"
                            className="w-full text-left px-3 py-2 text-xs text-white rounded-md bg-transparent "
                            showCancel={false}
                            onReceiptSuccess={() => setInviteMenuOpenFor(null)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {!isSearching && searchResults.length === 0 && inviteSearchQuery.length >= 2 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">No users found</div>
                  <div className="text-gray-500 text-xs mt-1">Try a different search term</div>
                </div>
              )}

              {!isSearching && inviteSearchQuery.length < 2 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">Type at least 2 characters to search</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
