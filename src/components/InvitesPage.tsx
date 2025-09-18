"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import { useInvites, useUserInvitations, useAcceptedInvites } from "@/hooks/useGraphData";
import { getBetFromContract } from "@/lib/contracts/BettingContract";
import { AppIcons } from "@/lib/appIcons";
import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Abi } from "viem";
import { gameABI, gameAddress, hubABI, hubAddress } from "@/contract/contract";
import { TxButton } from "@/components/TxButton";

export function InvitesPage() {
  const { address } = useAccount();
  const { data: invites, isLoading } = useInvites(address);
  const { data: userInvitations, isLoading: isLoadingInvitations } = useUserInvitations(address || '');
  const { data: acceptedInvites, isLoading: isLoadingAccepted } = useAcceptedInvites(address || '');
  const [selected, setSelected] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedBetForResult, setSelectedBetForResult] = useState<{ betId: string; betName: string } | null>(null);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [betDetails, setBetDetails] = useState<any>(null);
  const [isLoadingBetDetails, setIsLoadingBetDetails] = useState(false);

  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  const handleSetResult = async (betId: string, betName: string) => {
    setSelectedBetForResult({ betId, betName });
    setShowResultModal(true);
    setSelectedResult(null);
    setBetDetails(null);

    // Fetch bet details from smart contract
    setIsLoadingBetDetails(true);
    try {
      const betData = await getBetFromContract(BigInt(betId));
      setBetDetails(betData);
      console.log('Bet details fetched:', betData);
    } catch (error) {
      console.error('Error fetching bet details:', error);
    } finally {
      setIsLoadingBetDetails(false);
    }
  };

  const handleConfirmResult = () => {
    if (!selectedBetForResult || selectedResult === null) return;

    // Set result on the contract - you may need to adjust the function name and args
    writeContract({
      address: gameAddress as `0x${string}`,
      abi: gameABI as Abi,
      functionName: 'setResult', // Adjust function name as needed
      args: [Number(selectedBetForResult.betId), selectedResult],
    });

    setShowResultModal(false);
    setSelectedBetForResult(null);
    setSelectedResult(null);
    setBetDetails(null);
    setIsLoadingBetDetails(false);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setSelectedBetForResult(null);
    setSelectedResult(null);
    setBetDetails(null);
    setIsLoadingBetDetails(false);
  };


  // Get accepted bet IDs for filtering
  const acceptedBetIds = new Set(acceptedInvites?.map(invite => invite.betId) || []);

  // Filter user invitations to only show those for the connected user and not already accepted
  const filteredUserInvitations = userInvitations?.filter(invitation =>
    invitation.user?.toLowerCase() === address?.toLowerCase() &&
    !acceptedBetIds.has(invitation.betId)
  ) || [];

  // Debug logging for user invitations
  console.log('User Invitations:', userInvitations);
  console.log('Accepted Invites:', acceptedInvites);
  console.log('Accepted Bet IDs:', Array.from(acceptedBetIds));
  console.log('Filtered User Invitations:', filteredUserInvitations);
  console.log('Connected Address:', address);
  console.log('Loading Invitations:', isLoadingInvitations);
  console.log('Loading Accepted:', isLoadingAccepted);

  if (isLoading) return <div className="p-6 text-gray-400">Loading invites…</div>;

  if ((!invites || invites.length === 0) && (!filteredUserInvitations || filteredUserInvitations.length === 0) && (!acceptedInvites || acceptedInvites.length === 0)) {
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
        {/* Accepted Invites */}
        {acceptedInvites && acceptedInvites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Accepted Invites</h3>
            {acceptedInvites.map(invitation => {
              // Find the corresponding user invitation to get userType
              const userInvitation = userInvitations?.find(ui => ui.betId === invitation.betId && ui.user?.toLowerCase() === address?.toLowerCase());
              const isModerator = userInvitation?.userType === 0;

              return (
                <div key={invitation.id} className="rounded-xl border border-[#1F1F23] bg-[#0f0f12] p-4 flex items-center justify-between hover:bg-[#141418]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${isModerator
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`} />
                    <div>
                      <div className="text-white font-semibold">Bet ID: {invitation.betId}</div>
                      <div className="text-gray-400 text-xs">User: {invitation.user?.slice(0, 6)}…{invitation.user?.slice(-4)}</div>
                      <div className={`text-xs font-semibold ${isModerator
                        ? 'text-purple-400'
                        : 'text-green-400'
                        }`}>
                        {isModerator ? 'Moderator' : 'Participant'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm font-semibold">
                      Accepted
                    </span>
                    <TxButton
                      address={gameAddress as `0x${string}`}
                      abi={gameABI as Abi}
                      functionName="claimReward"
                      args={[Number(invitation.betId)]}
                      idleLabel="Claim"
                      className="px-3 py-1 rounded-lg text-black text-sm font-semibold transition-colors"
                    />
                    {isModerator && (
                      <button
                        onClick={() => handleSetResult(invitation.betId, `Bet ${invitation.betId}`)}
                        className="px-3 py-1 rounded-lg bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
                      >
                        Set Result
                      </button>
                    )}
                    <button
                      onClick={() => setSelected(invitation.id)}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <Image src={AppIcons.arrowRight} alt="view" width={16} height={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* User Invitations */}
        {filteredUserInvitations && filteredUserInvitations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Pending Invitations</h3>
            {filteredUserInvitations.map(invitation => {
              const isModerator = invitation.userType === 0;

              return (
                <div key={invitation.id} className="rounded-xl border border-[#1F1F23] bg-[#0f0f12] p-4 flex items-center justify-between hover:bg-[#141418]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${isModerator
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`} />
                    <div>
                      <div className="text-white font-semibold">Bet ID: {invitation.betId}</div>
                      <div className="text-gray-400 text-xs">User: {invitation.user?.slice(0, 6)}…{invitation.user?.slice(-4)}</div>
                      <div className={`text-xs font-semibold ${isModerator
                        ? 'text-purple-400'
                        : 'text-blue-400'
                        }`}>
                        {isModerator ? 'Moderator' : 'Participant'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TxButton
                      address={gameAddress as `0x${string}`}
                      abi={gameABI as Abi}
                      functionName="acceptInvitation"
                      args={[Number(invitation.betId)]}
                      idleLabel="Accept"
                      className="px-3 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition-colors text-sm"
                    />
                    <TxButton
                      address={gameAddress as `0x${string}`}
                      abi={gameABI as Abi}
                      functionName="rejectInvitation"
                      args={[Number(invitation.betId)]}
                      idleLabel="Reject"
                      className="px-3 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors text-sm"
                    />
                    <button
                      onClick={() => setSelected(invitation.id)}
                      className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      <Image src={AppIcons.arrowRight} alt="view" width={16} height={16} />
                    </button>
                  </div>
                </div>
              );
            })}
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
              <TxButton
                address={hubAddress as `0x${string}`}
                abi={hubABI as Abi}
                functionName="acceptInvite"
                args={[selectedInvite.id]}
                idleLabel="Accept"
                className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition-colors"
              />
              <TxButton
                address={gameAddress as `0x${string}`}
                abi={gameABI as Abi}
                functionName="claimReward"
                args={[Number(selectedInvite.betId)]}
                idleLabel="Claim"
                className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-600 transition-colors"
              />
              {/* <TxButton address={hubAddress as `0x${string}`} abi={hubABI as Abi} functionName="rejectInvite" args={[selectedInvite.id]} idleLabel="Reject" className="px-4 py-2 rounded-lg bg-rose-500 text-black font-semibold hover:bg-rose-600 transition-colors" /> */}
            </div>
          </div>
        ) : (
          <div className="p-6 text-gray-400">Select an invite to view details.</div>
        )}
      </div>

      {/* Result Setting Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0f0f12] rounded-xl border border-[#1F1F23] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Set Bet Result</h3>
              <button
                onClick={handleCloseResultModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 text-sm mb-2">Bet: {selectedBetForResult?.betName}</p>
              <p className="text-gray-400 text-xs">Select the winning option</p>
            </div>

            {isLoadingBetDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400">Loading bet details...</div>
              </div>
            ) : betDetails && betDetails.options ? (
              <div className="space-y-3 mb-6">
                {betDetails.options.map((option: any, index: number) => (
                  <label key={index} className="block cursor-pointer">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[#1F1F23] hover:bg-[#141418] transition-colors">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="result"
                          value={index}
                          checked={selectedResult === index}
                          onChange={(e) => setSelectedResult(parseInt(e.target.value))}
                          className="mr-3"
                        />
                        <span className="text-white font-medium">{option.option}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400 text-xs">Total Staked</div>
                        <div className="text-white text-sm font-semibold">
                          {option.totalStaked ? (Number(option.totalStaked) / 1e18).toFixed(4) : '0'} ETH
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400">Failed to load bet details</div>
                <button
                  onClick={() => selectedBetForResult && handleSetResult(selectedBetForResult.betId, selectedBetForResult.betName)}
                  className="mt-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCloseResultModal}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <TxButton
                address={gameAddress as `0x${string}`}
                abi={gameABI as Abi}
                functionName="setResult"
                args={[Number(selectedBetForResult?.betId), selectedResult]}
                disabled={selectedResult === null}
                idleLabel="Set Result"
                className="flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


