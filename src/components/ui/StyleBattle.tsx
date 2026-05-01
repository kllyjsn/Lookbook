import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Crown, Zap } from "lucide-react";
import { feedLooks } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

interface Battle {
  id: string;
  title: string;
  lookA: typeof feedLooks[0];
  lookB: typeof feedLooks[0];
  votesA: number;
  votesB: number;
}

function generateBattles(): Battle[] {
  const pairs: [number, number][] = [[0, 5], [2, 11], [7, 6], [8, 3]];
  return pairs.map(([a, b], i) => ({
    id: `battle-${i}`,
    title: ["Minimalist vs Streetwear", "Street Luxe vs Tokyo Chic", "Power Suit vs Garden Party", "Quiet Luxury vs Après Noir"][i],
    lookA: feedLooks[a],
    lookB: feedLooks[b],
    votesA: [4280, 3190, 5670, 8120][i],
    votesB: [3960, 4810, 2340, 3490][i],
  }));
}

const battles = generateBattles();

export function StyleBattle() {
  const [currentBattle, setCurrentBattle] = useState(0);
  const battleVotes = useStore((s) => s.battleVotes);
  const voteBattle = useStore((s) => s.voteBattle);

  const battle = battles[currentBattle];
  const userVote = battleVotes[battle.id];
  const totalVotes = battle.votesA + battle.votesB + (userVote ? 1 : 0);
  const pctA = Math.round(((battle.votesA + (userVote === battle.lookA.id ? 1 : 0)) / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleVote = (lookId: string) => {
    if (userVote) return;
    voteBattle(battle.id, lookId);
  };

  const nextBattle = () => {
    setCurrentBattle((prev) => (prev + 1) % battles.length);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-rose" />
          <h3 className="font-editorial text-lg text-ink">Style Battle</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={nextBattle}
          className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted"
        >
          Next →
        </motion.button>
      </div>

      <p className="text-xs font-inter text-ink-muted mb-3">{battle.title}</p>

      <div className="flex gap-3">
        {[
          { look: battle.lookA, pct: pctA, side: "A" as const },
          { look: battle.lookB, pct: pctB, side: "B" as const },
        ].map(({ look, pct, side }) => {
          const isVoted = userVote === look.id;
          const isOther = userVote && !isVoted;
          return (
            <motion.div
              key={look.id}
              whileTap={!userVote ? { scale: 0.97 } : undefined}
              onClick={() => handleVote(look.id)}
              className={`relative flex-1 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer ${
                isOther ? "opacity-50" : ""
              }`}
            >
              <img
                src={look.image}
                alt={look.title}
                className="img-editorial"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="font-editorial text-sm text-white leading-tight mb-1">
                  {look.title}
                </p>
                <AnimatePresence>
                  {userVote && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className={`h-full rounded-full ${isVoted ? "bg-gold" : "bg-white/50"}`}
                        />
                      </div>
                      <span className="text-[10px] font-inter font-bold text-white">
                        {pct}%
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {isVoted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                >
                  <Crown size={12} className="text-white" />
                </motion.div>
              )}
              {!userVote && (
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-inter font-bold tracking-wider uppercase bg-white/20 backdrop-blur-sm text-white rounded-full px-2 py-0.5">
                    {side}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!userVote && (
        <p className="text-center text-[10px] font-inter text-ink-muted mt-2 flex items-center justify-center gap-1">
          <Zap size={10} />
          Tap your pick — results revealed instantly
        </p>
      )}
    </div>
  );
}
