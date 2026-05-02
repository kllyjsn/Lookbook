import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, RefreshCw, Bell, BellOff, Sparkles, ArrowRight } from "lucide-react";
import { nextDropIn } from "../../data/editorialData";

interface EndOfFeedProps {
  likedCount: number;
  streakDays: number;
  streakHistory: string[];
  reminderEnabled: boolean;
  onToggleReminder: () => void;
  onReplay: () => void;
  onExplore: () => void;
  onOpenNotebook: () => void;
}

// 14-day streak grid: filled if visited that day, hollow otherwise.
function StreakGrid({ history }: { history: string[] }) {
  const today = new Date();
  const days: { iso: string; visited: boolean; isToday: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      iso,
      visited: history.includes(iso),
      isToday: i === 0,
    });
  }
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div className="grid grid-cols-7 gap-1.5 w-full max-w-[260px]">
      {days.map((day, i) => {
        const dayIdx = new Date(day.iso + "T00:00:00").getDay();
        return (
          <div key={day.iso} className="flex flex-col items-center gap-1">
            <span className="text-[8px] font-inter tracking-[0.1em] uppercase text-ink-muted/70">
              {labels[dayIdx] ?? labels[i]}
            </span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 400 }}
              className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                day.visited
                  ? "bg-gradient-to-br from-gold to-blush border-gold/30"
                  : "bg-ivory border-ink/10"
              } ${day.isToday ? "ring-2 ring-gold/40 ring-offset-2 ring-offset-cream" : ""}`}
            >
              {day.visited && <Flame size={11} className="text-white" />}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export function EndOfFeed({
  likedCount,
  streakDays,
  streakHistory,
  reminderEnabled,
  onToggleReminder,
  onReplay,
  onExplore,
  onOpenNotebook,
}: EndOfFeedProps) {
  const [drop, setDrop] = useState(() => nextDropIn());
  useEffect(() => {
    const id = setInterval(() => setDrop(nextDropIn()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center px-6 py-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-blush/20 flex items-center justify-center mb-4"
      >
        <Sparkles size={26} className="text-gold" />
      </motion.div>

      <h2 className="font-editorial text-2xl text-ink text-center leading-tight mb-1.5">
        You've finished today's edit.
      </h2>
      <p className="font-subhead text-sm text-ink-muted italic text-center mb-4 max-w-[280px]">
        {likedCount > 0
          ? `You loved ${likedCount} look${likedCount > 1 ? "s" : ""} today. Filed to your DNA.`
          : "Tomorrow's drop will be tuned to your taste."}
      </p>

      {/* Streak grid */}
      {streakDays > 0 && (
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-gold" />
            <span className="text-[11px] font-inter font-semibold tracking-[0.15em] uppercase text-ink">
              {streakDays}-day streak
            </span>
          </div>
          <StreakGrid history={streakHistory} />
        </div>
      )}

      {/* Next drop countdown card */}
      <div className="w-full max-w-[300px] rounded-2xl border border-ink/10 bg-ivory p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted">
              Next drop
            </p>
            <p className="font-editorial text-lg text-ink leading-tight">
              Tomorrow · 7:00 AM
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-ink-muted">
              In
            </p>
            <p className="font-editorial text-lg text-ink leading-tight">
              {drop.label}
            </p>
          </div>
        </div>
        <button
          onClick={onToggleReminder}
          className={`w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-inter font-medium transition-colors ${
            reminderEnabled
              ? "bg-ink text-cream"
              : "bg-cream border border-ink/15 text-ink"
          }`}
        >
          {reminderEnabled ? <Bell size={12} /> : <BellOff size={12} />}
          {reminderEnabled ? "Reminder on" : "Remind me at 7AM"}
        </button>
      </div>

      {/* Primary actions */}
      <div className="flex flex-col gap-2 w-full max-w-[300px]">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onOpenNotebook}
          className="w-full py-3 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
        >
          Read the Editor's Notebook
          <ArrowRight size={14} />
        </motion.button>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onReplay}
            className="py-2.5 rounded-full border border-ink/15 text-ink font-inter text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} />
            Replay
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onExplore}
            className="py-2.5 rounded-full border border-ink/15 text-ink font-inter text-xs font-medium"
          >
            Community
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
