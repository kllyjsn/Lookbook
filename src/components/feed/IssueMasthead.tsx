import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { computeIssue } from "../../data/editorialData";

interface IssueMastheadProps {
  streakDays: number;
}

// Magazine-style header: ISSUE · DATE · STREAK
// Replaces the bare "n / total" counter and gives the feed editorial cadence.
export function IssueMasthead({ streakDays }: IssueMastheadProps) {
  const issue = computeIssue();

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2"
    >
      <div className="hidden xs:flex flex-col items-end leading-tight">
        <span className="text-[8px] font-inter tracking-[0.3em] uppercase text-ink-muted">
          {issue.issueLabel}
        </span>
        <span className="text-[8px] font-inter tracking-[0.3em] uppercase text-ink/60">
          {issue.date}
        </span>
      </div>

      <div className="flex flex-col items-end leading-tight xs:hidden">
        <span className="text-[8px] font-inter tracking-[0.25em] uppercase text-ink-muted">
          ISSUE · {issue.issue}
        </span>
        <span className="text-[8px] font-inter tracking-[0.25em] uppercase text-ink/60">
          {issue.short}
        </span>
      </div>

      {streakDays > 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 border border-gold/20"
          title={`${streakDays}-day reading streak`}
        >
          <Flame size={10} className="text-gold" />
          <span className="text-[10px] font-inter font-semibold text-gold">
            {streakDays}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
