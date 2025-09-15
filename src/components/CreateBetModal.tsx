"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { X, Plus, Minus, Calendar, DollarSign, FileText } from "lucide-react";
import { useCreateBet } from "@/hooks/useBetting";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { AppIcons } from "@/lib/assets";
import { PredictionCard } from "./PredictionCard";
import { Bet } from "@/lib/contracts/BettingContract";
import Image from "next/image";

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateBetModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBetModalProps) {
  const { address, isConnected } = useAccount();
  const { createBet, isPending, isSuccess } = useCreateBet();
  const [formData, setFormData] = useState({
    topic: "",
    outcomeType: "yes-no" as "yes-no" | "multi-choice",
    outcomes: ["Yes", "No"],
    rules: "",
    amount: "",
    deadline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewBet, setPreviewBet] = useState<Bet | null>(null);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Bet created successfully!");
      onSuccess();
      resetForm();
    }
  }, [isSuccess, onSuccess]);

  const resetForm = () => {
    setFormData({ 
      topic: "", 
      outcomeType: "yes-no", 
      outcomes: ["Yes", "No"], 
      rules: "", 
      amount: "", 
      deadline: "" 
    });
    setErrors({});
    setPreviewBet(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.topic.trim()) {
      newErrors.topic = "Topic is required";
    } else if (formData.topic.length < 10) {
      newErrors.topic = "Topic must be at least 10 characters";
    } else if (formData.topic.length > 200) {
      newErrors.topic = "Topic must be less than 200 characters";
    }

    if (formData.outcomes.length < 2) {
      newErrors.outcomes = "At least 2 outcomes are required";
    } else if (formData.outcomes.some(outcome => !outcome.trim())) {
      newErrors.outcomes = "All outcomes must have text";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Amount must be a positive number";
      } else if (amount < 0.001) {
        newErrors.amount = "Minimum amount is 0.001 ETH";
      } else if (amount > 100) {
        newErrors.amount = "Maximum amount is 100 ETH";
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadline = new Date(formData.deadline);
      const now = new Date();
      const minDeadline = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const maxDeadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      if (deadline <= minDeadline) {
        newErrors.deadline = "Deadline must be at least 1 hour from now";
      } else if (deadline > maxDeadline) {
        newErrors.deadline = "Deadline cannot be more than 30 days from now";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const deadline = new Date(formData.deadline).getTime();
    await createBet(formData.topic, formData.amount, deadline);
  };

  const handleClose = () => {
    if (!isPending) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  // Get minimum datetime (1 hour from now)
  const minDateTime = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  // Get maximum datetime (30 days from now)
  const maxDateTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const addOutcome = () => {
    if (formData.outcomes.length < 6) {
      setFormData({
        ...formData,
        outcomes: [...formData.outcomes, ""]
      });
    }
  };

  const removeOutcome = (index: number) => {
    if (formData.outcomes.length > 2) {
      const newOutcomes = formData.outcomes.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        outcomes: newOutcomes
      });
    }
  };

  const updateOutcome = (index: number, value: string) => {
    const newOutcomes = [...formData.outcomes];
    newOutcomes[index] = value;
    setFormData({
      ...formData,
      outcomes: newOutcomes
    });
  };

  const handleOutcomeTypeChange = (type: "yes-no" | "multi-choice") => {
    setFormData({
      ...formData,
      outcomeType: type,
      outcomes: type === "yes-no" ? ["Yes", "No"] : ["Option 1", "Option 2"]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1A1A1E] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ border: '1px solid #242429' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#242429' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center">
              <Image src={AppIcons.plusSign} alt="Create" width={20} height={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-nunito-sans">
                Create Custom Bet
              </h2>
              <p className="text-gray-400 text-sm">Create your own bet for anyone to join</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex">
          {/* Left Side - Form */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Enter topic...
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  placeholder="Enter topic..."
                  className={cn(
                    "w-full px-4 py-3 bg-[#242429] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4AA]",
                    errors.topic
                      ? "border-red-500"
                      : "border-[#242429]"
                  )}
                  disabled={isPending}
                />
                {errors.topic && (
                  <p className="text-red-400 text-sm mt-1">{errors.topic}</p>
                )}
              </div>

              {/* Outcome Type */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Outcome type
                </label>
                <div className="space-y-3">
                  <div 
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-colors",
                      formData.outcomeType === "yes-no" 
                        ? "border-[#00D4AA] bg-[#00D4AA]/10" 
                        : "border-[#242429] bg-[#242429]"
                    )}
                    onClick={() => handleOutcomeTypeChange("yes-no")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        formData.outcomeType === "yes-no" 
                          ? "border-[#00D4AA] bg-[#00D4AA]" 
                          : "border-gray-400"
                      )}>
                        {formData.outcomeType === "yes-no" && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">Yes/No</div>
                        <div className="text-gray-400 text-sm">Only two outcomes: Yes or No</div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-colors",
                      formData.outcomeType === "multi-choice" 
                        ? "border-[#00D4AA] bg-[#00D4AA]/10" 
                        : "border-[#242429] bg-[#242429]"
                    )}
                    onClick={() => handleOutcomeTypeChange("multi-choice")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2",
                        formData.outcomeType === "multi-choice" 
                          ? "border-[#00D4AA] bg-[#00D4AA]" 
                          : "border-gray-400"
                      )}>
                        {formData.outcomeType === "multi-choice" && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">Multi-choice</div>
                        <div className="text-gray-400 text-sm">Multiple outcomes to choose from</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outcomes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white text-sm font-medium">
                    {formData.outcomeType === "yes-no" ? "Outcomes" : "Add outcomes"}
                  </label>
                  {formData.outcomeType === "multi-choice" && formData.outcomes.length < 6 && (
                    <button
                      type="button"
                      onClick={addOutcome}
                      className="text-[#00D4AA] text-sm font-medium hover:text-[#00B894] transition-colors"
                    >
                      + Add more outcome
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {formData.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => updateOutcome(index, e.target.value)}
                          placeholder={`Enter outcome...`}
                          className="w-full px-4 py-3 bg-[#242429] border border-[#242429] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4AA]"
                          disabled={isPending || (formData.outcomeType === "yes-no")}
                        />
                      </div>
                      {formData.outcomeType === "multi-choice" && formData.outcomes.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOutcome(index)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Minus size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.outcomes && (
                  <p className="text-red-400 text-sm mt-1">{errors.outcomes}</p>
                )}
              </div>

              {/* Rules */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Rules
                </label>
                <textarea
                  value={formData.rules}
                  onChange={(e) =>
                    setFormData({ ...formData, rules: e.target.value })
                  }
                  placeholder="Describe the rules..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#242429] border border-[#242429] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] resize-none"
                  disabled={isPending}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Stake Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="100"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.1"
                  className={cn(
                    "w-full px-4 py-3 bg-[#242429] border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D4AA]",
                    errors.amount
                      ? "border-red-500"
                      : "border-[#242429]"
                  )}
                  disabled={isPending}
                />
                {errors.amount && (
                  <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Bet Deadline
                </label>
                <input
                  type="datetime-local"
                  min={minDateTime}
                  max={maxDateTime}
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className={cn(
                    "w-full px-4 py-3 bg-[#242429] border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA]",
                    errors.deadline
                      ? "border-red-500"
                      : "border-[#242429]"
                  )}
                  disabled={isPending}
                />
                {errors.deadline && (
                  <p className="text-red-400 text-sm mt-1">{errors.deadline}</p>
                )}
              </div>

              {/* Wallet Connection Warning */}
              {!isConnected && (
                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm">
                    Please connect your wallet to create a bet
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="px-6 py-3 bg-[#242429] hover:bg-[#2A2A2F] disabled:bg-[#242429]/50 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || !isConnected}
                  className="px-6 py-3 bg-[#00D4AA] hover:bg-[#00B894] disabled:bg-[#00D4AA]/50 text-white rounded-lg font-medium transition-colors"
                >
                  {isPending ? "Creating..." : "Save & List Bet"}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Preview */}
          <div className="w-80 p-6 border-l" style={{ borderColor: '#242429' }}>
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2">Preview</h3>
              <p className="text-gray-400 text-sm">This is how your bet will appear</p>
            </div>
            
            {formData.topic && (
              <div className="space-y-4">
                <PredictionCard 
                  bet={{
                    id: "preview",
                    creator: "0x0000000000000000000000000000000000000000",
                    description: formData.topic,
                    amount: formData.amount || "0",
                    deadline: formData.deadline ? new Date(formData.deadline).getTime() : Date.now() + 86400000,
                    isActive: true,
                    winner: null,
                    participants: [],
                    createdAt: Date.now()
                  }}
                  onClick={() => {}}
                />
              </div>
            )}
            
            {!formData.topic && (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-600 rounded-lg">
                <div className="text-center">
                  <div className="text-gray-500 mb-2">
                    <FileText size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-400 text-sm">Enter a topic to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
