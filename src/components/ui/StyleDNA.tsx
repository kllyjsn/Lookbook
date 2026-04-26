import { motion } from "framer-motion";
import type { StyleDNAEntry } from "../../data/mockData";

interface StyleDNAProps {
  data: StyleDNAEntry[];
}

export function StyleDNA({ data }: StyleDNAProps) {
  const sorted = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-4">
      <h3 className="font-editorial text-lg text-ink">Your Style DNA</h3>
      <div className="space-y-3">
        {sorted.map((entry, i) => (
          <motion.div
            key={entry.style}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <span className="w-24 text-xs font-inter text-ink-light tracking-wide">
              {entry.style}
            </span>
            <div className="flex-1 h-2 bg-ink/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${entry.percentage}%` }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: entry.color }}
              />
            </div>
            <span className="w-10 text-right text-xs font-inter text-ink-muted">
              {entry.percentage}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
