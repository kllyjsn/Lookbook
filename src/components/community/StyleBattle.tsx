import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Clock, Trophy, Flame } from "lucide-react";
import type { StyleBattle } from "../../data/mockData";

function formatVotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function BattleCard({ battle }: { battle: StyleBattle }) {
  const [voted, setVoted] = useState<"A" | "B" | null>(null);
  const totalVotes = battle.votesA + battle.votesB + (voted ? 1 : 0);
  const pctA = Math.round(((battle.votesA + (voted === "A" ? 1 : 0)) / totalVotes) * 100);
  const pctB = 100 - pctA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden bg-ivory border border-ink/5"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords size={14} className="text-rose" />
          <span className="text-xs font-inter font-semibold text-ink">{battle.title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={10} className="text-ink-muted" />
          <span className="text-[10px] font-inter text-ink-muted">{battle.endsAt} left</span>
        </div>
      </div>

      {/* Side-by-side looks */}
      <div className="flex gap-[2px]">
        {(["A", "B"] as const).map((side) => {
          const look = side === "A" ? battle.lookA : battle.lookB;
          const isVoted = voted === side;
          return (
            <motion.button
              key={side}
              whileTap={{ scale: 0.98 }}
              onClick={() => !voted && setVoted(side)}
              className={`relative flex-1 aspect-[3/4] overflow-hidden ${!voted ? "cursor-pointer" : "cursor-default"}`}
            >
              <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-white text-xs font-inter font-medium leading-tight">{look.title}</p>
                <div className="flex gap-1 mt-1">
                  {look.tags.slice(0, 1).map((tag) => (
                    <span key={tag.label} className="text-[8px] font-inter tracking-wider uppercase text-white/60 border border-white/20 rounded-full px-2 py-0.5">
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              {isVoted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center"
                >
                  <Trophy size={14} className="text-white" />
                </motion.div>
              )}
              {!voted && (
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-inter font-bold text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                    {side === "A" ? "THIS" : "THAT"}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Results bar (shows after voting) */}
      <AnimatePresence>
        {voted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 rounded-full bg-ink/10 overflow-hidden">
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: `${pctA}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-gold to-rose"
                />
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-inter">
              <span className={voted === "A" ? "text-ink font-semibold" : "text-ink-muted"}>
                {pctA}% · {formatVotes(battle.votesA + (voted === "A" ? 1 : 0))} votes
              </span>
              <span className={voted === "B" ? "text-ink font-semibold" : "text-ink-muted"}>
                {formatVotes(battle.votesB + (voted === "B" ? 1 : 0))} votes · {pctB}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vote CTA */}
      {!voted && (
        <div className="px-4 py-2.5 flex items-center justify-center gap-2">
          <Flame size={12} className="text-rose" />
          <span className="text-[10px] font-inter font-medium text-ink-muted tracking-wide">
            TAP YOUR PICK · {formatVotes(totalVotes)} votes
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function StyleBattles({ battles }: { battles: StyleBattle[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Swords size={16} className="text-ink" />
        <h2 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink">
          Style Battles
        </h2>
        <span className="text-[9px] font-inter text-rose font-semibold ml-auto">THIS OR THAT</span>
      </div>
      {battles.map((battle) => (
        <BattleCard key={battle.id} battle={battle} />
      ))}
    </div>
  );
}
