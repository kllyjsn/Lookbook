import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StylePoll } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface StylePollCardProps {
  poll: StylePoll;
}

export function StylePollCard({ poll }: StylePollCardProps) {
  const pollVotes = useStore((s) => s.pollVotes);
  const votePoll = useStore((s) => s.votePoll);
  const [localVote, setLocalVote] = useState<"A" | "B" | null>(
    pollVotes[poll.id] ?? null
  );

  const totalVotes = poll.optionA.votes + poll.optionB.votes;
  const pctA = totalVotes === 0 ? 50 : Math.round((poll.optionA.votes / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleVote = (choice: "A" | "B") => {
    if (localVote) return;
    setLocalVote(choice);
    votePoll(poll.id, choice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden bg-ivory border border-ink/5"
    >
      <div className="p-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-inter font-bold tracking-[0.2em] uppercase text-gold">
            THIS OR THAT
          </span>
          <span className="text-[9px] font-inter text-ink-muted">
            {formatCount(totalVotes)} votes
          </span>
        </div>
        <h3 className="font-editorial text-lg text-ink leading-tight">
          {poll.question}
        </h3>
      </div>

      <div className="flex gap-2 px-4 pb-4">
        {(["A", "B"] as const).map((side) => {
          const option = side === "A" ? poll.optionA : poll.optionB;
          const pct = side === "A" ? pctA : pctB;
          const isSelected = localVote === side;
          const hasVoted = localVote !== null;

          return (
            <motion.button
              key={side}
              whileTap={!hasVoted ? { scale: 0.97 } : undefined}
              onClick={() => handleVote(side)}
              className={`relative flex-1 rounded-xl overflow-hidden aspect-[3/4] ${
                isSelected ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory" : ""
              }`}
            >
              <img
                src={option.image}
                alt={option.label}
                className="img-editorial"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-white text-xs font-inter font-medium text-left">
                  {option.label}
                </p>
                <AnimatePresence>
                  {hasVoted && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "100%" }}
                      className="mt-2"
                    >
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            isSelected ? "bg-gold" : "bg-white/50"
                          }`}
                        />
                      </div>
                      <p className={`text-[10px] font-inter mt-1 ${
                        isSelected ? "text-gold font-bold" : "text-white/60"
                      }`}>
                        {pct}%
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
