import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronRight, X } from "lucide-react";
import { useStore } from "../../stores/useStore";

const challenges = [
  { theme: "Soft Sunday", desc: "Elevated comfort, cozy luxe", emoji: "☁️" },
  { theme: "Monochrome Monday", desc: "All one color — head to toe", emoji: "🖤" },
  { theme: "Texture Tuesday", desc: "Mix at least 3 different fabrics", emoji: "🧶" },
  { theme: "Workwear Wednesday", desc: "Office siren energy only", emoji: "💼" },
  { theme: "Throwback Thursday", desc: "Vintage-inspired everything", emoji: "📸" },
  { theme: "Festival Friday", desc: "As if you're front row at Coachella", emoji: "🎪" },
  { theme: "Street Saturday", desc: "Streetwear meets high fashion", emoji: "🛹" },
];

function getTodaysChallenge() {
  const dayIndex = new Date().getDay();
  return challenges[dayIndex];
}

export function DailyChallenge() {
  const streak = useStore((s) => s.challengeStreak);
  const lastChallengeDate = useStore((s) => s.lastChallengeDate);
  const acceptChallenge = useStore((s) => s.acceptChallenge);
  const dismissChallenge = useStore((s) => s.dismissChallenge);
  const challengeDismissed = useStore((s) => s.challengeDismissed);

  const today = new Date().toDateString();
  const alreadyAccepted = lastChallengeDate === today;
  const challenge = getTodaysChallenge();

  if (challengeDismissed || alreadyAccepted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mx-4 mb-2"
      >
        <div className="bg-gradient-to-r from-gold/10 to-blush/10 border border-gold/20 rounded-xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{challenge.emoji}</span>
              <div>
                <p className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold font-semibold">
                  Today's Challenge
                </p>
                <h4 className="font-editorial text-base text-ink leading-tight">
                  {challenge.theme}
                </h4>
              </div>
            </div>
            <button
              onClick={dismissChallenge}
              className="text-ink-muted/50 hover:text-ink-muted"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs font-inter text-ink-muted mb-3 pl-7">
            {challenge.desc}
          </p>
          <div className="flex items-center justify-between pl-7">
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-rose" />
              <span className="text-xs font-inter font-semibold text-ink">
                {streak} day streak
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={acceptChallenge}
              className="flex items-center gap-1.5 bg-ink text-cream text-xs font-inter font-medium px-4 py-2 rounded-full"
            >
              Accept
              <ChevronRight size={12} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
