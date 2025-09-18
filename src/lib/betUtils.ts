import { BetCreated } from '@/hooks/useGraphData';
import { BetStatus, BetType, Options } from '@/lib/contracts/BettingContract';
import { decodeAbiParameters, Hex } from 'viem';

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
  // Decode bet options which may be stored as JSON or ABI-encoded bytes via subgraph
  console.log("options", betCreated.bet_options);
  const options: Options[] = decodeBetOptionsField(betCreated.bet_options);

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
function decodeBetOptionsField(raw: string | string[] | null | undefined): Options[] {
  if (!raw) {
    return [{ option: 'Default Option', totalStaked: BigInt(0) }];
  }

  // Helper to coerce any number-like to bigint
  const toBigInt = (value: unknown): bigint => {
    try {
      if (typeof value === 'bigint') return value;
      if (typeof value === 'number') return BigInt(Math.trunc(value));
      if (typeof value === 'string') return BigInt(value);
    } catch { }
    return BigInt(0);
  };

  // Direct array of hex strings
  if (Array.isArray(raw)) {
    const arr = raw.filter((h): h is string => typeof h === 'string');
    const decoded = arr
      .filter((h) => h.startsWith('0x'))
      .map((h) => safeDecodeTuple(h as Hex))
      .filter((x) => x.option !== '' || x.totalStaked !== BigInt(0));
    if (decoded.length > 0) return decoded;
    return [{ option: 'Default Option', totalStaked: BigInt(0) }];
  }

  // Case 1: JSON array/object string
  try {
    const parsed = JSON.parse(raw);

    // Case 1a: Array of objects with option + odds/totalStaked
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
      return parsed.map((opt: { option?: string; odds?: unknown; totalStaked?: unknown }) => ({
        option: String(opt.option ?? ''),
        totalStaked: toBigInt(opt.totalStaked ?? opt.odds ?? 0),
      }));
    }

    // Case 2: Array of hex strings, each encodes (string,uint256)
    if (Array.isArray(parsed) && (parsed.length === 0 || typeof parsed[0] === 'string')) {
      const arr = parsed as string[];
      const decoded = arr
        .filter((h) => typeof h === 'string' && h.startsWith('0x'))
        .map((h) => safeDecodeTuple(h as Hex));
      if (decoded.length > 0) return decoded;
    }
  } catch {
    // Not JSON; fall through to hex handling
  }

  // Case 3: Single hex that encodes tuple[]
  if (typeof raw === 'string' && raw.startsWith('0x')) {
    try {
      const [tuples] = decodeAbiParameters(
        [
          {
            type: 'tuple[]',
            components: [
              { name: 'option', type: 'string' },
              { name: 'totalStaked', type: 'uint256' },
            ],
          },
        ],
        raw as Hex,
      ) as unknown as [Array<{ option: string; totalStaked: bigint } | undefined>];

      if (Array.isArray(tuples)) {
        return tuples.map((t) => ({ option: t ? t.option : '', totalStaked: toBigInt(t ? t.totalStaked : 0) }));
      }
    } catch (e) {
      console.error('Failed to decode bet options hex array (tuple[]):', e);
    }
  }

  // Fallback
  return [{ option: 'Default Option', totalStaked: BigInt(0) }];
}

function safeDecodeTuple(hex: Hex): Options {
  try {
    const [opt, amount] = decodeAbiParameters(
      [
        { type: 'string' },
        { type: 'uint256' },
      ],
      hex,
    ) as unknown as [string, bigint];

    return { option: opt, totalStaked: amount };
  } catch (e) {
    console.error('Failed to decode bet option tuple hex (string,uint256):', e, hex);
    return { option: '', totalStaked: BigInt(0) };
  }
}

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
