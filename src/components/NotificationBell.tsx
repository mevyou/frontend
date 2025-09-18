"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { useInvites } from "@/hooks/useGraphData";
import { AppIcons } from "@/lib/appIcons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NotificationBellProps {
  onClick?: () => void;
}

export function NotificationBell({ onClick }: NotificationBellProps) {
  const { address } = useAccount();
  const { data: invites } = useInvites(address);
  const hasNotifications = (invites?.length || 0) > 0;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); onClick?.(); }}
        className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg bg-[#121214] hover:bg-[#1A1A1E]"
        aria-label="Notifications"
      >
        <Image src={AppIcons.fire} alt="bell" width={18} height={18} className="w-6 h-6" />
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold flex items-center justify-center">
            {invites?.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#1F1F23] bg-[#121214] shadow-xl z-50">
          <div className="px-3 py-2 border-b border-[#1F1F23] text-white font-semibold">Notifications</div>
          <div className="max-h-72 overflow-y-auto">
            {(invites || []).slice(0, 10).map((inv) => (
              <div key={inv.id} className="flex items-start gap-3 px-3 py-3 hover:bg-[#1A1A1E]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate">Invite: {inv.bet_name || 'Bet'}</div>
                  <div className="text-gray-400 text-xs truncate">{inv.bet_description || inv.inviter}</div>
                </div>
                <Link href="/invites" className="text-cyan-400 text-sm">→</Link>
              </div>
            ))}
            {!hasNotifications && (
              <div className="px-3 py-6 text-center text-gray-400 text-sm">No notifications</div>
            )}
          </div>
          <div className="px-3 py-2 border-t border-[#1F1F23] text-right">
            <Link href="/invites" className="text-cyan-400 text-sm">All notifications →</Link>
          </div>
        </div>
      )}
    </div>
  );
}


