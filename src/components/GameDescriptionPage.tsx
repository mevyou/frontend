"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, GripVertical } from "lucide-react";
import { AppIcons } from "@/lib/appIcons";
import { AppImages } from "@/lib/appImages";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "./RichTextEditor";

interface GameDescriptionPageProps {
  gameId: string;
}

export function GameDescriptionPage({ gameId }: GameDescriptionPageProps) {
  const [outcomeType, setOutcomeType] = useState<"binary" | "multichoice">("multichoice");
  const [binaryType, setBinaryType] = useState<"yesno" | "custom">("yesno");
  const [customBinary, setCustomBinary] = useState({ option1: "", option2: "" });
  const [multichoiceOutcomes, setMultichoiceOutcomes] = useState<string[]>([
    "≥30M To <40M",
    "<30M", 
    "≥40M To <50M",
    "≥50M To <60M"
  ]);
  const [rules, setRules] = useState("");
  const [description, setDescription] = useState("");
  const [moderators, setModerators] = useState<string[]>([]);
  const [opponents, setOpponents] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("Sport");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const topics = [
    {
      name: "Sport",
      icon: AppImages.goldenBall,
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Politics",
      icon: AppImages.judgePill,
      color: "from-blue-400 to-purple-500",
    },
    {
      name: "Entertainment",
      icon: AppImages.casinoChips,
      color: "from-pink-400 to-red-500",
    },
    {
      name: "Technology",
      icon: AppImages.goldenCoin,
      color: "from-green-400 to-blue-500",
    },
    {
      name: "Finance",
      icon: AppImages.bitcoin,
      color: "from-purple-400 to-pink-500",
    },
  ];

  const handleAddModerator = () => {
    const address = prompt("Enter moderator address:");
    if (address && !moderators.includes(address)) {
      setModerators([...moderators, address]);
    }
  };

  const handleRemoveModerator = (index: number) => {
    setModerators(moderators.filter((_, i) => i !== index));
  };

  const handleAddOpponent = () => {
    const address = prompt("Enter opponent address:");
    if (address && !opponents.includes(address)) {
      setOpponents([...opponents, address]);
    }
  };

  const handleRemoveOpponent = (index: number) => {
    setOpponents(opponents.filter((_, i) => i !== index));
  };

  const addMultichoiceOutcome = () => {
    setMultichoiceOutcomes([...multichoiceOutcomes, ""]);
  };

  const updateMultichoiceOutcome = (index: number, value: string) => {
    const newOutcomes = [...multichoiceOutcomes];
    newOutcomes[index] = value;
    setMultichoiceOutcomes(newOutcomes);
  };

  const removeMultichoiceOutcome = (index: number) => {
    setMultichoiceOutcomes(multichoiceOutcomes.filter((_, i) => i !== index));
  };

  const getOutcomeColor = (index: number) => {
    const colors = [
      "bg-purple-600/20 text-purple-300",
      "bg-green-600/20 text-green-300", 
      "bg-orange-600/20 text-orange-300",
      "bg-cyan-600/20 text-cyan-300",
      "bg-pink-600/20 text-pink-300",
      "bg-yellow-600/20 text-yellow-300"
    ];
    return colors[index % colors.length];
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOutcomes = [...multichoiceOutcomes];
    const draggedItem = newOutcomes[draggedIndex];
    
    // Remove dragged item
    newOutcomes.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = dropIndex > draggedIndex ? dropIndex - 1 : dropIndex;
    newOutcomes.splice(insertIndex, 0, draggedItem);
    
    setMultichoiceOutcomes(newOutcomes);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 flex">
      {/* Left Panel - Create Market */}
      <div className="flex-1 p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
              <Image src={AppIcons.analytics} alt="Create" width={16} height={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold">Create Market</h1>
              <p className="text-gray-400 text-sm">Create public market</p>
            </div>
          </div>

          {/* Bet Question */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">What will be the transfer fee for Salah in the next window?</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your bet question..."
              className="w-full px-4 py-3 bg-neutral-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Outcome Type Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold">Outcome type</h3>
              <ChevronDown className="text-gray-400" size={16} />
            </div>
            
            {/* Binary Options */}
            <div className="grid grid-cols-2 gap-4">
              <label className={cn(
                "flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                outcomeType === "binary" 
                  ? "border-cyan-400 bg-cyan-400/5" 
                  : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    name="outcomeType"
                    checked={outcomeType === "binary"}
                    onChange={() => setOutcomeType("binary")}
                    className="w-4 h-4 text-cyan-400 bg-neutral-800 border-neutral-600 focus:ring-cyan-400"
                  />
                  <div className="text-white font-medium">Yes/No</div>
                  <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    Binary outcomes
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Only two possible outcomes, Yes or No.</div>
              </label>

              <label className={cn(
                "flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all",
                outcomeType === "multichoice" 
                  ? "border-cyan-400 bg-cyan-400/5" 
                  : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    name="outcomeType"
                    checked={outcomeType === "multichoice"}
                    onChange={() => setOutcomeType("multichoice")}
                    className="w-4 h-4 text-cyan-400 bg-neutral-800 border-neutral-600 focus:ring-cyan-400"
                  />
                  <div className="text-white font-medium">Multi-choice</div>
                  <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                    Custom outcomes
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Two or more customizable labels.</div>
              </label>
            </div>

            {/* Binary Custom Options */}
            {outcomeType === "binary" && (
              <div className="ml-7 space-y-3">
                <div className="flex gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="binaryType"
                      checked={binaryType === "yesno"}
                      onChange={() => setBinaryType("yesno")}
                      className="w-4 h-4 text-cyan-400"
                    />
                    <span className="text-white text-sm">Yes/No</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="binaryType"
                      checked={binaryType === "custom"}
                      onChange={() => setBinaryType("custom")}
                      className="w-4 h-4 text-cyan-400"
                    />
                    <span className="text-white text-sm">Custom Binary</span>
                  </label>
                </div>

                {binaryType === "custom" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customBinary.option1}
                      onChange={(e) => setCustomBinary({ ...customBinary, option1: e.target.value })}
                      placeholder="Option 1 (e.g., Buy/Sell)"
                      className="flex-1 px-3 py-2 bg-neutral-800 rounded-lg text-white placeholder-gray-400 text-sm"
                    />
                    <input
                      type="text"
                      value={customBinary.option2}
                      onChange={(e) => setCustomBinary({ ...customBinary, option2: e.target.value })}
                      placeholder="Option 2 (e.g., Live/Die)"
                      className="flex-1 px-3 py-2 bg-neutral-800 rounded-lg text-white placeholder-gray-400 text-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Multi-choice Outcomes */}
            {outcomeType === "multichoice" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {multichoiceOutcomes.map((outcome, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg transition-all",
                        draggedIndex === index ? "opacity-50" : "",
                        dragOverIndex === index ? "bg-cyan-400/10" : ""
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="w-6 h-6 flex items-center justify-center cursor-move text-gray-400 hover:text-white">
                        <GripVertical size={16} />
                      </div>
                      <div className={cn("flex-1 px-3 py-2 rounded-lg text-sm font-medium", getOutcomeColor(index))}>
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => updateMultichoiceOutcome(index, e.target.value)}
                          placeholder={`Outcome ${index + 1}`}
                          className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        />
                      </div>
                      {multichoiceOutcomes.length > 2 && (
                        <button
                          onClick={() => removeMultichoiceOutcome(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addMultichoiceOutcome}
                  className="flex items-center gap-2 text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                >
                  <span className="text-lg">+</span>
                  Add more outcome
                </button>
              </div>
            )}
          </div>

          {/* Rules Section with Rich Text Editor */}
          <div className="space-y-3">
            <h3 className="text-white text-lg font-semibold">Rules</h3>
            <RichTextEditor value={rules} onChange={setRules} placeholder="Describe the rules..." />

            {/* Topic Selector */}
            <div className="flex items-center gap-4 relative">
              <span className="text-white font-medium">Topic:</span>
              <div
                className="flex items-center gap-3 bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700 cursor-pointer hover:border-neutral-600 transition-colors"
                onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
              >
                {(() => {
                  const currentTopic = topics.find((t) => t.name === selectedTopic) || topics[0];
                  return (
                    <>
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={currentTopic.icon}
                          alt={currentTopic.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white font-medium flex-1">
                        {currentTopic.name}
                      </span>
                      <ChevronDown
                        className={`text-gray-400 transition-transform ${isTopicDropdownOpen ? "rotate-180" : ""}`}
                        size={16}
                      />
                    </>
                  );
                })()}
              </div>

              {/* Topic Dropdown */}
              {isTopicDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 w-64 bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden z-10">
                  {topics.map((topicItem) => (
                    <div
                      key={topicItem.name}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-700 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedTopic(topicItem.name);
                        setIsTopicDropdownOpen(false);
                      }}
                    >
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={topicItem.icon}
                          alt={topicItem.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-white font-medium">{topicItem.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 p-6 bg-neutral-800/50">
        <div className="max-w-md mx-auto">
          <div className="bg-neutral-900 rounded-xl p-4 space-y-4">
            {/* Preview Header */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                <Image src={AppIcons.checkmark} alt="In-House" width={12} height={12} />
              </div>
              <span className="text-gray-400 text-sm">In-House created</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Image src={AppIcons.coins} alt="All Tokens" width={16} height={16} />
              <span className="text-gray-400 text-sm">All Tokens</span>
            </div>

            {/* Preview Question */}
            <div className="text-white text-lg font-semibold">
              Will Oscar Piastri win the F1 Drivers Championship 2025?
            </div>

            {/* Preview Outcomes */}
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg">
                <span className="text-white text-sm font-medium">{`≥30M To <40M`}</span>
                <span className="text-gray-400 text-sm">55.5%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-800 rounded-lg">
                <span className="text-white text-sm font-medium">{`<30M`}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">21.1%</span>
                  <button className="px-3 py-1 bg-cyan-400 text-zinc-800 rounded text-sm font-medium">
                    Stake
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border border-neutral-800"></div>
                  <div className="w-6 h-6 bg-green-500 rounded-full border border-neutral-800"></div>
                </div>
                <span className="text-gray-400 text-xs">+104</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src={AppIcons.coins} alt="Total" width={12} height={12} />
                <span className="text-gray-400 text-xs">$9.01k</span>
              </div>
              <div className="flex items-center gap-1">
                <Image src={AppIcons.timer} alt="Date" width={12} height={12} />
                <span className="text-gray-400 text-xs">Aug 25</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <button className="px-6 py-2 bg-neutral-800 text-white rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-gradient-to-b from-white/20 to-white/0 text-white rounded-lg text-sm font-medium hover:from-white/30 hover:to-white/10 transition-colors">
          List Market
        </button>
      </div>
    </div>
  );
}
