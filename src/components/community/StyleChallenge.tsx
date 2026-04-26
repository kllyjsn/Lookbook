import { motion } from "framer-motion";
import { Sparkles, Clock, Users, ChevronRight } from "lucide-react";

const challenges = [
  {
    id: "ch-1",
    title: "One Color, One Look",
    desc: "Style a head-to-toe monochrome outfit",
    entries: 2340,
    timeLeft: "2d left",
    gradient: "from-ink to-charcoal",
    textColor: "text-cream",
  },
  {
    id: "ch-2",
    title: "Under $100 Challenge",
    desc: "Prove great style doesn't need a big budget",
    entries: 4120,
    timeLeft: "5d left",
    gradient: "from-gold to-gold-light",
    textColor: "text-ink",
  },
  {
    id: "ch-3",
    title: "Capsule Week",
    desc: "7 outfits from 10 pieces",
    entries: 1890,
    timeLeft: "3d left",
    gradient: "from-sage to-lavender",
    textColor: "text-ink",
  },
];

export function StyleChallenge() {
  return (
    <div className="px-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-gold" />
          <h3 className="font-editorial text-lg text-ink">Style Challenges</h3>
        </div>
        <button className="text-[10px] font-inter text-ink-muted tracking-wide flex items-center gap-1">
          See all <ChevronRight size={10} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {challenges.map((challenge, i) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.98 }}
            className={`shrink-0 w-56 p-4 rounded-2xl bg-gradient-to-br ${challenge.gradient} cursor-pointer`}
          >
            <h4 className={`font-inter font-semibold text-sm ${challenge.textColor} mb-1`}>
              {challenge.title}
            </h4>
            <p className={`text-[11px] font-inter ${challenge.textColor} opacity-70 mb-3`}>
              {challenge.desc}
            </p>
            <div className={`flex items-center gap-3 text-[10px] font-inter ${challenge.textColor} opacity-60`}>
              <span className="flex items-center gap-1">
                <Users size={10} /> {challenge.entries.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> {challenge.timeLeft}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
