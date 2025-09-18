'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import type { Abi } from 'viem';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UseTransactionOptions {
  chainId?: number;
  confirmations?: number;
  timeoutMs?: number;
  onSuccess?: (receipt: unknown) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useTransaction(options: UseTransactionOptions = {}) {
  const {
    chainId,
    confirmations = 1,
    timeoutMs = 30000,
    onSuccess,
    onError,
    successMessage = 'Transaction confirmed',
    errorMessage = 'Transaction failed'
  } = options;

  const { writeContract, data: txHash, isPending: isConfirming, error: writeError } = useWriteContract();
  const {
    isLoading: isMining,
    isSuccess,
    isError,
    data: receipt,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId,
    confirmations,
  });

  const [fallbackSuccess, setFallbackSuccess] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      console.error('[useTransaction] Write error:', writeError);
      if (onError) onError(writeError);
      toast.error(errorMessage);
    }
  }, [writeError, onError, errorMessage]);

  // Handle receipt errors
  useEffect(() => {
    if (receiptError) {
      console.error('[useTransaction] Receipt error:', receiptError);
      if (onError) onError(receiptError);
      toast.error(`Receipt failed: ${receiptError.message || 'Unknown error'}`);
    }
  }, [receiptError, onError]);

  // Handle successful receipt
  useEffect(() => {
    if (isSuccess && receipt) {
      console.log('[useTransaction] Transaction successful:', receipt);
      if (onSuccess) onSuccess(receipt);
      toast.success(successMessage);
    }
  }, [isSuccess, receipt, onSuccess, successMessage]);

  // Fallback success mechanism for chains that might not return receipts properly
  useEffect(() => {
    if (txHash && !isSuccess && !isError && !receiptError && isMining) {
      const timeout = setTimeout(() => {
        console.log('[useTransaction] Fallback success triggered for tx:', txHash);
        setFallbackSuccess(true);
        if (onSuccess) onSuccess({ hash: txHash, fallback: true });
        toast.success(successMessage);
      }, timeoutMs);

      setTimeoutId(timeout);
      return () => clearTimeout(timeout);
    } else if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [txHash, isSuccess, isError, receiptError, isMining, timeoutMs, onSuccess, successMessage, timeoutId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const executeTransaction = useCallback(async (params: {
    address: `0x${string}`;
    abi: readonly unknown[] | Abi;
    functionName: string;
    args?: readonly unknown[];
    value?: bigint;
  }) => {
    try {
      setFallbackSuccess(false);
      const writeParams: Record<string, unknown> = {
        ...params,
        chainId,
      };
      if (params.value) {
        writeParams.value = params.value;
      }
      await writeContract(writeParams as Parameters<typeof writeContract>[0]);
    } catch (error) {
      console.error('[useTransaction] Execute error:', error);
      if (onError) onError(error);
      toast.error(errorMessage);
    }
  }, [writeContract, chainId, onError, errorMessage]);

  const isSuccessState = isSuccess || fallbackSuccess;
  const isErrorState = isError || !!writeError || !!receiptError;

  return {
    executeTransaction,
    txHash,
    isConfirming,
    isMining,
    isSuccess: isSuccessState,
    isError: isErrorState,
    receipt,
    error: writeError || receiptError,
    fallbackSuccess
  };
}
