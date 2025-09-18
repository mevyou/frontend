"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import { useInvites, useUserInvitations } from "@/hooks/useGraphData";
import { AppIcons } from "@/lib/appIcons";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Abi } from "viem";
import { gameABI, gameAddress, hubABI, hubAddress } from "@/contract/contract";

export function InvitesPage() {
  const { address } = useAccount();
  const { data: invites, isLoading } = useInvites(address);
  const { data: userInvitations, isLoading: isLoadingInvitations } = useUserInvitations(address || '');
  const [selected, setSelected] = useState<string | null>(null);

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const handleRespond = (inviteId: string, accept: boolean) => {
    // Example hub function names; adjust as per actual contract
    writeContract({
      address: hubAddress as `0x${string}`,
      abi: hubABI as Abi,
      functionName: accept ? 'acceptInvite' : 'rejectInvite',
      args: [inviteId],
    });
  };

  const handleAcceptUserInvitation = (invitationId: string, betId: string) => {
    // Accept user invitation - you may need to adjust the function name and args based on your contract
    writeContract({
      address: gameAddress as `0x${string}`,
      abi: gameABI as Abi,
      functionName: 'acceptInvitation', // Adjust function name as needed
      args: [Number(betId)],
    });
  };

  const handleRejectUserInvitation = (invitationId: string, betId: string) => {
    // Reject user invitation - you may need to adjust the function name and args based on your contract
    writeContract({
      address: gameAddress as `0x${string}`,
      abi: gameABI as Abi,
      functionName: 'rejectInvitation', // Adjust function name as needed
      args: [Number(betId)],
    });
  };

  // Filter user invitations to only show those for the connected user
  const filteredUserInvitations = userInvitations?.filter(invitation =>
    invitation.user?.toLowerCase() === address?.toLowerCase()
  ) || [];

  // Debug logging for user invitations
  console.log('User Invitations:', userInvitations);
  console.log('Filtered User Invitations:', filteredUserInvitations);
  console.log('Connected Address:', address);
  console.log('Loading Invitations:', isLoadingInvitations);

  if (isLoading) return <div className="p-6 text-gray-400">Loading invites…</div>;

  if ((!invites || invites.length === 0) && (!filteredUserInvitations || filteredUserInvitations.length === 0)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center" style={{ backgroundColor: '#121214' }}>
        <Image src={AppIcons.giftInactive} alt="no invites" width={80} height={80} className="w-24 h-24" />
        <div className="mt-3 text-white text-xl font-semibold">No Invites</div>
      </div>
    );
  }

  const selectedInvite = invites?.find(i => i.id === selected);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ backgroundColor: '#121214' }}>
      {/* List */}
      <div className="space-y-3">
        {/* User Invitations */}
        {filteredUserInvitations && filteredUserInvitations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">User Invitations</h3>
            {filteredUserInvitations.map(invitation => (
              <div key={invitation.id} className="rounded-xl border border-[#1F1F23] bg-[#0f0f12] p-4 flex items-center justify-between hover:bg-[#141418]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <div>
                    <div className="text-white font-semibold">Bet ID: {invitation.betId}</div>
                    <div className="text-gray-400 text-xs">User: {invitation.user?.slice(0, 6)}…{invitation.user?.slice(-4)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={isConfirming}
                    onClick={() => handleAcceptUserInvitation(invitation.id, invitation.betId)}
                    className="px-3 py-2 rounded-lg bg-emerald-500 text-black font-semibold disabled:opacity-60 hover:bg-emerald-600 transition-colors text-sm"
                  >
                    {isConfirming ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    disabled={isConfirming}
                    onClick={() => handleRejectUserInvitation(invitation.id, invitation.betId)}
                    className="px-3 py-2 rounded-lg bg-red-500 text-white font-semibold disabled:opacity-60 hover:bg-red-600 transition-colors text-sm"
                  >
                    {isConfirming ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => setSelected(invitation.id)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <Image src={AppIcons.arrowRight} alt="view" width={16} height={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regular Invites */}
        {invites && invites.length > 0 && (
          <div>
            <h3 className="text-white text-lg font-semibold mb-3">Bet Invites</h3>
            {invites.map(inv => (
              <div key={inv.id} className="rounded-xl border border-[#1F1F23] bg-[#0f0f12] p-4 flex items-center justify-between cursor-pointer hover:bg-[#141418]" onClick={() => setSelected(inv.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" />
                  <div>
                    <div className="text-white font-semibold">{inv.bet_name || 'Bet Invite'}</div>
                    <div className="text-gray-400 text-xs">{inv.inviter?.slice(0, 6)}…{inv.inviter?.slice(-4)}</div>
                  </div>
                </div>
                <Image src={AppIcons.arrowRight} alt="view" width={16} height={16} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`transition-all ${selected ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-60'} rounded-xl border border-[#1F1F23] bg-[#0f0f12]`}>
        {selectedInvite ? (
          <div className="p-4 space-y-3">
            <button className="text-cyan-400 text-sm" onClick={() => setSelected(null)}>← Back</button>
            <div className="text-white text-lg font-bold">{selectedInvite.bet_name || 'Bet Invite'}</div>
            <div className="text-gray-300 text-sm">{selectedInvite.bet_description}</div>
            <div className="text-gray-400 text-sm">Bet ID: {selectedInvite.betId}</div>
            <div className="flex gap-2 flex-wrap">
              {(() => {
                try {
                  const options = JSON.parse(selectedInvite.bet_options || '[]');
                  return options.map((o: any, idx: number) => (
                    <div key={idx} className="px-3 py-1 rounded-lg bg-white/10 text-white text-sm">{o.option || `Option ${idx + 1}`}</div>
                  ));
                } catch {
                  return null;
                }
              })()}
            </div>
            <div className="flex gap-3 pt-2">
              <button disabled={isConfirming} onClick={() => handleRespond(selectedInvite.id, true)} className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold disabled:opacity-60">Accept</button>
              {/* <button disabled={isConfirming} onClick={() => handleRespond(selectedInvite.id, false)} className="px-4 py-2 rounded-lg bg-rose-500 text-black font-semibold disabled:opacity-60">Reject</button> */}
            </div>
          </div>
        ) : (
          <div className="p-6 text-gray-400">Select an invite to view details.</div>
        )}
      </div>
    </div>
  );
}


