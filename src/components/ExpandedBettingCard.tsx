"use client";

import { useEffect, useState } from "react";
import { Bet, ContractBetOption } from "@/lib/contracts/BettingContract";
import { AppIcons, AppImages } from "@/lib/assets";
import Image from "next/image";
import {
  formatWeiToEther,
  getTimeUntilDeadline,
} from "@/lib/utils";
import { getBetFromContract, type ContractBet, type Options as UiOption } from "@/lib/contracts/BettingContract";
import TxButton from "./TxButton";
import { gameABI, gameAddress } from "@/contract/contract";
import { Abi, parseEther } from "viem";

interface ExpandedBettingCardProps {
  bet: Bet;
  onBackAction: () => void;
  onUpdateAction?: () => void;
}

export function ExpandedBettingCard({ bet, onBackAction }: ExpandedBettingCardProps) {
  const [onchainBet, setOnchainBet] = useState<ContractBet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stakeAmounts, setStakeAmounts] = useState<Record<string, string>>({});
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        // const idBig = BigInt(bet.betId);
        const data = await getBetFromContract(BigInt(1));
        setOnchainBet(data);
        console.log('onchainBet', onchainBet);
      } catch (e) {
        console.error('Failed to load bet from contract:', e);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [bet.betId]);

  // Fetch ETH/USD price
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setIsPriceLoading(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthUsd(data.ethereum.usd);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      } finally {
        setIsPriceLoading(false);
      }
    };
    fetchEthPrice();
  }, []);


  return (
    <div className="self-stretch px-0.5 pt-0.5 pb-3 bg-neutral-800 rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-center gap-2">
      <div className="self-stretch bg-zinc-900 rounded-2xl flex flex-col justify-start items-start gap-3 overflow-hidden">
        {/* Header Section */}
        <div className="self-stretch h-36 relative rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-center overflow-hidden" style={{ background: '#121214' }}>
          {/* Back Button */}
          <div className="absolute top-2 left-2 z-10">
            <button
              onClick={onBackAction}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Gradient Circle */}
          <div className="w-12 h-12 bg-neutral-800 rounded-[129.25px] inline-flex justify-start items-center mb-2">
            <div className="w-12 h-12 relative">
              <div className="w-12 h-12 left-0 top-0 absolute rounded-full bg-gradient-to-b from-purple-600 to-pink-500" />
              <div className="w-6 h-6 left-[12px] top-[12px] absolute flex items-center justify-center">
                <Image src={AppIcons.home1} alt="icon" width={16} height={16} className="text-white" />
              </div>
            </div>
          </div>

          {/* In-House Created Label */}
          <div className="inline-flex justify-center items-center gap-1 mb-1">
            <Image src={AppIcons.checkmark} alt="checkmark" width={16} height={16} className="text-cyan-400" />
            <div className="justify-center text-gray-400 text-sm font-medium font-['Inter'] leading-tight">In-House created</div>
          </div>

          {/* USDT Badge */}
          <div className="pl-1 pr-2 py-1 rounded-[99px] shadow-[0px_1px_4px_-1px_rgba(32,32,32,0.02)] inline-flex justify-start items-center gap-2" style={{ background: '#121214', border: '0.5px solid #242429' }}>
            <div className="flex justify-start items-center gap-1">
              <Image src={AppIcons.usdt} alt="usdt" width={16} height={16} className="text-gray-400" />
              <div className="text-center justify-center text-gray-400 text-xs font-normal font-['Nunito_Sans'] leading-none">USDT</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="self-stretch px-3 flex flex-col justify-start items-start gap-3">
          {/* Question Title */}
          <div className="self-stretch h-12 inline-flex justify-start items-center gap-2.5 flex-col">
            <div className="flex-1 justify-center text-white text-base font-extrabold font-['Nunito_Sans'] leading-normal w-full">
              {onchainBet?.name || bet.name}
            </div>
            <div className="flex-1 justify-center text-base font-extrabold font-['Nunito_Sans'] w-full text-left text-gray-400">
              {onchainBet?.description || bet.description}
            </div>
          </div>

          {/* Scrollable Betting Options */}
          <div className="self-stretch pb-3 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="text-gray-400 text-sm mb-2">Options</div>
              <div className="self-stretch flex flex-col justify-center items-start gap-2 max-h-56 overflow-y-auto pt-2 mt-2">
                {isLoading ? (
                  <div className="text-gray-400 text-sm">Loading bet details...</div>
                ) : (() => {
                  const opts: ContractBetOption[] = (onchainBet && !isLoading)
                    ? (onchainBet.options)
                    : (bet.options as UiOption[] || []);
                  return Array.isArray(opts) && opts.length > 0 ? (
                    opts.map((opt, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-neutral-700/50 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{opt.option}</span>
                          <span className="text-gray-400 text-xs">Staked: {String(onchainBet?.options[idx]?.totalStaked ?? 0)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col gap-1">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Amount (USD)"
                              className="w-32 px-2 py-1 rounded bg-neutral-800 text-white text-xs border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                              value={stakeAmounts[`${bet.id}-${idx}`] ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                setStakeAmounts((prev) => ({ ...prev, [`${bet.id}-${idx}`]: v }));
                              }}
                            />
                            <div className="text-gray-400 text-[10px] w-32">
                              {(() => {
                                const usdStr = stakeAmounts[`${bet.id}-${idx}`];
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
        </div>
      </div>

      {/* Footer Section */}
      <div className="self-stretch px-3 inline-flex justify-between items-center">
        {/* Participants */}
        <div className="p-0.5 bg-zinc-900 rounded-[99px] flex justify-end items-center">
          <Image src={AppImages.img1} alt="user" width={16} height={16} className="rounded-full border-[1.40px] border-zinc-900" />
          <Image src={AppImages.img2} alt="user" width={16} height={16} className="rounded-full border-[1.40px] border-zinc-900" />
          <div className="h-4 pl-1.5 pr-1 inline-flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch text-center justify-center text-gray-400 text-[10px] font-medium font-['Nunito_Sans'] leading-none">+104</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-start items-center gap-2">
          {/* Amount */}
          <div className="flex justify-start items-center gap-[3px]">
            <Image src={AppIcons.eth} alt="eth" width={16} height={16} className="text-blue-600" />
            <div className="text-center justify-center text-gray-400 text-xs font-medium font-['Nunito_Sans'] capitalize leading-3 tracking-tight">
              {/* ${formatWeiToEther(bet.amount)}k */}
              {onchainBet?.options.reduce((sum, o) => sum + (o.totalStaked ?? BigInt(0)), BigInt(0)).toString()}k
            </div>
          </div>

          {/* Divider */}
          <div className="w-[0.50px] h-2.5 relative bg-gray-400/25" />

          {/* Deadline */}
          <div className="flex justify-start items-start">
            <div className="flex justify-start items-center gap-1">
              <Image src={AppIcons.hourglass} alt="hourglass" width={12} height={12} className="text-gray-400" />
              <div className="text-center justify-center text-gray-400 text-xs font-medium font-['Nunito_Sans'] capitalize leading-3 tracking-tight">
                {getTimeUntilDeadline(bet.deadline)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}