import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, Trophy, ChevronRight, ArrowLeft, Star, Flame } from "lucide-react";
import type { StyleChallenge } from "../../data/trendData";
import { ProductCard } from "../cards/ProductCard";

interface ChallengeCardProps {
  challenge: StyleChallenge;
  index: number;
}

function ChallengeDetail({
  challenge,
  onClose,
}: {
  challenge: StyleChallenge;
  onClose: () => void;
}) {
  const [joined, setJoined] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto pb-24">
        <div className="relative w-full aspect-[16/9]">
          <img src={challenge.coverImage} alt={challenge.title} className="img-editorial" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <span className="text-[9px] font-inter tracking-[0.3em] uppercase text-gold block mb-1">
              STYLE CHALLENGE
            </span>
            <h1 className="font-editorial text-3xl text-white leading-tight mb-1">
              {challenge.title}
            </h1>
            <span className="text-xs font-inter text-white/50">
              {challenge.hashtag}
            </span>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-ink" />
          </motion.button>
        </div>

        <div className="px-6 pt-6">
          {/* Stats row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-ink-muted" />
              <span className="text-sm font-inter text-ink">
                {challenge.participants >= 1000
                  ? `${(challenge.participants / 1000).toFixed(1)}K`
                  : challenge.participants}{" "}
                joined
              </span>
            </div>
            <span className="text-ink-muted/30">·</span>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-ink-muted" />
              <span className="text-sm font-inter text-ink">{challenge.deadline}</span>
            </div>
            <span className="text-ink-muted/30">·</span>
            <span
              className={`text-[10px] font-inter font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${
                challenge.difficulty === "Easy"
                  ? "bg-green-100 text-green-700"
                  : challenge.difficulty === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose/10 text-rose"
              }`}
            >
              {challenge.difficulty}
            </span>
          </div>

          {/* Description */}
          <p className="font-subhead text-lg text-ink-light leading-relaxed italic mb-6">
            {challenge.description}
          </p>

          {/* Prize */}
          {challenge.prize && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gold/10 border border-gold/20 mb-6">
              <Trophy size={18} className="text-gold" />
              <div>
                <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                  PRIZE
                </p>
                <p className="text-sm font-inter font-medium text-ink">{challenge.prize}</p>
              </div>
            </div>
          )}

          {/* Rules */}
          <div className="mb-8">
            <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3">
              THE RULES
            </h3>
            <div className="space-y-2">
              {challenge.rules.map((rule, i) => (
                <motion.div
                  key={rule}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-ivory"
                >
                  <span className="w-5 h-5 rounded-full bg-ink/10 text-[10px] font-inter font-medium text-ink flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-inter text-ink">{rule}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Example pieces */}
          {challenge.exampleItems.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3">
                STARTER PIECES
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {challenge.exampleItems.map((item, i) => (
                  <ProductCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Join button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setJoined(!joined)}
            className={`w-full py-4 rounded-full font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              joined
                ? "bg-gold text-white"
                : "bg-ink text-cream"
            }`}
          >
            {joined ? (
              <>
                <Star size={16} fill="currentColor" />
                Joined!
              </>
            ) : (
              <>
                <Flame size={16} />
                Join Challenge
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDetail(true)}
        className="group cursor-pointer"
      >
        <div className="relative aspect-[2/1] rounded-2xl overflow-hidden">
          <img
            src={challenge.coverImage}
            alt={challenge.title}
            className="img-editorial group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-lg text-white leading-tight">
                  {challenge.title}
                </h3>
                <span className="text-[11px] font-inter text-white/50">
                  {challenge.hashtag}
                </span>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </div>
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={`text-[8px] font-inter font-bold tracking-[0.1em] uppercase text-white rounded-full px-2.5 py-1 ${
                challenge.difficulty === "Easy"
                  ? "bg-green-600/80"
                  : challenge.difficulty === "Medium"
                    ? "bg-amber-500/80"
                    : "bg-rose/80"
              }`}
            >
              {challenge.difficulty}
            </span>
            {challenge.prize && (
              <span className="flex items-center gap-1 text-[8px] font-inter font-bold tracking-[0.1em] uppercase text-white bg-gold/80 rounded-full px-2.5 py-1">
                <Trophy size={8} />
                Prize
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Users size={10} className="text-white/60" />
            <span className="text-[10px] font-inter text-white/60">
              {challenge.participants >= 1000
                ? `${(challenge.participants / 1000).toFixed(1)}K`
                : challenge.participants}
            </span>
          </div>
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
