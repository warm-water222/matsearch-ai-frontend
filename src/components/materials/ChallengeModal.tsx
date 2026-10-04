"use client";

import React, { useState } from "react";
import { MessageSquareReply, X, Send, Sparkles, Loader2 } from "lucide-react";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (challengeText: string) => Promise<void>;
  searchId: string;
}

export default function ChallengeModal({
  isOpen,
  onClose,
  onSubmit,
  searchId,
}: ChallengeModalProps) {
  const [challengeText, setChallengeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(challengeText);
      setChallengeText("");
      onClose();
    } catch (err) {
      console.error("Challenge error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleChallenges = [
    "Prioritize ultra-low density (< 2.5 g/cm³) over band gap strictness.",
    "Search specifically for direct bandgap candidates only.",
    "Relax thermodynamic stability tolerance up to 0.05 eV/atom.",
    "Exclude expensive or scarce heavy elements (e.g. In, Ga).",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#12181F] border border-[#2A3C4D] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#18222C] border-b border-[#1F2D3A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareReply className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F1F5F9]">
              Challenge This Recommendation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Instruct the autonomous agent to re-evaluate the candidate space, modify priority weightings, or reconsider trade-offs from the Materials Project backend database.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono text-[#00E5FF] uppercase font-semibold">
              Critique / Re-evaluation Directive
            </label>
            <textarea
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="e.g. 'Silicon is an indirect bandgap material. Re-query the Materials Project database prioritizing direct bandgap phases with lower raw material costs'..."
              rows={3}
              className="w-full p-3 bg-[#0B0F12] border border-[#1F2D3A] text-xs text-[#F1F5F9] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] resize-none"
              required
            />
          </div>

          {/* Quick Challenge Templates */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-[#94A3B8]">
              Or select an engineering critique:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleChallenges.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setChallengeText(prompt)}
                  className="px-2 py-1 bg-[#18222C] hover:bg-[#1F2D3A] text-[#94A3B8] hover:text-[#00E5FF] border border-[#1F2D3A] text-[10px] font-mono transition-colors text-left"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#1F2D3A] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-[#18222C] border border-[#1F2D3A] text-xs text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !challengeText.trim()}
              className="px-4 py-1.5 bg-[#00E5FF] hover:bg-[#4CD6FB] text-[#0B0F12] font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Agent Re-evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Dispatch Challenge</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
