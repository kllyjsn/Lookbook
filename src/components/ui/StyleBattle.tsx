import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Crown } from "lucide-react";
import { feedLooks } from "../../data/mockData";
import type { StyleBattle as StyleBattleType } from "../../data/mockData";

interface StyleBattleProps {
  battle: StyleBattleType;
  onVote: (battleId: string, side: "A" | "B") => void;
  voted?: "A" | "B" | null;
}

export function StyleBattle({ battle, onVote, voted }: StyleBattleProps) {
  const lookA = feedLooks.find((l) => l.id === battle.lookA);
  const lookB = feedLooks.find((l) => l.id === battle.lookB);
  const [localVote, setLocalVote] = useState<"A" | "B" | null>(voted ?? null);

  if (!lookA || !lookB) return null;

  const totalVotes = battle.votesA + battle.votesB + (localVote ? 1 : 0);
  const pctA = Math.round(((battle.votesA + (localVote === "A" ? 1 : 0)) / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleVote = (side: "A" | "B") => {
    if (localVote) return;
    setLocalVote(side);
    onVote(battle.id, side);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-3 rounded-2xl bg-ivory border border-ink/5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 py-3 px-4">
        <Swords size={14} className="text-gold" />
        <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-ink-muted font-semibold">
          This or That
        </span>
        <Swords size={14} className="text-gold" />
      </div>

      <p className="text-center font-editorial text-base text-ink px-4 -mt-1 mb-3">
        {battle.title}
      </p>

      {/* Battle images */}
      <div className="flex gap-2 px-3 pb-3">
        <motion.button
          whileTap={!localVote ? { scale: 0.97 } : undefined}
          onClick={() => handleVote("A")}
          className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden"
        >
          <img src={lookA.image} alt={lookA.title} className="img-editorial" />
          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
            <p className="text-white text-xs font-inter font-medium">{lookA.title}</p>
          </div>
          {localVote === "A" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gold flex items-center justify-center"
            >
              <Crown size={14} className="text-white" />
            </motion.div>
          )}
          <AnimatePresence>
            {localVote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-x-0 top-0 p-2"
              >
                <div className="bg-black/50 backdrop-blur-sm rounded-lg py-1.5 px-3 text-center">
                  <span className="text-white text-lg font-editorial font-bold">{pctA}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={!localVote ? { scale: 0.97 } : undefined}
          onClick={() => handleVote("B")}
          className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden"
        >
          <img src={lookB.image} alt={lookB.title} className="img-editorial" />
          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
            <p className="text-white text-xs font-inter font-medium">{lookB.title}</p>
          </div>
          {localVote === "B" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gold flex items-center justify-center"
            >
              <Crown size={14} className="text-white" />
            </motion.div>
          )}
          <AnimatePresence>
            {localVote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-x-0 top-0 p-2"
              >
                <div className="bg-black/50 backdrop-blur-sm rounded-lg py-1.5 px-3 text-center">
                  <span className="text-white text-lg font-editorial font-bold">{pctB}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Vote bar */}
      <AnimatePresence>
        {localVote && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="px-3 pb-3"
          >
            <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pctA}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gold rounded-full"
              />
            </div>
            <p className="text-center text-[10px] font-inter text-ink-muted mt-2">
              {totalVotes.toLocaleString()} votes
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
