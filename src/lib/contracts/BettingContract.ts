export const BETTING_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" }
    ],
    "name": "createBet",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
    "name": "joinBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_betId", "type": "uint256" },
      { "internalType": "address", "name": "_winner", "type": "address" }
    ],
    "name": "resolveBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
    "name": "cancelBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
    "name": "getBet",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "address", "name": "opponent", "type": "address" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "address", "name": "winner", "type": "address" }
        ],
        "internalType": "struct BettingContract.Bet",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBets",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "address", "name": "opponent", "type": "address" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "deadline", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "address", "name": "winner", "type": "address" }
        ],
        "internalType": "struct BettingContract.Bet[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "BetCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "opponent", "type": "address" }
    ],
    "name": "BetJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "BetResolved",
    "type": "event"
  }
] as const;

export enum BetStatus {
  OPEN = 0,
  MATCHED = 1,
  RESOLVED = 2,
  CANCELLED = 3
}

export enum BetType {
  SINGLE = 0,
  MULTI = 1
}

export interface Options {
  option: string;
  totalStaked: bigint;
}

export interface Bet {
  id: bigint;
  creator: string;
  opponent: string;
  amount: bigint;
  deadline: bigint;
  winner: string;
  options: Options[];
  betType: BetType;
  name: string;
  description: string;
  image: string;
  link: string;
  owner: string;
  result: bigint; // result should be index of the option. 0 indexed. and -1 for no result.
  status: BetStatus;
  createdAt: bigint;
  updatedAt: bigint;
  betDuration: bigint;
  privateBet: boolean;
}

export const BETTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BETTING_CONTRACT_ADDRESS || '0x';