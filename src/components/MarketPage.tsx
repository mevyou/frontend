"use client";

import Image from "next/image";
import { AppIcons } from "@/lib/appIcons";

export function MarketPage() {
  return (
    <div className="w-full p-6 bg-zinc-900 rounded-lg flex flex-col justify-start items-start gap-12 overflow-hidden">
      <div className="w-full flex flex-col justify-start items-start gap-12">
        <div className="w-full flex justify-between items-center">
          <div className="text-white text-2xl font-semibold font-['Nunito_Sans'] leading-7">Topics</div>
          <div className="pl-5 pr-6 py-3 bg-cyan-400/5 rounded-lg border border-cyan-400/50 flex justify-center items-center gap-1 overflow-hidden">
            <div className="w-6 h-6 relative">
              <div className="w-4 h-4 left-[4px] top-[4px] absolute border-2 border-white" />
            </div>
            <div className="text-center text-white text-base font-semibold font-['Nunito_Sans'] capitalize leading-none">Create bet</div>
          </div>
        </div>
        
        <div className="w-full flex flex-wrap justify-start items-start gap-4">
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="p-1 rounded-full shadow-[0px_0px_16px_0px_rgba(25,254,253,0.25)] border-2 border-cyan-400/60 flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="w-52 h-52 p-16 relative bg-gradient-to-br from-cyan-100 to-lime-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <div className="w-32 h-32 left-[44px] top-[44px] absolute">
                  <Image className="w-32 h-32 left-0 top-0 absolute" src="https://placehold.co/128x128" alt="Sports" width={128} height={128} />
                </div>
              </div>
            </div>
            <div className="text-white text-xl font-bold font-['Nunito_Sans'] leading-7">Sports</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="p-1 rounded-full border-2 border-gray-400/25 flex justify-start items-center gap-2.5">
              <div className="w-52 h-52 p-16 relative bg-gradient-to-br from-slate-400 to-rose-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <div className="w-32 h-32 left-[44px] top-[44px] absolute">
                  <Image className="w-32 h-32 left-0 top-0 absolute" src="https://placehold.co/128x127" alt="Crypto" width={128} height={127} />
                </div>
              </div>
            </div>
            <div className="text-white text-xl font-bold font-['Nunito_Sans'] leading-7">Crypto</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="p-1 rounded-full border-2 border-gray-400/25 flex justify-start items-center gap-2.5">
              <div className="w-52 h-52 p-16 relative bg-gradient-to-br from-rose-100 to-cyan-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <Image className="w-32 h-32 left-[44px] top-[44px] absolute" src="https://placehold.co/128x128" alt="Politics" width={128} height={128} />
              </div>
            </div>
            <div className="text-white text-xl font-bold font-['Nunito_Sans'] leading-7">Politics</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="p-1 rounded-full border-2 border-gray-400/25 flex justify-start items-center gap-2.5">
              <div className="w-52 h-52 p-16 relative bg-gradient-to-br from-rose-300 to-orange-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <Image className="w-20 h-32 left-[66px] top-[44px] absolute" src="https://placehold.co/85x128" alt="Gaming" width={85} height={128} />
              </div>
            </div>
            <div className="text-white text-xl font-bold font-['Nunito_Sans'] leading-7">Gaming</div>
          </div>
          
          <div className="flex flex-col justify-center items-center gap-3">
            <div className="p-1 rounded-full border-2 border-gray-400/25 flex justify-start items-center gap-2.5">
              <div className="w-52 h-52 p-16 relative bg-gradient-to-br from-neutral-200 to-lime-100 rounded-full flex flex-col justify-start items-start overflow-hidden">
                <Image className="w-32 h-32 left-[44px] top-[46px] absolute" src="https://placehold.co/128x125" alt="Economy" width={128} height={125} />
              </div>
            </div>
            <div className="text-white text-xl font-bold font-['Nunito_Sans'] leading-7">Economy</div>
          </div>
        </div>
      </div>
      
      <div className="w-full flex flex-col justify-start items-start gap-3">
        <div className="w-full flex flex-col lg:flex-row justify-start items-center gap-12">
          <div className="flex-1 px-4 py-2 bg-neutral-800 rounded-lg shadow-[0px_1px_4px_-1px_rgba(32,32,32,0.02)] flex justify-start items-center gap-2">
            <div className="w-4 h-4 relative">
              <div className="w-[2.67px] h-[2.67px] left-[11.33px] top-[11.33px] absolute bg-gray-400/60" />
              <div className="w-2.5 h-2.5 left-[2px] top-[2px] absolute bg-gray-400/60" />
            </div>
            <div className="flex-1 text-gray-400/60 text-base font-normal font-['Nunito_Sans'] leading-normal">Search</div>
          </div>
          
          <div className="flex flex-wrap justify-start items-center gap-2">
            <div className="pl-3 pr-4 py-2 bg-cyan-400/5 rounded-full border border-cyan-400/50 flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative">
                <div className="w-3 h-4 left-[3.75px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-1.5 h-1.5 left-[7.08px] top-[9.17px] absolute bg-gray-400" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Nunito_Sans'] leading-none">Latest</div>
              </div>
            </div>
            
            <div className="pl-3 pr-4 py-2 rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative">
                <div className="w-[2.50px] h-2.5 left-[14.58px] top-[7.50px] absolute bg-gray-400" />
                <div className="w-[2.50px] h-[2.50px] left-[13.75px] top-[2.50px] absolute bg-gray-400" />
                <div className="w-3 h-2 left-[3.75px] top-[2.92px] absolute bg-gray-400" />
                <div className="w-[2.50px] h-2 left-[8.75px] top-[10.42px] absolute bg-gray-400" />
                <div className="w-[2.50px] h-[5px] left-[2.92px] top-[12.50px] absolute bg-gray-400" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Nunito_Sans'] leading-none">Trending</div>
              </div>
            </div>
            
            <div className="pl-3 pr-4 py-2 rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative">
                <div className="w-2.5 h-3 left-[4.58px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-3 h-0.5 left-[4.17px] top-[16.25px] absolute bg-gray-400" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Nunito_Sans'] leading-none">Volume</div>
              </div>
            </div>
            
            <div className="pl-3 pr-4 py-2 rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative">
                <div className="w-4 h-3.5 left-[1.67px] top-[3.33px] absolute bg-gray-400" />
                <div className="w-3 h-[0.83px] left-[4.58px] top-[3.75px] absolute bg-gray-400" />
                <div className="w-1 h-1 left-[9.17px] top-[7.50px] absolute bg-gray-400" />
                <div className="w-0 h-[1.25px] left-[10.42px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-[3.33px] h-0 left-[8.75px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-[2.50px] h-0 left-[1.67px] top-[12.50px] absolute bg-gray-400" />
                <div className="w-1 h-0 left-[1.67px] top-[15.83px] absolute bg-gray-400" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Nunito_Sans'] leading-none">Closing soon</div>
              </div>
            </div>
            
            <div className="pl-3 pr-4 py-2 rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative">
                <div className="w-4 h-3.5 left-[1.67px] top-[3.33px] absolute bg-gray-400" />
                <div className="w-3 h-[0.83px] left-[4.58px] top-[3.75px] absolute bg-gray-400" />
                <div className="w-1 h-1 left-[9.17px] top-[7.50px] absolute bg-gray-400" />
                <div className="w-0 h-[1.25px] left-[10.42px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-[3.33px] h-0 left-[8.75px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-[2.50px] h-0 left-[1.67px] top-[12.50px] absolute bg-gray-400" />
                <div className="w-1 h-0 left-[1.67px] top-[15.83px] absolute bg-gray-400" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Nunito_Sans'] leading-none">Open</div>
              </div>
              <div className="w-5 h-5 relative">
                <div className="w-2.5 h-[5px] left-[5px] top-[7.50px] absolute bg-white" />
              </div>
            </div>
            
            <div className="pl-3 pr-4 py-2 rounded-full border border-gray-400/25 flex justify-start items-center gap-1">
              <div className="w-5 h-5 relative">
                <div className="w-3.5 h-3.5 left-[5px] top-[1.67px] absolute bg-gray-400" />
                <div className="w-2.5 h-2.5 left-[1.67px] top-[9.03px] absolute bg-gray-400" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Nunito_Sans'] leading-none">All tokens</div>
              </div>
              <div className="w-5 h-5 relative">
                <div className="w-2.5 h-[5px] left-[5px] top-[7.50px] absolute bg-white" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col lg:flex-row justify-start items-center gap-3">
          <div className="flex-1 px-0.5 pt-0.5 pb-3 bg-neutral-800 rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center gap-2">
            <div className="w-full bg-zinc-900 rounded-2xl flex flex-col justify-start items-start gap-3 overflow-hidden">
              <div className="w-full h-36 relative bg-neutral-900 rounded-tl-lg rounded-tr-lg flex flex-col justify-start items-start overflow-hidden">
                <div className="w-full flex-1 border-b flex justify-start items-center gap-2.5">
                  <div className="flex-1" />
                </div>
                <div className="left-[114px] top-[26px] absolute flex flex-col justify-start items-center gap-1">
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
                <Image className="w-4 h-4 rounded-full border border-zinc-900" src="https://placehold.co/16x16" alt="User 1" width={16} height={16} />
                <Image className="w-4 h-4 rounded-full border border-zinc-900" src="https://placehold.co/16x16" alt="User 2" width={16} height={16} />
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
          <div className="flex-1 px-0.5 pt-0.5 pb-3 bg-neutral-800 rounded-2xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-center gap-2">
            <div className="w-full bg-zinc-900 rounded-2xl flex flex-col justify-start items-start gap-3 overflow-hidden">
              <div className="w-full h-36 relative bg-neutral-900 rounded-tl-lg rounded-tr-lg flex flex-col justify-start items-start overflow-hidden">
                <div className="w-full flex-1 border-b flex justify-start items-center gap-2.5">
                  <div className="flex-1" />
                </div>
                <div className="left-[130px] top-[26px] absolute flex flex-col justify-start items-center gap-1">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex justify-start items-center">
                    <Image className="w-12 h-12 rounded-full" src="https://placehold.co/47x47" alt="User Avatar" width={47} height={47} />
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <div className="text-gray-400 text-sm font-medium font-['Inter'] leading-tight">0x3B...CE2d4C</div>
                  </div>
                  <div className="pl-1 pr-2 py-1 bg-neutral-900 rounded-full shadow-[0px_1px_4px_-1px_rgba(32,32,32,0.02)] border border-neutral-800 flex justify-start items-center gap-2">
                    <div className="flex justify-start items-center gap-1">
                      <div className="w-4 h-4 relative overflow-hidden">
                        <div className="w-4 h-4 left-0 top-0 absolute bg-blue-600" />
                        <div className="w-1 h-2 left-[5.93px] top-[4.33px] absolute bg-white" />
                        <div className="w-2.5 h-2.5 left-[2.50px] top-[2.75px] absolute bg-white" />
                      </div>
                      <div className="text-gray-400 text-xs font-normal font-['Nunito_Sans'] leading-none">USDT</div>
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
                <Image className="w-4 h-4 rounded-full border border-zinc-900" src="https://placehold.co/16x16" alt="User 1" width={16} height={16} />
                <Image className="w-4 h-4 rounded-full border border-zinc-900" src="https://placehold.co/16x16" alt="User 2" width={16} height={16} />
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
      </div>
    </div>
  );
}
