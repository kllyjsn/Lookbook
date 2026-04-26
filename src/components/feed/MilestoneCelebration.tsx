import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useStore } from "../../stores/useStore";

const milestoneMessages: Record<number, { title: string; subtitle: string }> = {
  5: { title: "First Five!", subtitle: "You're building your Style DNA." },
  10: { title: "Double Digits", subtitle: "Your taste is becoming clear." },
  25: { title: "Style Maven", subtitle: "You know what you love." },
  50: { title: "Fashion Authority", subtitle: "Your Style DNA is highly refined." },
  100: { title: "Editor-in-Chief", subtitle: "You've curated 100 looks. Legendary." },
};

const confettiColors = ["#C5A572", "#C4797A", "#B8A9C9", "#A8B5A0", "#E8D5D0"];

const confettiSeeds = Array.from({ length: 20 }, (_, i) => ({
  x: (((i * 7 + 13) % 30) / 30) * 300 - 150,
  rotation: (((i * 11 + 3) % 36) / 36) * 720 - 360,
  color: confettiColors[i % confettiColors.length],
  delay: i * 0.05,
}));

function ConfettiParticle({ delay, color, xVal, rotation }: { delay: number; color: string; xVal: number; rotation: number }) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, -80, 300],
        x: [0, xVal * 0.5, xVal],
        opacity: [1, 1, 0],
        rotate: rotation,
        scale: [0, 1, 0.5],
      }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className="absolute w-2 h-2 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
}

export function MilestoneCelebration() {
  const milestoneReached = useStore((s) => s.milestoneReached);
  const clearMilestone = useStore((s) => s.clearMilestone);

  useEffect(() => {
    if (milestoneReached) {
      const timer = setTimeout(clearMilestone, 3500);
      return () => clearTimeout(timer);
    }
  }, [milestoneReached, clearMilestone]);

  const msg = milestoneReached ? milestoneMessages[milestoneReached] : null;

  return (
    <AnimatePresence>
      {milestoneReached && msg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative bg-cream rounded-3xl p-8 shadow-2xl flex flex-col items-center max-w-xs mx-8"
          >
            {/* Confetti */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {confettiSeeds.map((seed, i) => (
                <ConfettiParticle
                  key={i}
                  delay={seed.delay}
                  color={seed.color}
                  xVal={seed.x}
                  rotation={seed.rotation}
                />
              ))}
            </div>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-rose/20 flex items-center justify-center mb-4"
            >
              <Sparkles size={28} className="text-gold" />
            </motion.div>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-4xl font-editorial font-bold text-gold mb-2"
            >
              {milestoneReached}
            </motion.span>
            <h3 className="font-editorial text-xl text-ink text-center mb-1">
              {msg.title}
            </h3>
            <p className="font-subhead text-sm text-ink-muted italic text-center">
              {msg.subtitle}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
