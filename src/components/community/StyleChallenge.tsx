import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Users, Heart, X, ChevronRight, Flame } from "lucide-react";
import type { StyleChallenge as StyleChallengeType } from "../../data/trendData";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function ChallengeDetail({
  challenge,
  onClose,
}: {
  challenge: StyleChallengeType;
  onClose: () => void;
}) {
  const [votedEntries, setVotedEntries] = useState<Set<string>>(new Set());

  const toggleVote = (entryId: string) => {
    setVotedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto pb-24">
        {/* Hero */}
        <div className="relative w-full aspect-[16/9]">
          <img src={challenge.coverImage} alt={challenge.title} className="img-editorial" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={14} className="text-gold" />
              <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold">
                STYLE CHALLENGE
              </span>
            </div>
            <h1 className="font-editorial text-3xl text-white leading-tight">
              {challenge.title}
            </h1>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <X size={18} className="text-ink" />
          </motion.button>
        </div>

        {/* Description + stats */}
        <div className="px-6 py-6">
          <p className="font-subhead text-lg text-ink-light italic leading-relaxed mb-4">
            {challenge.description}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-xs font-inter text-ink-muted">
              <Clock size={12} />
              {challenge.deadline}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-inter text-ink-muted">
              <Users size={12} />
              {formatCount(challenge.participants)} entries
            </div>
            <span className="text-xs font-inter text-gold font-medium">
              {challenge.hashtag}
            </span>
          </div>

          {/* Entries */}
          <h3 className="font-editorial text-lg text-ink mb-4">Top Entries</h3>
          <div className="space-y-4">
            {challenge.entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="relative w-24 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0">
                  <img src={entry.image} alt={entry.creator} className="img-editorial" />
                  {i === 0 && (
                    <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                      <Trophy size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={entry.avatar} alt={entry.creator} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm font-inter font-medium text-ink">{entry.creator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-inter text-ink-muted">
                      #{i + 1} · {formatCount(entry.votes)} votes
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleVote(entry.id)}
                    className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-inter font-medium transition-all w-fit ${
                      votedEntries.has(entry.id)
                        ? "bg-rose/10 text-rose border border-rose/20"
                        : "bg-ivory text-ink-muted border border-ink/5"
                    }`}
                  >
                    <Heart
                      size={12}
                      fill={votedEntries.has(entry.id) ? "currentColor" : "none"}
                    />
                    {votedEntries.has(entry.id) ? "Voted" : "Vote"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join CTA */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
          >
            <Trophy size={14} />
            Join Challenge
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function StyleChallengeCard({
  challenge,
  index,
}: {
  challenge: StyleChallengeType;
  index: number;
}) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDetail(true)}
        className="cursor-pointer"
      >
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-3">
          <img src={challenge.coverImage} alt={challenge.title} className="img-editorial" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/90">
                <Flame size={10} className="text-white" />
                <span className="text-[9px] font-inter font-semibold text-white tracking-wider uppercase">
                  Challenge
                </span>
              </div>
              <span className="text-[10px] font-inter text-white/60">{challenge.deadline}</span>
            </div>
            <h3 className="font-editorial text-xl text-white leading-tight">
              {challenge.title}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-inter text-ink-muted">
              {formatCount(challenge.participants)} entries
            </span>
            <span className="text-xs font-inter text-gold font-medium">
              {challenge.hashtag}
            </span>
          </div>
          <ChevronRight size={14} className="text-ink-muted" />
        </div>
      </motion.div>

      <AnimatePresence>
        {showDetail && (
          <ChallengeDetail
            challenge={challenge}
            onClose={() => setShowDetail(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
