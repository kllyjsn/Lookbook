import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, ChevronRight, Trophy, X } from "lucide-react";
import { dailyChallenges, feedLooks } from "../../data/mockData";
import type { StyleChallenge, Look } from "../../data/mockData";

interface DailyChallengeProps {
  onLookTap: (look: Look) => void;
}

function formatParticipants(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function ChallengeDetail({
  challenge,
  onClose,
  onLookTap,
}: {
  challenge: StyleChallenge;
  onClose: () => void;
  onLookTap: (look: Look) => void;
}) {
  const relatedLooks = challenge.relatedLookIds
    .map((id) => feedLooks.find((l) => l.id === id))
    .filter((l): l is Look => l !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto">
        <div className="relative w-full aspect-[2/1]">
          <img
            src={challenge.coverImage}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <X size={18} className="text-ink" />
          </motion.button>
          <div className="absolute bottom-0 inset-x-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={14} className="text-gold" />
              <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/70">
                DAILY CHALLENGE
              </span>
            </div>
            <h1 className="font-editorial text-3xl text-white leading-tight">
              {challenge.title}
            </h1>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="font-subhead text-lg text-ink-light italic mb-4">
            {challenge.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-sm font-inter text-ink-muted">
              <Users size={14} />
              {formatParticipants(challenge.participants)} participating
            </span>
            <span className="flex items-center gap-1.5 text-sm font-inter text-rose">
              <Clock size={14} />
              {challenge.expiresIn} left
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-lavender/10 border border-lavender/15 mb-8">
            <span className="text-sm font-inter font-medium text-lavender">
              {challenge.hashtag}
            </span>
          </div>

          {relatedLooks.length > 0 && (
            <>
              <h3 className="font-editorial text-lg text-ink mb-4">
                Get Inspired
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {relatedLooks.map((look) => (
                  <motion.div
                    key={look.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose();
                      onLookTap(look);
                    }}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="font-editorial text-sm text-white">{look.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function DailyChallenge({ onLookTap }: DailyChallengeProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<StyleChallenge | null>(null);
  const challenge = dailyChallenges[0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedChallenge(challenge)}
        className="mx-6 mb-6 relative rounded-2xl overflow-hidden cursor-pointer"
      >
        <div className="relative aspect-[2.5/1]">
          <img
            src={challenge.coverImage}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={12} className="text-gold" />
              <span className="text-[9px] font-inter tracking-[0.2em] uppercase text-white/80 font-semibold">
                Today's Challenge
              </span>
              <span className="ml-auto flex items-center gap-1 text-[9px] font-inter text-rose">
                <Clock size={10} />
                {challenge.expiresIn}
              </span>
            </div>
            <div>
              <h3 className="font-editorial text-lg text-white leading-tight mb-1">
                {challenge.title}
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-inter text-white/60">
                  {formatParticipants(challenge.participants)} joined
                </span>
                <span className="flex items-center gap-1 text-[10px] font-inter text-white/80 font-medium">
                  Join
                  <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeDetail
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onLookTap={onLookTap}
          />
        )}
      </AnimatePresence>
    </>
  );
}
