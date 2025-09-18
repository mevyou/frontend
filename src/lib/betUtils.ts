import { BetCreated } from '@/hooks/useGraphData';
import { BetStatus, BetType, Options } from '@/lib/contracts/BettingContract';

export interface TransformedBet {
  id: string;
  options: Options[];
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
  // Parse the options JSON string
  let options: Options[] = [];
  try {
    if (betCreated.bet_options) {
      const parsedOptions = JSON.parse(betCreated.bet_options);
      options = parsedOptions.map((opt: { option: string; odds: string }) => ({
        option: opt.option,
        odds: BigInt(opt.odds || '0')
      }));
    }
  } catch (error) {
    console.error('Error parsing bet options:', error);
    options = [{ option: 'Default Option', odds: BigInt(0) }];
  }

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
    id: betCreated.id,
    options,
    betType: betTypeMap[betCreated.bet_betType] || BetType.SINGLE,
    name: betCreated.bet_name,
    description: betCreated.bet_description || betCreated.bet_name,
    image: betCreated.bet_image || '',
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
