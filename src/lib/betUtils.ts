import { BetCreated } from '@/hooks/useGraphData';
import { BetStatus, BetType, Options } from '@/lib/contracts/BettingContract';
import { decodeAbiParameters, Hex } from 'viem';

export interface TransformedBet {
  id: number;
  betId: number;
  options: Options[] | string[];
  betType: BetType;
  name: string;
  description: string;
  image: string;
  link: string;
  owner: string;
  result: number; // result should be index of the option. 0 indexed. and -1 for no result.
  status: BetStatus;
  createdAt: number;
  updatedAt: number;
  betDuration: number;
  privateBet: boolean;
}

export function transformBetCreatedToBet(betCreated: BetCreated): TransformedBet {
  // Decode bet options which may be stored as JSON or ABI-encoded bytes via subgraph
  console.log("options", betCreated.bet_options);
  const options: Options[] | string[] = betCreated.bet_options;

  // Convert timestamps to numbers
  const createdAt = parseInt(betCreated.bet_createdAt) || Math.floor(Date.now() / 1000);
  const updatedAt = parseInt(betCreated.bet_updatedAt) || createdAt;
  const betDuration = parseInt(betCreated.bet_betDuration) || createdAt + 86400; // Default to 24 hours

  // Map bet status
  const statusMap: Record<string, BetStatus> = {
    '0': BetStatus.OPEN,
    '1': BetStatus.MATCHED,
    '2': BetStatus.RESOLVED,
    '3': BetStatus.CANCELLED,
  };

  // Map bet type
  const betTypeMap: Record<string, BetType> = {
    '0': BetType.SINGLE,
    '1': BetType.MULTI,
  };

  return {
    id: Number(betCreated.id),
    betId: betCreated.betId,
    options: options,
    betType: betTypeMap[betCreated.bet_betType] || BetType.SINGLE,
    name: betCreated.bet_name,
    description: betCreated.bet_description || betCreated.bet_name,
    image: '',
    link: betCreated.bet_link || '',
    owner: betCreated.bet_owner,
    result: parseInt(betCreated.bet_result) || -1, // -1 for no result
    status: statusMap[betCreated.bet_status] || BetStatus.OPEN,
    createdAt,
    updatedAt,
    betDuration,
    privateBet: betCreated.bet_privateBet,
  };
}

export function formatBetTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;

  if (diff <= 0) {
    return 'Expired';
  }

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  } else {
    return `${minutes}m left`;
  }
}

// Attempts to decode `bet_options` coming from the subgraph.
// Supports:
// 1) JSON string of [{ option, odds|totalStaked }]
// 2) JSON string of ["0x..."] where each element encodes (string,uint256)
// 3) Single hex string "0x..." encoding tuple(string,uint256)[]


// (Compact fallback removed to strictly honor (string,uint256) tuple decoding)

export function getBetStatusText(status: BetStatus): string {
  switch (status) {
    case BetStatus.OPEN:
      return 'Open';
    case BetStatus.MATCHED:
      return 'Matched';
    case BetStatus.RESOLVED:
      return 'Resolved';
    case BetStatus.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

export function getBetStatusColor(status: BetStatus): string {
  switch (status) {
    case BetStatus.OPEN:
      return 'text-green-400';
    case BetStatus.MATCHED:
      return 'text-blue-400';
    case BetStatus.RESOLVED:
      return 'text-purple-400';
    case BetStatus.CANCELLED:
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}
