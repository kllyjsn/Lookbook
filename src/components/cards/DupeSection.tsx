import { motion } from "framer-motion";
import { BadgePercent } from "lucide-react";
import { lookDupes } from "../../data/mockData";
import type { DupeItem } from "../../data/mockData";

interface DupeSectionProps {
  lookId: string;
}

function DupeCard({ dupe, index }: { dupe: DupeItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-3 p-3 rounded-xl bg-ivory border border-ink/5"
    >
      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img src={dupe.image} alt={dupe.name} className="img-editorial" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">
          {dupe.brand}
        </p>
        <p className="text-sm font-inter text-ink leading-snug mt-0.5">
          {dupe.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-inter font-bold text-ink">
            ${dupe.dupePrice}
          </span>
          <span className="text-xs font-inter text-ink-muted line-through">
            ${dupe.originalPrice}
          </span>
          <span className="text-[9px] font-inter font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
            SAVE {dupe.savingsPercent}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function DupeSection({ lookId }: DupeSectionProps) {
  const dupes = lookDupes[lookId];
  if (!dupes || dupes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <BadgePercent size={16} className="text-green-600" />
        <h3 className="font-editorial text-lg text-ink">
          Get the Look for Less
        </h3>
      </div>
      <p className="text-xs font-inter text-ink-muted mb-4 italic">
        Editor-approved alternatives at a fraction of the price.
      </p>
      <div className="space-y-3">
        {dupes.map((dupe, i) => (
          <DupeCard key={dupe.id} dupe={dupe} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
