import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatEther, parseEther } from "viem"
import { format, formatDistanceToNow, isPast } from "date-fns"
import { BetStatus } from "./contracts/BettingContract"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeiToEther(wei: bigint): string {
  const ether = formatEther(wei)
  // Remove trailing zeros and unnecessary decimal places
  return parseFloat(ether).toString()
}

export function parseEtherToWei(ether: string): bigint {
  return parseEther(ether)
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return format(date, 'MMM dd, yyyy HH:mm')
}

export function getTimeUntilDeadline(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  if (isPast(date)) {
    return 'Expired'
  }
  return formatDistanceToNow(date, { addSuffix: true })
}

export function getBetStatusText(status: BetStatus): string {
  switch (status) {
    case BetStatus.OPEN:
      return 'Open'
    case BetStatus.MATCHED:
      return 'Matched'
    case BetStatus.RESOLVED:
      return 'Resolved'
    case BetStatus.CANCELLED:
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}

export function getBetStatusColor(status: BetStatus): string {
  switch (status) {
    case BetStatus.OPEN:
      return 'text-green-400 bg-green-400/10'
    case BetStatus.MATCHED:
      return 'text-yellow-400 bg-yellow-400/10'
    case BetStatus.RESOLVED:
      return 'text-blue-400 bg-blue-400/10'
    case BetStatus.CANCELLED:
      return 'text-red-400 bg-red-400/10'
    default:
      return 'text-gray-400 bg-gray-400/10'
  }
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}