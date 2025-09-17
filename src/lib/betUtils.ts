import { BetCreated } from '@/hooks/useGraphData';
import { BetStatus } from '@/lib/contracts/BettingContract';

export interface TransformedBet {
  id: string;
  creator: string;
  opponent: string;
  description: string;
  amount: string;
  deadline: number;
  status: BetStatus;
  winner: string;
  name: string;
  link: string;
  image?: string;
  privateBet: boolean;
  betType: number;
  options: Array<{
    option: string;
    odds: string;
  }>;
  createdAt: number;
  updatedAt: number;
  result: string;
}

export function transformBetCreatedToBet(betCreated: BetCreated): TransformedBet {
  // Parse the options JSON string
  let options: Array<{ option: string; odds: string }> = [];
  try {
    if (betCreated.bet_options) {
      options = JSON.parse(betCreated.bet_options);
    }
  } catch (error) {
    console.error('Error parsing bet options:', error);
    options = [{ option: 'Default Option', odds: '1.0' }];
  }

  // Convert timestamps to numbers
  const createdAt = parseInt(betCreated.bet_createdAt) || Math.floor(Date.now() / 1000);
  const updatedAt = parseInt(betCreated.bet_updatedAt) || createdAt;
  const deadline = parseInt(betCreated.bet_betDuration) || createdAt + 86400; // Default to 24 hours

  // Map bet status
  const statusMap: Record<string, BetStatus> = {
    '0': BetStatus.OPEN,
    '1': BetStatus.MATCHED,
    '2': BetStatus.RESOLVED,
    '3': BetStatus.CANCELLED,
  };

  return {
    id: betCreated.id,
    creator: betCreated.bet_owner,
    opponent: '', // Not available in GraphQL data
    description: betCreated.bet_description || betCreated.bet_name,
    amount: '0.001', // Default amount since it's not in the GraphQL data
    deadline,
    status: statusMap[betCreated.bet_status] || BetStatus.OPEN,
    winner: betCreated.bet_result || '',
    name: betCreated.bet_name,
    link: betCreated.bet_link,
    privateBet: betCreated.bet_privateBet,
    betType: parseInt(betCreated.bet_betType) || 0,
    options,
    createdAt,
    updatedAt,
    result: betCreated.bet_result || '',
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
