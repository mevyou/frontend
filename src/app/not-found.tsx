import Image from "next/image";
import Link from "next/link";
import { TopHeader } from "@/components/TopHeader";
import { SearchProvider } from "@/contexts/SearchContext";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#121214' }}>
      <SearchProvider>
        <TopHeader hideSearch hideTokenBalance />
      </SearchProvider>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-4 select-none">
        <span className="text-[88px] md:text-[120px] font-extrabold leading-none" style={{ color: 'white' }}>4</span>
        <div className="relative w-[88px] h-[88px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/image/betting-404.png"
              alt="404 spinner"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
        <span className="text-[88px] md:text-[120px] font-extrabold leading-none" style={{ color: 'white' }}>4</span>
      </div>
      <p className="mt-4 text-gray-400 text-center max-w-md">The page you’re looking for can’t be found. Spin up a new bet or head back home.</p>
      <div className="mt-6 flex items-center gap-3">
        <Link href="/" className="px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--create-bet-fill)', border: '1px solid var(--create-bet-border)', color: 'white' }}>Go Home</Link>
      </div>
      </div>
    </div>
  );
}


