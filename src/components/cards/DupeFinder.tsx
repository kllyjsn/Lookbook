import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { dupeMap } from "../../data/mockData";
import type { LookItem } from "../../data/mockData";

interface DupeFinderProps {
  items: LookItem[];
}

export function DupeFinder({ items }: DupeFinderProps) {
  const dupes = items.flatMap((item) =>
    (dupeMap[item.id] ?? []).map((dupe) => ({
      ...dupe,
      originalName: item.name,
      originalBrand: item.brand,
      originalPrice: item.price,
    }))
  );

  if (dupes.length === 0) return null;

  const totalSavings = dupes.reduce((sum, d) => sum + d.savings, 0);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles size={18} className="text-rose" />
        <h3 className="font-editorial text-xl text-ink">Get the Dupe</h3>
      </div>
      <p className="text-xs font-inter text-ink-muted mb-4">
        Same vibe, friendlier price. Save up to ${totalSavings}.
      </p>

      <div className="space-y-3">
        {dupes.map((dupe, i) => (
          <motion.div
            key={dupe.originalId + "-dupe-" + i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-ivory border border-ink/5"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <img src={dupe.image} alt={dupe.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-inter text-ink-muted tracking-wider uppercase truncate">
                {dupe.brand}
              </p>
              <p className="text-sm font-inter text-ink leading-snug truncate">{dupe.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-inter font-semibold text-ink">${dupe.price}</span>
                <span className="text-xs font-inter text-ink-muted line-through">${dupe.originalPrice}</span>
                <span className="flex items-center gap-0.5 text-[9px] font-inter font-semibold text-green-600 bg-green-50 rounded-full px-1.5 py-0.5">
                  <ArrowDown size={8} />
                  ${dupe.savings}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
