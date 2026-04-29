import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronRight, X } from "lucide-react";
import { thisOrThatPairs } from "../../data/trendData";
import type { ThisOrThat as ThisOrThatType } from "../../data/trendData";

function formatVotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function ThisOrThatCard({
  pair,
  onClose,
}: {
  pair: ThisOrThatType;
  onClose: () => void;
}) {
  const [voted, setVoted] = useState<"a" | "b" | null>(null);
  const totalVotes = pair.optionA.votes + pair.optionB.votes;
  const pctA = Math.round((pair.optionA.votes / totalVotes) * 100);
  const pctB = 100 - pctA;

  const handleVote = (choice: "a" | "b") => {
    if (voted) return;
    setVoted(choice);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-ink flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3 z-10">
        <div>
          <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-white/40">
            THIS OR THAT
          </span>
          <h2 className="font-editorial text-xl text-white mt-0.5">
            {pair.title}
          </h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X size={18} className="text-white" />
        </motion.button>
      </div>

      {/* Two options */}
      <div className="flex-1 flex flex-col gap-2 px-4 pb-8">
        {/* Option A */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleVote("a")}
          className="relative flex-1 rounded-2xl overflow-hidden"
        >
          <img src={pair.optionA.image} alt={pair.optionA.label} className="img-editorial" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-editorial text-2xl text-white mb-1">{pair.optionA.label}</p>
            <AnimatePresence>
              {voted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctA}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${voted === "a" ? "bg-gold" : "bg-white/50"}`}
                    />
                  </div>
                  <span className={`text-sm font-inter font-semibold ${voted === "a" ? "text-gold" : "text-white/60"}`}>
                    {pctA}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {voted === "a" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold flex items-center justify-center"
            >
              <span className="text-white text-sm font-inter font-bold">✓</span>
            </motion.div>
          )}
        </motion.button>

        {/* VS badge */}
        <div className="flex items-center justify-center -my-4 z-10">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            <span className="text-ink text-xs font-inter font-bold">VS</span>
          </div>
        </div>

        {/* Option B */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleVote("b")}
          className="relative flex-1 rounded-2xl overflow-hidden"
        >
          <img src={pair.optionB.image} alt={pair.optionB.label} className="img-editorial" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-editorial text-2xl text-white mb-1">{pair.optionB.label}</p>
            <AnimatePresence>
              {voted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctB}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${voted === "b" ? "bg-gold" : "bg-white/50"}`}
                    />
                  </div>
                  <span className={`text-sm font-inter font-semibold ${voted === "b" ? "text-gold" : "text-white/60"}`}>
                    {pctB}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {voted === "b" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gold flex items-center justify-center"
            >
              <span className="text-white text-sm font-inter font-bold">✓</span>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Footer stats */}
      <AnimatePresence>
        {voted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-8"
          >
            <p className="text-center text-xs font-inter text-white/40">
              {formatVotes(totalVotes)} votes
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ThisOrThatBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="w-full px-4 pb-3"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-lavender/20 to-gold/20 border border-ink/5">
        <div className="w-8 h-8 rounded-full bg-lavender/30 flex items-center justify-center">
          <Flame size={14} className="text-lavender" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs font-inter font-medium text-ink">This or That</p>
          <p className="text-[10px] font-inter text-ink-muted">Vote on today's style dilemma</p>
        </div>
        <ChevronRight size={14} className="text-ink-muted" />
      </div>
    </motion.button>
  );
}

export function ThisOrThatOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [pairIndex, setPairIndex] = useState(0);

  const open = () => {
    setIsOpen(true);
    setPairIndex(0);
  };

  const handleClose = () => {
    if (pairIndex < thisOrThatPairs.length - 1) {
      setPairIndex((i) => i + 1);
    } else {
      setIsOpen(false);
      setPairIndex(0);
    }
  };

  return (
    <>
      <ThisOrThatBanner onOpen={open} />
      <AnimatePresence>
        {isOpen && (
          <ThisOrThatCard
            key={thisOrThatPairs[pairIndex].id}
            pair={thisOrThatPairs[pairIndex]}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
