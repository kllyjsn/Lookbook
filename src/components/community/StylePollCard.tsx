import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StylePoll } from "../../data/communityData";

function formatVotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function StylePollCard({ poll }: { poll: StylePoll }) {
  const [voted, setVoted] = useState<"a" | "b" | null>(null);

  const handleVote = (choice: "a" | "b") => {
    if (voted) return;
    setVoted(choice);
  };

  const aVotes = poll.optionA.votes + (voted === "a" ? 1 : 0);
  const bVotes = poll.optionB.votes + (voted === "b" ? 1 : 0);
  const total = aVotes + bVotes;
  const aPct = Math.round((aVotes / total) * 100);
  const bPct = 100 - aPct;

  return (
    <div className="rounded-2xl overflow-hidden border border-ink/5 bg-cream">
      <div className="px-4 py-3">
        <p className="text-sm font-editorial text-ink">{poll.question}</p>
        <p className="text-[10px] font-inter text-ink-muted mt-0.5">
          {formatVotes(total)} votes
        </p>
      </div>
      <div className="flex gap-px bg-ink/5">
        {(["a", "b"] as const).map((side) => {
          const option = side === "a" ? poll.optionA : poll.optionB;
          const pct = side === "a" ? aPct : bPct;
          const isSelected = voted === side;

          return (
            <motion.button
              key={side}
              whileTap={{ scale: voted ? 1 : 0.98 }}
              onClick={() => handleVote(side)}
              className={`relative flex-1 overflow-hidden ${
                voted ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <div className="relative aspect-square">
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-inter font-medium text-white leading-tight">
                    {option.label}
                  </p>
                  <AnimatePresence>
                    {voted && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5"
                      >
                        <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isSelected ? "bg-gold" : "bg-white/50"
                            }`}
                          />
                        </div>
                        <p className={`text-[11px] font-inter mt-1 ${
                          isSelected ? "font-bold text-gold" : "text-white/70"
                        }`}>
                          {pct}%
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                  >
                    <span className="text-white text-[10px] font-bold">Y</span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
