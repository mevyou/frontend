"use client";

import Image from "next/image";
import Link from "next/link";
import { AppIcons } from "@/lib/appIcons";
import { AppImages } from "@/lib/appImages";
import { useAccount, useBalance } from "wagmi";
import { useAuth } from "@/hooks/useAuth";
import { formatAddress } from "@/lib/utils";
import { useMemo, useState } from "react";

type Tab = 'tokens' | 'nfts' | 'history';

export function WalletPage() {
  const { address, isConnected } = useAccount();
  const { profile } = useAuth();
  const displayName = profile?.name || (address ? formatAddress(address) : "Guest");
  const avatar = profile?.image || AppImages.defaultAvatar;
  const { data: nativeBalance } = useBalance({ address });
  const [activeTab, setActiveTab] = useState<Tab>('tokens');

  const txRows = useMemo(() => ([
    { time: '1 min ago', title: 'Bet placed', desc: 'BTC above $105k throughout August?', status: 'Pending', token: 'USDT', icon: AppIcons.usdt, amount: '-200.04 USDT' },
    { time: '2 hrs ago', title: 'Bet won', desc: 'Will strategy(MSTR) sell any BTC by end of 2025', status: 'Completed', token: 'BNB', icon: AppIcons.bnb, amount: '+3.23 BNB' },
    { time: '21/09/2025 10:40pm', title: 'Deposit', desc: 'Bet placed', status: 'Completed', token: 'USDC', icon: AppIcons.usdc, amount: '+34.62 USDC' },
    { time: '21/09/2025 10:40pm', title: 'Withdrawal', desc: 'Bet placed', status: 'Completed', token: 'ETH', icon: AppIcons.eth, amount: '-0.82 ETH' },
  ]), []);
  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#121214' }}>
      {/* Top summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#1F1F23] bg-[#272729] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? 'Connected to Metamask' : 'Disconnected'}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg text-white text-sm border border-cyan-400/25 bg-cyan-400/10 inline-flex items-center gap-2">
                <Image src={AppIcons.deposit} alt="deposit" width={16} height={16} />
                <span>Deposit</span>
              </button>
              <button className="px-3 py-2 rounded-lg text-white text-sm border border-neutral-700 bg-neutral-800 inline-flex items-center gap-2">
                <Image src={AppIcons.withdraw} alt="withdraw" width={16} height={16} />
                <span>Withdraw</span>
              </button>
            </div>
          </div>
          <div className="text-gray-400 text-sm">Available balance</div>
          <div className="text-4xl font-extrabold text-white">{nativeBalance ? `~ ${Number(nativeBalance.formatted).toFixed(4)} ${nativeBalance.symbol}` : '~ 0.0000'}</div>
          <div className="mt-10 flex items-center gap-3 rounded-[28px] bg-black/40 border border-[#1F1F23] p-3">
            <Image src={avatar} alt="avatar" width={40} height={40} className="rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="text-white text-base font-semibold truncate">{displayName}</div>
              <div className="text-gray-400 text-xs flex items-center gap-2">
                {address ? formatAddress(address) : '—'}
                {address && (
                  <button
                    onClick={() => navigator.clipboard.writeText(address)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Copy address"
                  >
                    <Image src={AppIcons.copy} alt="copy" width={14} height={14} />
                  </button>
                )}
              </div>
            </div>
            <Link href="/profile" className="text-white/80 hover:text-white text-base inline-flex items-center gap-2 mr-4">
              <Image src={AppIcons.profile} alt="profile" width={16} height={16} className="w-6 h-6" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-2xl border border-[#1F1F23] bg-[#272729] p-4">
            <div className="text-gray-400 text-sm">Locked in bets</div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-3xl font-extrabold text-white">~ $3240.00</div>
              <button className="px-3 py-2 rounded-lg text-white text-sm border border-neutral-700 bg-neutral-800">Unstake</button>
            </div>
          </div>
          <div className="rounded-2xl border border-[#1F1F23] bg-[#272729] p-4">
            <div className="text-gray-400 text-sm">Pending Winnings</div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-3xl font-extrabold text-white">~ $9353.00</div>
              <button className="px-3 py-2 rounded-lg text-white text-sm border border-neutral-700 bg-neutral-800">My Bets</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tokens table */}
      <div className="rounded-3xl border border-[#1F1F23] bg-[#101011]">
        <div className="px-2 sm:px-4 py-3 rounded-2xl border-b border-[#1F1F23] bg-[#252529]">
          <div className="relative w-full max-w-xl">
            <div className="bg-black/80 rounded-lg h-10 w-[55%] flex items-center px-1 gap-1">
              <button
                onClick={() => setActiveTab('tokens')}
                className={`h-8 px-4 rounded-lg text-sm transition-colors ${activeTab==='tokens' ? 'text-white bg-[#272729]' : 'text-white/80 hover:text-white'}`}
              >
                Tokens
              </button>
              <button
                onClick={() => setActiveTab('nfts')}
                className={`h-8 px-4 rounded-full text-sm transition-colors ${activeTab==='nfts' ? 'text-white bg-[#272729]' : 'text-white/80 hover:text-white'}`}
              >
                NFTs
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`h-8 px-4 rounded-full text-sm transition-colors ${activeTab==='history' ? 'text-white bg-[#272729]' : 'text-white/80 hover:text-white'}`}
              >
                Transaction history
              </button>
            </div>
          </div>
        </div>
        {activeTab === 'tokens' && (
          <>
            <div className="grid grid-cols-12 px-4 py-3 text-gray-400 text-xs border-b border-[#1F1F23]">
              <div className="col-span-5">Token</div>
              <div className="col-span-3">Chain</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2 text-right">Value</div>
            </div>
            {[{ name: 'USDT', chain: 'Ethereum', amount: '200.04 USDT', value: '$200', icon: AppIcons.usdt }, { name: 'BNB', chain: 'Binance smart chain', amount: '3.23 BNB', value: '$4160.83', icon: AppIcons.bnb }, { name: 'USDC', chain: 'Solana', amount: '34.62 USDC', value: '$34.83', icon: AppIcons.usdc }, { name: 'ETH', chain: 'Ethereum', amount: '0.82 ETH', value: '$3694.15', icon: AppIcons.eth }].map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 px-4 py-4 border-b border-[#1F1F23] last:border-b-0 text-white items-center">
                <div className="col-span-5 flex items-center gap-3">
                  <Image src={row.icon} alt={row.name} width={24} height={24} />
                  <span>{row.name}</span>
                </div>
                <div className="col-span-3 text-gray-300">{row.chain}</div>
                <div className="col-span-2 text-gray-300">{row.amount}</div>
                <div className="col-span-2 text-right">{row.value}</div>
              </div>
            ))}
          </>
        )}
        {activeTab === 'nfts' && (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[AppImages.bitcoinGold, AppImages.judgePills, AppImages.casinoChip, AppImages.goldenCoins, AppImages.rocket].map((src, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden border border-[#1F1F23] bg-[#141418] aspect-square relative">
                <Image src={src} alt={`NFT ${idx+1}`} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'history' && (
          <div className="divide-y divide-[#1F1F23]">
            <div className="grid grid-cols-12 px-4 py-3 text-gray-400 text-xs border-b border-[#1F1F23]">
              <div className="col-span-2">Date</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Token</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            {txRows.map((r, idx) => (
              <div key={idx} className="grid grid-cols-12 px-4 py-4 items-center text-white">
                <div className="col-span-2 text-gray-300">{r.time}</div>
                <div className="col-span-5">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-gray-400 text-xs">{r.desc}</div>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-md text-xs ${r.status==='Completed' ? 'bg-green-500/10 text-green-400' : r.status==='Failed' ? 'bg-rose-500/10 text-rose-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{r.status}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Image src={r.icon} alt={r.token} width={24} height={24} />
                  <span className={`${r.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{r.amount}</span>
                </div>
                <div className="col-span-1 text-right text-cyan-400 cursor-pointer">View</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


