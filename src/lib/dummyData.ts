import { Bet, BetStatus, BetType } from './contracts/BettingContract'

const nowSec = BigInt(Math.floor(Date.now() / 1000))

// Dummy data for testing the betting interface
export const dummyBets: Bet[] = [
  {
    id: BigInt(1),
    betId: BigInt(1),
    creator: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    opponent: '0x0000000000000000000000000000000000000000',
    amount: BigInt('1000000000000000000'), // 1 ETH
    description: 'Bitcoin will reach $100,000 by end of 2024',
    deadline: nowSec + (BigInt(86400) * BigInt(30)), // 30 days from now
    status: BetStatus.OPEN,
    winner: '0x0000000000000000000000000000000000000000',
    options: [],
    betType: BetType.SINGLE,
    name: 'Bitcoin will reach $100,000 by end of 2024',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(30),
    privateBet: false,
  },
  {
    id: BigInt(2),
    betId: BigInt(2),
    creator: '0x8ba1f109551bD432803012645Hac136c9c1495bf',
    opponent: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    amount: BigInt('500000000000000000'), // 0.5 ETH
    description: 'Ethereum will flip Bitcoin in market cap within 6 months',
    deadline: nowSec + (BigInt(86400) * BigInt(180)), // 6 months from now
    status: BetStatus.MATCHED,
    winner: '0x0000000000000000000000000000000000000000',
    options: [],
    betType: BetType.SINGLE,
    name: 'Ethereum will flip Bitcoin in market cap within 6 months',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(180),
    privateBet: false,
  },
  {
    id: BigInt(3),
    betId: BigInt(3),
    creator: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    opponent: '0x1234567890123456789012345678901234567890',
    amount: BigInt('2000000000000000000'), // 2 ETH
    description: 'Tesla stock will reach $300 before Q2 2025',
    deadline: nowSec - BigInt(86400), // 1 day ago (expired)
    status: BetStatus.RESOLVED,
    winner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    options: [],
    betType: BetType.SINGLE,
    name: 'Tesla stock will reach $300 before Q2 2025',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400), // 1 day
    privateBet: false,
  },
  {
    id: BigInt(4),
    betId: BigInt(4),
    creator: '0x9876543210987654321098765432109876543210',
    opponent: '0x0000000000000000000000000000000000000000',
    amount: BigInt('750000000000000000'), // 0.75 ETH
    description: 'Apple will announce a new VR headset at WWDC 2025',
    deadline: nowSec + (BigInt(86400) * BigInt(120)), // 4 months from now
    status: BetStatus.OPEN,
    winner: '0x0000000000000000000000000000000000000000',
    options: [],
    betType: BetType.SINGLE,
    name: 'Apple will announce a new VR headset at WWDC 2025',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(120),
    privateBet: false,
  },
  {
    id: BigInt(5),
    betId: BigInt(5),
    creator: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    opponent: '0x5555555555555555555555555555555555555555',
    amount: BigInt('300000000000000000'), // 0.3 ETH
    description: 'ChatGPT-5 will be released before summer 2025',
    deadline: nowSec + (BigInt(86400) * BigInt(90)), // 3 months from now
    status: BetStatus.MATCHED,
    winner: '0x0000000000000000000000000000000000000000',
    options: [],
    betType: BetType.SINGLE,
    name: 'ChatGPT-5 will be released before summer 2025',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(90),
    privateBet: false,
  },
  {
    id: BigInt(6),
    betId: BigInt(6),
    creator: '0x1111111111111111111111111111111111111111',
    opponent: '0x0000000000000000000000000000000000000000',
    amount: BigInt('1500000000000000000'), // 1.5 ETH
    description: 'SpaceX will successfully land humans on Mars by 2030',
    deadline: nowSec + (BigInt(86400) * BigInt(365) * BigInt(5)), // 5 years from now
    status: BetStatus.OPEN,
    winner: '0x0000000000000000000000000000000000000000',
    options: [],
    betType: BetType.SINGLE,
    name: 'SpaceX will successfully land humans on Mars by 2030',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(365) * BigInt(5),
    privateBet: false,
  },
  {
    id: BigInt(7),
    betId: BigInt(7),
    creator: '0x2222222222222222222222222222222222222222',
    opponent: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    amount: BigInt('800000000000000000'), // 0.8 ETH
    description: 'Netflix will have more than 300M subscribers by end of 2025',
    deadline: nowSec + (BigInt(86400) * BigInt(365)), // 1 year from now
    status: BetStatus.RESOLVED,
    winner: '0x2222222222222222222222222222222222222222',
    options: [],
    betType: BetType.SINGLE,
    name: 'Netflix will have more than 300M subscribers by end of 2025',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(365),
    privateBet: false,
  },
  {
    id: BigInt(8),
    betId: BigInt(8),
    creator: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    opponent: '0x0000000000000000000000000000000000000000',
    amount: BigInt('400000000000000000'), // 0.4 ETH
    description: 'Dogecoin will reach $1 before 2026',
    deadline: nowSec + (BigInt(86400) * BigInt(365) * BigInt(2)), // 2 years from now
    status: BetStatus.OPEN,
    winner: '0x0000000000000000000000000000000000000000',
    options: [],
    betType: BetType.SINGLE,
    name: 'Dogecoin will reach $1 before 2026',
    image: 'https://example.com/bitcoin.png',
    link: 'https://example.com/bitcoin',
    owner: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
    result: BigInt(-1),
    createdAt: nowSec,
    updatedAt: nowSec,
    betDuration: BigInt(86400) * BigInt(365) * BigInt(2),
    privateBet: false,
  }
]

// User statistics based on dummy data
export const dummyUserStats = {
  totalBets: 5,
  activeBets: 3,
  wonBets: 2,
  lostBets: 1,
  totalStaked: BigInt('4800000000000000000'), // 4.8 ETH
  totalWinnings: BigInt('2800000000000000000'), // 2.8 ETH
  winRate: 66.7
}

// Function to get user's bets
export function getUserBets(userAddress: string): Bet[] {
  return dummyBets.filter(
    bet =>
      bet.creator.toLowerCase() === userAddress.toLowerCase() ||
      bet.opponent.toLowerCase() === userAddress.toLowerCase()
  )
}

// Function to get bets by status
export function getBetsByStatus(status?: BetStatus): Bet[] {
  if (status === undefined) return dummyBets
  return dummyBets.filter(bet => bet.status === status)
}

// Function to get open bets (available to join)
export function getOpenBets(): Bet[] {
  return dummyBets.filter(bet => bet.status === BetStatus.OPEN)
}

// Function to get user's bet statistics
export function getUserStats(userAddress: string) {
  const userBets = getUserBets(userAddress)
  const wonBets = userBets.filter(bet =>
    bet.status === BetStatus.RESOLVED &&
    bet.winner.toLowerCase() === userAddress.toLowerCase()
  )
  const lostBets = userBets.filter(bet =>
    bet.status === BetStatus.RESOLVED &&
    bet.winner.toLowerCase() !== userAddress.toLowerCase() &&
    bet.winner !== '0x0000000000000000000000000000000000000000'
  )
  const activeBets = userBets.filter(bet =>
    bet.status === BetStatus.OPEN || bet.status === BetStatus.MATCHED
  )

  const totalStaked = userBets.reduce((sum, bet) => {
    if (bet.creator.toLowerCase() === userAddress.toLowerCase()) {
      return sum + bet.amount
    }
    return sum
  }, BigInt(0))

  const totalWinnings = wonBets.reduce((sum, bet) => sum + bet.amount * BigInt(2), BigInt(0))
  const winRate = wonBets.length > 0 ? (wonBets.length / (wonBets.length + lostBets.length)) * 100 : 0

  return {
    totalBets: userBets.length,
    activeBets: activeBets.length,
    wonBets: wonBets.length,
    lostBets: lostBets.length,
    totalStaked,
    totalWinnings,
    winRate: Math.round(winRate * 100) / 100
  }
}