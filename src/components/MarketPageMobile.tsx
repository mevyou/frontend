"use client";

import { AppIcons } from "@/lib/appIcons";
import { AppImages } from "@/lib/appImages";
import Image from "next/image";

export function MarketPageMobile() {
  return (
    <div className="w-80 pt-2 flex flex-col justify-start items-start gap-6">
      <div className="w-full flex flex-col justify-start items-start gap-4">
        <div className="w-full flex justify-between items-center">
          <div className="text-white text-base font-semibold font-['Nunito_Sans'] leading-7">Topics</div>
          <div className="pl-4 pr-5 py-2 bg-cyan-400/5 rounded-lg border border-cyan-400/50 flex justify-center items-center gap-1 overflow-hidden">
            <div className="w-5 h-5 relative">
              <div className="w-3.5 h-3.5 left-[3.33px] top-[3.33px] absolute border-2 border-white" />
            </div>
            <div className="text-center text-white text-sm font-semibold font-['Nunito_Sans'] capitalize leading-none">Create bet</div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-start items-start gap-3">
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="p-[1.71px] rounded-full border border-cyan-400/50 flex justify-start items-center gap-1">
              <div className="w-24 h-24 p-7 relative bg-gradient-to-br from-cyan-200 to-lime-300 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <div className="w-14 h-14 left-[18.86px] top-[18.86px] absolute">
                  <Image className="w-14 h-14 left-0 top-0 absolute" src={AppImages.goldenCoins} alt="Sports" width={55} height={55} />
                </div>
              </div>
            </div>
            <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-none">Sports</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="p-[1.71px] rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-24 h-24 p-7 relative bg-gradient-to-br from-slate-400 to-rose-300 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <div className="w-14 h-14 left-[18.86px] top-[18.86px] absolute">
                  <Image className="w-14 h-14 left-[0.43px] top-[0.43px] absolute" src={AppImages.bitcoinGold} alt="Crypto" width={55} height={54} />
                </div>
              </div>
            </div>
            <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-none">Crypto</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="p-[1.71px] rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-24 h-24 p-7 relative bg-gradient-to-br from-cyan-400 to-lime-300 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <Image className="w-14 h-14 left-[18.86px] top-[18.86px] absolute" src={AppImages.judgePills} alt="Politics" width={55} height={55} />
              </div>
            </div>
            <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-none">Politics</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="p-[1.71px] rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-24 h-24 p-7 relative bg-gradient-to-br from-rose-300 to-orange-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <Image className="w-9 h-14 left-[28.36px] top-[18.86px] absolute" src={AppImages.casinoChip} alt="Gaming" width={36} height={55} />
              </div>
            </div>
            <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-none">Gaming</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="p-[1.71px] rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-24 h-24 p-7 relative bg-gradient-to-br from-rose-300 to-orange-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <Image className="w-9 h-14 left-[28.36px] top-[18.86px] absolute" src={AppIcons.dollarCoin} alt="Economy" width={36} height={55} />
              </div>
            </div>
            <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-none">Economy</div>
          </div>
        </div>
      </div>
      
      <div className="w-full flex flex-col justify-start items-start gap-3">
        <div className="w-full flex justify-start items-center gap-2">
          <div className="flex-1 px-4 py-2 bg-neutral-800 rounded-lg shadow-[0px_1px_4px_-1px_rgba(32,32,32,0.02)] flex justify-start items-center gap-2">
            <div className="w-4 h-4 relative">
              <div className="w-[2.67px] h-[2.67px] left-[11.33px] top-[11.33px] absolute bg-gray-400/60" />
              <div className="w-2.5 h-2.5 left-[2px] top-[2px] absolute bg-gray-400/60" />
            </div>
            <div className="flex-1 text-gray-400/60 text-base font-normal font-['Nunito_Sans'] leading-normal">Search</div>
          </div>
          <div className="px-4 py-2 bg-neutral-800 rounded-xl flex justify-start items-center gap-1">
            <div className="w-6 h-6 relative">
              <div className="w-0 h-[3px] left-[7px] top-[18px] absolute bg-gray-400" />
              <div className="w-0 h-1.5 left-[17px] top-[15px] absolute bg-gray-400" />
              <div className="w-0 h-[3px] left-[17px] top-[3px] absolute bg-gray-400" />
              <div className="w-0 h-1.5 left-[7px] top-[3px] absolute bg-gray-400" />
              <div className="w-1.5 h-1.5 left-[4px] top-[12px] absolute bg-gray-400" />
              <div className="w-1.5 h-1.5 left-[14px] top-[6px] absolute bg-gray-400" />
            </div>
            <div className="text-white text-base font-semibold font-['Nunito_Sans'] leading-normal">Filter</div>
          </div>
        </div>
        
        <div className="w-full flex flex-col justify-center items-start gap-2">
          {/* Betting card 1 */}
          <div className="w-full px-0.5 pt-0.5 pb-3 bg-neutral-800 rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center gap-2">
            <div className="w-full bg-zinc-900 rounded-2xl flex flex-col justify-start items-start gap-3 overflow-hidden">
              <div className="w-full h-36 relative bg-neutral-900 rounded-tl-lg rounded-tr-lg flex flex-col justify-start items-start overflow-hidden">
                <div className="w-full flex-1 border-b flex justify-start items-center gap-2.5">
                  <div className="flex-1" />
                </div>
                <div className="left-[102px] top-[26px] absolute flex flex-col justify-start items-center gap-1">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex justify-start items-center">
                    <div className="w-12 h-12 relative">
                      <div className="w-12 h-12 left-0 top-0 absolute bg-gradient-to-b from-indigo-900 to-red-600 rounded-full" />
                      <div className="w-6 h-6 left-[11.50px] top-[12px] absolute">
                        <div className="w-5 h-2 left-[2px] top-[2.50px] absolute bg-white" />
                        <div className="w-4 h-4 left-[3.50px] top-[5px] absolute bg-white" />
                        <div className="w-px h-px left-[9.50px] top-[11.50px] absolute bg-white" />
                        <div className="w-px h-px left-[13.50px] top-[11.50px] absolute bg-white" />
                        <div className="w-px h-px left-[9.50px] top-[15.50px] absolute bg-white" />
                        <div className="w-px h-px left-[13.50px] top-[15.50px] absolute bg-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <div className="w-4 h-4 relative">
                      <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute bg-cyan-400 border border-cyan-400" />
                      <div className="w-1 h-[3.33px] left-[6px] top-[6.33px] absolute bg-neutral-900" />
                    </div>
                    <div className="text-gray-400 text-sm font-medium font-['Inter'] leading-tight">In-House created</div>
                  </div>
                  <div className="pl-1 pr-2 py-1 bg-neutral-900 rounded-full shadow-[0px_1px_4px_-1px_rgba(32,32,32,0.02)] border border-neutral-800 flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <div className="w-4 h-4 relative">
                        <div className="w-2.5 h-2.5 left-[4px] top-[1.33px] absolute bg-gray-400" />
                        <div className="w-2 h-2 left-[1.33px] top-[7.22px] absolute bg-gray-400" />
                      </div>
                      <div className="text-gray-400 text-xs font-normal font-['Nunito_Sans'] leading-none">All Tokens</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full px-3 flex flex-col justify-start items-start gap-3">
                <div className="w-full h-12 flex justify-start items-center gap-2.5">
                  <div className="flex-1 text-white text-base font-extrabold font-['Nunito_Sans'] leading-normal">Will Oscar Piastri win the F1 Drivers Championship 2025?</div>
                </div>
                
                <div className="w-full pb-3 flex flex-col justify-start items-start gap-2">
                  <div className="w-full flex justify-start items-center gap-1">
                    <div className="text-white text-sm font-semibold font-['Nunito_Sans'] capitalize leading-none tracking-tight">57%</div>
                    <div className="flex-1 h-2 relative bg-red-400 rounded-full overflow-hidden">
                      <div className="w-36 h-2 left-0 top-0 absolute bg-green-400" />
                    </div>
                    <div className="text-white text-sm font-semibold font-['Nunito_Sans'] capitalize leading-none tracking-tight">43%</div>
                  </div>
                  
                  <div className="w-full flex justify-start items-center gap-2">
                    <div className="flex-1 h-10 p-2.5 bg-green-400/10 rounded-lg border border-green-300 flex justify-center items-center gap-1 overflow-hidden">
                      <div className="text-green-500 text-sm font-semibold font-['Inter'] capitalize leading-none tracking-tight">Yes</div>
                    </div>
                    <div className="flex-1 h-10 p-2.5 bg-red-400/10 rounded-lg border border-red-300 flex justify-center items-center gap-1 overflow-hidden">
                      <div className="text-red-500 text-sm font-semibold font-['Inter'] capitalize leading-none tracking-tight">No</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full px-3 flex justify-between items-center">
              <div className="p-0.5 bg-zinc-900 rounded-full flex justify-end items-center">
                <Image className="w-4 h-4 rounded-full border border-zinc-900" src={AppImages.img1} alt="User 1" width={16} height={16} />
                <Image className="w-4 h-4 rounded-full border border-zinc-900" src={AppImages.img2} alt="User 2" width={16} height={16} />
                <div className="h-4 pl-1.5 pr-1 flex flex-col justify-center items-center gap-2.5">
                  <div className="text-gray-400 text-[10px] font-medium font-['Nunito_Sans'] leading-none">+104</div>
                </div>
              </div>
              
              <div className="flex justify-start items-center gap-2">
                <div className="flex justify-start items-center gap-[3px]">
                  <div className="w-4 h-4 relative overflow-hidden">
                    <div className="w-4 h-4 left-0 top-0 absolute bg-blue-600" />
                    <div className="w-1 h-2 left-[5.93px] top-[4.33px] absolute bg-white" />
                    <div className="w-2.5 h-2.5 left-[2.50px] top-[2.75px] absolute bg-white" />
                  </div>
                  <div className="text-gray-400 text-xs font-medium font-['Nunito_Sans'] capitalize leading-3 tracking-tight">$9.01k</div>
                </div>
                <div className="w-[0.50px] h-2.5 relative bg-gray-400/25" />
                <div className="flex justify-start items-start">
                  <div className="flex justify-start items-center gap-1">
                    <div className="w-3 h-3 relative">
                      <div className="w-2 h-0 left-[2px] top-[1.50px] absolute border border-gray-400" />
                      <div className="w-1.5 h-1 left-[2.75px] top-[1.50px] absolute border border-gray-400" />
                      <div className="w-1.5 h-1 left-[2.75px] top-[6px] absolute border border-gray-400" />
                      <div className="w-2 h-0 left-[2px] top-[10.50px] absolute border border-gray-400" />
                    </div>
                    <div className="text-gray-400 text-xs font-medium font-['Nunito_Sans'] capitalize leading-3 tracking-tight">Aug 25</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional betting cards would go here - simplified for brevity */}
        </div>
      </div>
    </div>
  );
}
