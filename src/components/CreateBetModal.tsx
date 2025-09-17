import React, { useState, useEffect } from "react";
import { X, ChevronDown, Plus, GripVertical } from "lucide-react";
import { AppIcons } from "../lib/appIcons";
import { AppImages } from "../lib/appImages";
import { AppColors } from "../lib/appColors";
import { gameABI, gameAddress } from "../contract/contract";
import TxButton from "./TxButton";
import { parseEther } from "viem";
import Image from "next/image";
import { Abi } from "viem";
import { formatAddress } from "@/lib/utils";
import { useAccount } from "wagmi";

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBet: (betData: unknown) => void;
}

const CreateBetModal: React.FC<CreateBetModalProps> = ({
  isOpen,
  onClose,
  onCreateBet,
}) => {
  const [topic, setTopic] = useState("");
  const [outcomeType, setOutcomeType] = useState("multi-choice");
  const [outcomes, setOutcomes] = useState([
    "≥30M To <40M",
    "<30M",
    "≥40M To <50M",
    "≥50M To <60M",
  ]);
  const { address } = useAccount();
  const [selectedTopic, setSelectedTopic] = useState("Sport");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [amountEth, setAmountEth] = useState<string>("0.001");
  const [deadlineHours, setDeadlineHours] = useState<string>("24");

  // Drag and Drop functionality - moved before early return
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Reset confirmation state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false);
    }
  }, [isOpen]);

  const topics = [
    {
      name: "Sport",
      icon: AppImages.type1,
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Politics",
      icon: AppImages.type2,
      color: "from-blue-400 to-purple-500",
    },
    {
      name: "Entertainment",
      icon: AppImages.type3,
      color: "from-pink-400 to-red-500",
    },
    {
      name: "Technology",
      icon: AppImages.type4,
      color: "from-green-400 to-blue-500",
    },
    {
      name: "Finance",
      icon: AppImages.type5,
      color: "from-purple-400 to-pink-500",
    },
  ];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
    }
  };

  const addOutcome = () => {
    setOutcomes([...outcomes, ""]);
  };

  // removeOutcome was unused; removed to satisfy linter

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = value;
    setOutcomes(newOutcomes);
  };

  // Drag and Drop event handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newOutcomes = [...outcomes];
    const draggedItem = newOutcomes[draggedIndex];

    // Remove dragged item
    newOutcomes.splice(draggedIndex, 1);

    // Insert at new position
    newOutcomes.splice(dropIndex, 0, draggedItem);

    setOutcomes(newOutcomes);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex md:items-center md:justify-center md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsTopicDropdownOpen(false);
        }
      }}
    >
      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div
        className={`bg-[#121214] w-full max-h-[90vh] overflow-y-auto
        md:rounded-2xl ${showConfirmation ? "md:max-w-[480px] animate-fade-in" : "md:max-w-[720px]"
          }
        fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto
        rounded-t-3xl md:rounded-b-2xl
        ${isOpen ? "animate-slide-up" : ""} md:animate-none`}
      >
        {/* Modal Header */}
        <div className="relative px-4 md:px-8 py-4 md:py-10 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Create Bet Icon */}
          <div className="mx-auto mb-6 sm:mb-8 flex items-center justify-center">
            {showConfirmation ? (
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-purple-600 to-pink-500 flex items-center justify-center"></div>
            ) : (
              <Image
                src={AppIcons.createBet}
                alt="Create Bet"
                className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
                style={{
                  filter: `brightness(0) saturate(100%) invert(34%) sepia(87%) saturate(584%) hue-rotate(145deg) brightness(99%) contrast(99%)`,
                }}
                width={64}
                height={64}
              />
            )}
          </div>

          {/* Title */}
          {showConfirmation ? (
            <>
              {/* Wallet Address */}
              <p className="text-gray-400 text-sm mb-4">{address && formatAddress(address)}</p>

              <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                {topic || "Will Jerome powell leave the Fed chair in 2025?"}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Your suggested market is undergoing review. If accepted, you
                will be notified and attributed as the creator
              </p>
              <div className="px-4 md:px-8 space-y-3">
                <TxButton
                  address={gameAddress as `0x${string}`}
                  abi={gameABI as Abi}
                  functionName="createBet"
                  args={(() => {
                    const safeAmount = amountEth && Number(amountEth) > 0 ? amountEth : "0.001"
                    const selectedOption = outcomes && outcomes.length > 0 ? outcomes[0] : 'Option A'
                    // Map enums to uint8 values expected by the contract
                    const betTypeUint8 = 0 // Single
                    const statusUint8 = 0 // Open
                    return [{
                      id: 0,
                      options: [
                        {
                          option: selectedOption,
                          odds: parseEther(safeAmount),
                        },
                      ],
                      betType: betTypeUint8,
                      name: topic || 'Untitled Bet',
                      description: topic || 'Untitled Bet',
                      image: AppIcons.bet,
                      link: 'https://mevyou.com',
                      owner: address as `0x${string}` | undefined,
                      result: selectedOption,
                      status: statusUint8,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      privateBet: false,
                    }] as const
                  })()}
                  idleLabel={
                    <span className="flex items-center gap-2">
                      <Image
                        src={AppIcons.bet}
                        alt="Create"
                        className="w-4 h-4"
                        style={{ filter: "brightness(0) saturate(100%) invert(100%)" }}
                        width={16}
                        height={16}
                      />
                      {`Create on-chain (${amountEth || '0.001'} ETH)`}
                    </span>
                  }
                  confirmingLabel="Confirm in wallet…"
                  pendingLabel="Submitting…"
                  successLabel="Created!"
                  errorLabel="Retry"
                  successToastMessage="Bet created successfully"
                  errorToastMessage="Failed to create bet"
                  cancelToastMessage="Transaction canceled"
                  className="w-full"
                  onReceiptSuccess={() => {
                    const betData = { topic, outcomeType, outcomes, selectedTopic };
                    onCreateBet(betData);
                    setShowConfirmation(false);
                    onClose();
                  }}
                />
                <button
                  onClick={() => {
                    const betData = { topic, outcomeType, outcomes, selectedTopic };
                    onCreateBet(betData);
                    setShowConfirmation(false);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 text-white rounded-lg hover:opacity-80 transition-colors"
                  style={{ backgroundColor: "#242429" }}
                >
                  <Image
                    src={AppIcons.bet}
                    alt="Markets"
                    className="w-4 h-4"
                    style={{
                      filter: "brightness(0) saturate(100%) invert(100%)",
                    }}
                    width={16}
                    height={16}
                  />
                  Skip on-chain for now
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">
                Suggest market
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Create public market
              </p>
            </>
          )}
        </div>

        {/* Content */}
        {!showConfirmation && (
          <div className="px-0">
            {/* Topic Section with Full Width Dividers */}
            <div className="mb-6">
              {/* Top Divider - Full Width */}
              <div className="h-px bg-[#1F1F23] w-full"></div>

              {/* Topic Content */}
              <div className="px-4 md:px-8 py-4">
                <input
                  type="text"
                  placeholder="Enter topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none text-base"
                />
              </div>

              {/* Bottom Divider - Full Width */}
              <div className="h-px bg-[#1F1F23] w-full"></div>
            </div>

            <div className="px-4 md:px-8">
              {/* Outcome Type */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg">
                    Outcome type
                  </h3>
                  <ChevronDown className="text-gray-400" size={24} />
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {/* Yes/No Option */}
                  <div
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${outcomeType === "yes-no"
                      ? ""
                      : "border-gray-700 bg-[#2a2a2a] hover:border-gray-600"
                      }`}
                    style={
                      outcomeType === "yes-no"
                        ? {
                          borderColor: AppColors.teal,
                          backgroundColor: AppColors.teal + "1A",
                        }
                        : {}
                    }
                    onClick={() => setOutcomeType("yes-no")}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${outcomeType === "yes-no" ? "" : "border-gray-500"
                          }`}
                        style={
                          outcomeType === "yes-no"
                            ? {
                              borderColor: AppColors.teal,
                              backgroundColor: AppColors.teal,
                            }
                            : {}
                        }
                      >
                        {outcomeType === "yes-no" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-white font-semibold">
                            Yes/No
                          </span>
                          <span
                            className="px-2 py-1 bg-[#1A1A1E] text-xs rounded-full font-medium inline-block w-fit"
                            style={{ color: AppColors.teal }}
                          >
                            Binary outcomes
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Only two possible outcomes, Yes or No.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Multi-choice Option */}
                  <div
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${outcomeType === "multi-choice"
                      ? ""
                      : "border-gray-700 bg-[#2a2a2a] hover:border-gray-600"
                      }`}
                    style={
                      outcomeType === "multi-choice"
                        ? {
                          borderColor: AppColors.teal,
                          backgroundColor: AppColors.teal + "1A",
                        }
                        : {}
                    }
                    onClick={() => setOutcomeType("multi-choice")}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${outcomeType === "multi-choice"
                          ? ""
                          : "border-gray-500"
                          }`}
                        style={
                          outcomeType === "multi-choice"
                            ? {
                              borderColor: AppColors.teal,
                              backgroundColor: AppColors.teal,
                            }
                            : {}
                        }
                      >
                        {outcomeType === "multi-choice" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-white font-semibold">
                            Multi-choice
                          </span>
                          <span
                            className="px-2 py-1 bg-[#1A1A1E] text-xs rounded-full font-medium inline-block w-fit"
                            style={{ color: AppColors.teal }}
                          >
                            Custom outcomes
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Two or more customizable labels
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outcomes for Multi-choice */}
              {outcomeType === "multi-choice" && (
                <div className="mb-8">
                  <div className="space-y-2 md:space-y-3">
                    {outcomes.map((outcome, index) => {
                      const cardStyles = [
                        { backgroundColor: "#7086FD1A" },
                        { backgroundColor: "#6FD1951A" },
                        { backgroundColor: "#FFAE4C1A" },
                        { backgroundColor: "#07DBFA1A" },
                      ];
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-2 md:gap-4 group transition-all duration-300 ease-in-out ${draggedIndex === index
                            ? "opacity-60 scale-95 rotate-1 shadow-2xl z-10"
                            : "opacity-100 scale-100 rotate-0"
                            } ${dragOverIndex === index
                              ? "transform translate-y-2 scale-105 shadow-lg"
                              : "transform translate-y-0 scale-100"
                            }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="cursor-grab active:cursor-grabbing hover:bg-gray-700/50 rounded p-1.5 transition-all duration-200 flex-shrink-0 hover:scale-110">
                            <GripVertical
                              className="text-gray-500 group-hover:text-gray-300 transition-colors duration-200"
                              size={16}
                            />
                          </div>
                          <div
                            className="flex-1 rounded-xl px-3 md:px-6 py-2.5 md:py-4 shadow-lg relative overflow-hidden min-h-[44px] flex items-center transition-all duration-300 ease-in-out hover:shadow-xl"
                            style={cardStyles[index % 4]}
                          >
                            <input
                              type="text"
                              value={outcome}
                              onChange={(e) =>
                                updateOutcome(index, e.target.value)
                              }
                              className="w-full bg-transparent text-white outline-none font-medium placeholder-white/70 text-sm md:text-base"
                              placeholder="Enter outcome"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={addOutcome}
                    className="flex items-center gap-2 mt-6 font-medium transition-colors hover:opacity-80"
                    style={{ color: AppColors.teal }}
                  >
                    <Plus size={18} />
                    <span>Add more outcome</span>
                  </button>
                </div>
              )}

              {/* Amount and Deadline Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="border border-[#1F1F23] rounded-xl p-4">
                  <label className="block text-sm text-gray-400 mb-2">Stake amount (ETH)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    value={amountEth}
                    onChange={(e) => setAmountEth(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                    placeholder="0.001"
                  />
                </div>
                <div className="border border-[#1F1F23] rounded-xl p-4">
                  <label className="block text-sm text-gray-400 mb-2">Deadline (hours from now)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={deadlineHours}
                    onChange={(e) => setDeadlineHours(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                    placeholder="24"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="-mx-4 md:-mx-8 border-t border-[#19191C]"></div>

              {/* Footer with Topic and Buttons */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 md:pt-6 pb-4 md:pb-6">
                <div className="flex items-center gap-4 relative w-full sm:w-auto">
                  <span className="text-white font-medium">Topic:</span>
                  <div
                    className="flex items-center gap-3 bg-[#121214] rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-[#0E4D4F] cursor-pointer hover:border-[#0E4D4F]/80 transition-colors flex-1 sm:flex-initial"
                    onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                  >
                    {(() => {
                      const currentTopic =
                        topics.find((t) => t.name === selectedTopic) ||
                        topics[0];
                      return (
                        <>
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={currentTopic.icon}
                              alt={currentTopic.name}
                              className="w-full h-full object-cover"
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className="text-white font-medium flex-1">
                            {currentTopic.name}
                          </span>
                          <ChevronDown
                            className={`text-gray-400 transition-transform ${isTopicDropdownOpen ? "rotate-180" : ""
                              }`}
                            size={16}
                          />
                        </>
                      );
                    })()}
                  </div>

                  {/* Topic Dropdown */}
                  {isTopicDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-64 bg-[#1A1A1E] rounded-xl border border-[#0E4D4F] overflow-hidden z-10">
                      {topics.map((topicItem) => (
                        <div
                          key={topicItem.name}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#242429] cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedTopic(topicItem.name);
                            setIsTopicDropdownOpen(false);
                          }}
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden">
                            <Image
                              src={topicItem.icon}
                              alt={topicItem.name}
                              className="w-full h-full object-cover"
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className="text-white font-medium">
                            {topicItem.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-3 sm:py-3 bg-[#242429] text-gray-300 hover:text-white transition-colors font-medium rounded-xl min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 sm:flex-initial px-6 sm:px-8 py-3 sm:py-3 text-white rounded-xl transition-colors font-semibold hover:opacity-90 min-h-[44px]"
                    style={{ backgroundColor: AppColors.teal }}
                  >
                    Stake & List Bet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBetModal;
