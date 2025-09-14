"use client";


import { Bet } from "@/lib/contracts/BettingContract";
import { AppIcons, AppImages } from "@/lib/assets";
import Image from "next/image";
import {
  formatWeiToEther,
  getTimeUntilDeadline,
  truncateText,
} from "@/lib/utils";

interface BettingCardProps {
  bet: Bet;
  onUpdateAction?: () => void;
}

export function BettingCard({ bet }: BettingCardProps) {
  return (
    <div 
      className="w-full transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        display: 'flex',
        padding: '2px 2px 12px 2px',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        borderRadius: '16px',
        background: '#242429',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.25)'
      }}
    >
      {/* Main Card Content */}
      <div className="self-stretch bg-zinc-900 rounded-2xl flex flex-col justify-start items-start gap-3 overflow-hidden">
        {/* Header Section */}
        <div className="self-stretch h-36 relative rounded-tl-lg rounded-tr-lg flex flex-col justify-center items-center overflow-hidden" style={{ background: '#121214' }}>
          {/* Gradient Circle */}
          <div className="w-12 h-12 bg-neutral-800 rounded-[129.25px] inline-flex justify-start items-center mb-2">
            <div className="w-12 h-12 relative">
              <div className={`w-12 h-12 left-0 top-0 absolute rounded-full ${
                Number(bet.id) % 4 === 0 ? 'bg-gradient-to-b from-indigo-900 to-red-600' :
                Number(bet.id) % 4 === 1 ? 'bg-gradient-to-b from-purple-600 to-pink-500' :
                Number(bet.id) % 4 === 2 ? 'bg-gradient-to-b from-blue-600 to-cyan-500' :
                'bg-gradient-to-b from-green-600 to-emerald-500'
              }`} />
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
          
          {/* All Tokens Badge */}
          <div className="pl-1 pr-2 py-1 rounded-[99px] shadow-[0px_1px_4px_-1px_rgba(32,32,32,0.02)] inline-flex justify-start items-center gap-2" style={{ background: '#121214', border: '0.5px solid #242429' }}>
            <div className="flex justify-start items-center gap-1">
              <Image src={AppIcons.coins} alt="coins" width={16} height={16} className="text-gray-400" />
              <div className="text-center justify-center text-gray-400 text-xs font-normal font-['Nunito_Sans'] leading-none">All Tokens</div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="self-stretch px-3 flex flex-col justify-start items-start gap-3">
          {/* Question Title */}
          <div className="self-stretch h-12 inline-flex justify-start items-center gap-2.5">
            <div className="flex-1 justify-center text-white text-base font-extrabold font-['Nunito_Sans'] leading-normal">
              {truncateText(bet.description, 80)}
            </div>
          </div>
          
          {/* Progress and Buttons */}
          <div className="self-stretch pb-3 flex flex-col justify-start items-start gap-2">
            {/* Progress Bar */}
            <div className="self-stretch inline-flex justify-start items-center gap-1">
              <div className="text-center justify-center text-white text-sm font-semibold font-['Nunito_Sans'] capitalize leading-none tracking-tight">57%</div>
              <div className="flex-1 h-2 relative bg-red-400 rounded-[99px] overflow-hidden">
                <div className="w-36 h-2 left-0 top-0 absolute bg-green-400" />
              </div>
              <div className="text-center justify-center text-white text-sm font-semibold font-['Nunito_Sans'] capitalize leading-none tracking-tight">43%</div>
            </div>
            
            {/* Yes/No Buttons */}
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="flex-1 h-10 p-2.5 bg-green-400/10 rounded-lg border border-green-300 flex justify-center items-center gap-1 overflow-hidden hover:bg-green-400/20 hover:border-green-400 transition-all duration-200 cursor-pointer">
                <div className="text-center justify-center text-green-500 text-sm font-semibold font-['Inter'] capitalize leading-none tracking-tight">Yes</div>
              </div>
              <div className="flex-1 h-10 p-2.5 bg-red-400/10 rounded-lg border border-red-300 flex justify-center items-center gap-1 overflow-hidden hover:bg-red-400/20 hover:border-red-400 transition-all duration-200 cursor-pointer">
                <div className="text-center justify-center text-red-500 text-sm font-semibold font-['Inter'] capitalize leading-none tracking-tight">No</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="self-stretch px-3 inline-flex justify-between items-center">
        {/* Participants */}
        <div className="p-0.5 bg-zinc-900 rounded-[99px] flex justify-end items-center">
          <Image src={AppImages.img} alt="user" width={16} height={16} className="rounded-full border-[1.40px] border-zinc-900" />
          <Image src={AppImages.img} alt="user" width={16} height={16} className="rounded-full border-[1.40px] border-zinc-900" />
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
              ${formatWeiToEther(bet.amount)}k
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