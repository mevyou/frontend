'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Abi, parseEther } from 'viem'
import { Bet } from '@/lib/contracts/BettingContract'
import { hubAddress, hubABI } from '../contract/contract'
import { toast } from 'react-hot-toast'

export function useCreateBet() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const createBet = async (description: string, amount: string, deadline: number) => {
    try {
      const deadlineTimestamp = BigInt(Math.floor(deadline / 1000))
      const amountWei = parseEther(amount)

      writeContract({
        address: hubAddress as `0x${string}`,
        abi: hubABI as Abi,
        functionName: 'createBet',
        args: [description, amountWei, deadlineTimestamp],
        value: amountWei,
      })
    } catch (error) {
      console.error('Error creating bet:', error)
      toast.error('Failed to create bet')
    }
  }

  return {
    createBet,
    isPending: isPending || isConfirming,
    isSuccess,
    hash
  }
}

export function useJoinBet() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const joinBet = async (betId: bigint, amount: bigint) => {
    try {
      writeContract({
        address: hubAddress as `0x${string}`,
        abi: hubABI as Abi,
        functionName: 'joinBet',
        args: [betId],
        value: amount,
      })
    } catch (error) {
      console.error('Error joining bet:', error)
      toast.error('Failed to join bet')
    }
  }

  return {
    joinBet,
    isPending: isPending || isConfirming,
    isSuccess,
    hash
  }
}

export function useResolveBet() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const resolveBet = async (betId: bigint, winner: string) => {
    try {
      writeContract({
        address: hubAddress as `0x${string}`,
        abi: hubABI as Abi,
        functionName: 'resolveBet',
        args: [betId, winner as `0x${string}`],
      })
    } catch (error) {
      console.error('Error resolving bet:', error)
      toast.error('Failed to resolve bet')
    }
  }

  return {
    resolveBet,
    isPending: isPending || isConfirming,
    isSuccess,
    hash
  }
}

export function useGetBet(betId: bigint) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: hubAddress as `0x${string}`,
    abi: hubABI as Abi,
    functionName: 'getBet',
    args: [betId],
  })

  return {
    bet: data as Bet | undefined,
    isLoading,
    error,
    refetch
  }
}

export function useGetAllBets() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: hubAddress as `0x${string}`,
    abi: hubABI as Abi,
    functionName: 'getAllBets',
  })

  return {
    bets: (data as Bet[]) || [],
    isLoading,
    error,
    refetch
  }
}

export function useCancelBet() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const cancelBet = async (betId: bigint) => {
    try {
      writeContract({
        address: hubAddress as `0x${string}`,
        abi: hubABI as Abi,
        functionName: 'cancelBet',
        args: [betId],
      })
    } catch (error) {
      console.error('Error cancelling bet:', error)
      toast.error('Failed to cancel bet')
    }
  }

  return {
    cancelBet,
    isPending: isPending || isConfirming,
    isSuccess,
    hash
  }
}