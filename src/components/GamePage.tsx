"use client";

import Image from "next/image";

export function GamePage() {
  return (
    <div className="w-full p-6 bg-zinc-900 rounded-lg flex flex-col justify-start items-start gap-6 overflow-hidden">
      <div className="w-full flex flex-col justify-start items-start gap-3">
        <div className="text-white text-2xl font-semibold font-['Nunito_Sans'] leading-7">Arcade</div>
        <div className="w-full flex flex-col justify-start items-start gap-6">
          <div className="w-full flex flex-wrap justify-start items-start gap-3">
            <div className="w-72 relative flex flex-col justify-start items-center">
              <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Pocket Quest" width={300} height={300} />
              <div className="w-72 px-3 pb-3 left-0 top-[208px] absolute flex flex-col justify-start items-start gap-2.5">
                <div className="w-full p-4 bg-neutral-800/75 rounded-xl backdrop-blur-sm flex justify-between items-start">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="w-full flex justify-start items-center gap-2">
                      <div className="text-white text-base font-bold font-['Nunito_Sans'] leading-tight">Pocket Quest</div>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-gray-400/25 flex justify-start items-center gap-0.5">
                      <div className="w-4 h-4 relative">
                        <div className="w-1.5 h-0.5 left-[5px] top-[10.67px] absolute bg-gray-400" />
                        <div className="w-[3.33px] h-[3.33px] left-[6.33px] top-[5.67px] absolute bg-gray-400" />
                        <div className="w-[2.67px] h-0.5 left-[11.67px] top-[7.33px] absolute bg-gray-400" />
                        <div className="w-[2.67px] h-[2.67px] left-[10.33px] top-[3px] absolute bg-gray-400" />
                        <div className="w-[2.67px] h-0.5 left-[1.67px] top-[7.33px] absolute bg-gray-400" />
                        <div className="w-[2.67px] h-[2.67px] left-[3px] top-[3px] absolute bg-gray-400" />
                      </div>
                      <div className="flex flex-col justify-start items-start gap-[3.20px]">
                        <div className="text-white text-xs font-bold font-['Nunito_Sans'] leading-3">3/10</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-end gap-2">
                    <div className="px-2 py-1.5 bg-cyan-400 rounded-md flex justify-start items-center gap-2.5">
                      <div className="text-center text-zinc-800 text-sm font-medium font-['Nunito_Sans'] capitalize leading-none tracking-tight">Play</div>
                    </div>
                    <div className="text-gray-400 text-xs font-bold font-['Nunito_Sans'] leading-3">$50</div>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 p-1 left-[139px] top-[176px] absolute flex justify-center items-center gap-2.5">
                <div className="w-3 h-4 bg-white" />
                <div className="w-2 h-3.5 bg-black" />
              </div>
            </div>
            <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Game 2" width={300} height={300} />
            <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Game 3" width={300} height={300} />
            <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Game 4" width={300} height={300} />
            <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Game 5" width={300} height={300} />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-3">
        <div className="text-white text-2xl font-semibold font-['Nunito_Sans'] leading-7">My Bets</div>
        <div className="w-full flex flex-wrap justify-start items-start gap-3">
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="My Bet 1" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="My Bet 2" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="My Bet 3" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="My Bet 4" width={300} height={300} />
          <Image className="w-72 h-72 rounded-[32px]" src="https://placehold.co/300x300" alt="My Bet 5" width={300} height={300} />
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-3">
        <div className="text-white text-2xl font-semibold font-['Nunito_Sans'] leading-7">Recent Games</div>
        <div className="w-full flex flex-wrap justify-start items-start gap-3">
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Recent Game 1" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Recent Game 2" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Recent Game 3" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Recent Game 4" width={300} height={300} />
          <Image className="w-72 h-72 rounded-3xl" src="https://placehold.co/300x300" alt="Recent Game 5" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
