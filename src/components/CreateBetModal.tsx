import React, { useState } from "react";
import { X, ChevronDown, Plus, GripVertical } from "lucide-react";
import { AppIcons } from "../lib/appIcons";
import { AppImages } from "../lib/appImages";
import { AppColors } from "../lib/appColors";
import { PredictionCard } from "./PredictionCard";
import { Bet } from "../lib/contracts/BettingContract";

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBet: (betData: any) => void;
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
  const [selectedTopic, setSelectedTopic] = useState("Sport");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);

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
    const betData = {
      topic,
      outcomeType,
      outcomes,
      selectedTopic,
    };
    onCreateBet(betData);
  };

  const addOutcome = () => {
    setOutcomes([...outcomes, ""]);
  };

  const removeOutcome = (index: number) => {
    if (outcomes.length > 2) {
      setOutcomes(outcomes.filter((_, i) => i !== index));
    }
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...outcomes];
    newOutcomes[index] = value;
    setOutcomes(newOutcomes);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsTopicDropdownOpen(false);
        }
      }}
    >
      <div className="bg-[#121214] rounded-2xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="relative px-8 py-10 text-center">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-[#20B2AA] rounded-full flex items-center justify-center">
            <Plus className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-white text-2xl font-semibold mb-3">
            Suggest market
          </h2>
          <p className="text-gray-400 text-base">Create public market</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Topic Input */}
          <div className="mb-8">
            <div className="bg-[#2a2a2a] rounded-xl px-6 py-4 border border-[#19191C]">
              <input
                type="text"
                placeholder="Enter topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none text-base"
              />
            </div>
          </div>

          {/* Outcome Type */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Outcome type</h3>
              <ChevronDown className="text-gray-400" size={24} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Yes/No Option */}
              <div
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  outcomeType === "yes-no"
                    ? "border-[#20B2AA] bg-[#20B2AA]/10"
                    : "border-gray-700 bg-[#2a2a2a] hover:border-gray-600"
                }`}
                onClick={() => setOutcomeType("yes-no")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                      outcomeType === "yes-no"
                        ? "border-[#20B2AA] bg-[#20B2AA]"
                        : "border-gray-500"
                    }`}
                  >
                    {outcomeType === "yes-no" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-semibold">Yes/No</span>
                      <span className="px-3 py-1 bg-[#1A1A1E] text-[#20B2AA] text-xs rounded-full font-medium">
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
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  outcomeType === "multi-choice"
                    ? "border-[#20B2AA] bg-[#20B2AA]/10"
                    : "border-gray-700 bg-[#2a2a2a] hover:border-gray-600"
                }`}
                onClick={() => setOutcomeType("multi-choice")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${
                      outcomeType === "multi-choice"
                        ? "border-[#20B2AA] bg-[#20B2AA]"
                        : "border-gray-500"
                    }`}
                  >
                    {outcomeType === "multi-choice" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-semibold">
                        Multi-choice
                      </span>
                      <span className="px-3 py-1 bg-[#1A1A1E] text-[#20B2AA] text-xs rounded-full font-medium">
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
              <div className="space-y-3">
                {outcomes.map((outcome, index) => {
                  const cardStyles = [
                    { backgroundColor: "#7086FD1A" },
                    { backgroundColor: "#6FD1951A" },
                    { backgroundColor: "#FFAE4C1A" },
                    { backgroundColor: "#07DBFA1A" },
                  ];
                  return (
                    <div key={index} className="flex items-center gap-4 group">
                      <div className="cursor-grab active:cursor-grabbing hover:bg-gray-700/50 rounded p-1 transition-colors">
                        <GripVertical
                          className="text-gray-500 group-hover:text-gray-400"
                          size={20}
                        />
                      </div>
                      <div
                        className="flex-1 rounded-xl px-6 py-4 shadow-lg relative overflow-hidden"
                        style={cardStyles[index % 4]}
                      >
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => updateOutcome(index, e.target.value)}
                          className="w-full bg-transparent text-white outline-none font-medium placeholder-white/70"
                          placeholder="Enter outcome"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addOutcome}
                className="flex items-center gap-2 text-[#20B2AA] hover:text-[#20B2AA]/80 mt-6 font-medium"
              >
                <Plus size={18} />
                <span>Add more outcome</span>
              </button>
            </div>
          )}

          {/* Footer with Topic and Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-[#19191C]">
            <div className="flex items-center gap-4 relative">
              <span className="text-white font-medium">Topic:</span>
              <div
                className="flex items-center gap-3 bg-[#121214] rounded-2xl px-4 py-3 border border-[#0E4D4F] cursor-pointer hover:border-[#0E4D4F]/80 transition-colors"
                onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
              >
                {(() => {
                  const currentTopic =
                    topics.find((t) => t.name === selectedTopic) || topics[0];
                  return (
                    <>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <img
                          src={currentTopic.icon}
                          alt={currentTopic.name}
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                      <span className="text-white font-medium">
                        {selectedTopic}
                      </span>
                      <ChevronDown
                        className={`text-gray-400 transition-transform ${
                          isTopicDropdownOpen ? "rotate-180" : ""
                        }`}
                        size={16}
                      />
                    </>
                  );
                })()}
              </div>

              {/* Topic Dropdown */}
              {isTopicDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-[#121214] border border-[#0E4D4F] rounded-2xl shadow-lg z-50 min-w-[200px]">
                  {topics.map((topic) => (
                    <div
                      key={topic.name}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#3a3a3a] cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                      onClick={() => {
                        setSelectedTopic(topic.name);
                        setIsTopicDropdownOpen(false);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <img
                          src={topic.icon}
                          alt={topic.name}
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                      <span className="text-white font-medium">
                        {topic.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#242429] text-gray-300 hover:text-white transition-colors font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#20B2AA] text-white rounded-xl hover:bg-[#20B2AA]/90 transition-colors font-semibold"
              >
                Suggest Market
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBetModal;
