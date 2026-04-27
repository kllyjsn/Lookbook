import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, ArrowDown } from "lucide-react";
import { dupeMap } from "../../data/mockData";
import type { Look, DupeItem } from "../../data/mockData";

interface DupeSectionProps {
  look: Look;
}

function DupeCard({ dupe, index }: { dupe: DupeItem; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex gap-3 items-center p-3 rounded-xl bg-ivory border border-ink/5"
    >
      <div className="w-16 h-20 rounded-lg overflow-hidden bg-cream flex-shrink-0 relative">
        {!imgLoaded && <div className="absolute inset-0 shimmer bg-ivory" />}
        <img
          src={dupe.image}
          alt={dupe.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">
          {dupe.brand}
        </p>
        <p className="text-xs font-inter text-ink leading-snug truncate">
          {dupe.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-inter font-semibold text-ink">
            ${dupe.price}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-inter text-sage font-medium">
            <ArrowDown size={10} />
            Save ${dupe.savings}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function DupeSection({ look }: DupeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allDupes: DupeItem[] = look.items
    .flatMap((item) => dupeMap[item.id] ?? []);

  if (allDupes.length === 0) return null;

  const totalSavings = allDupes.reduce((max, d) => Math.max(max, d.savings), 0);

  return (
    <div className="mb-10">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 mb-4"
      >
        <div className="w-8 h-8 rounded-full bg-sage/15 flex items-center justify-center">
          <Sparkles size={14} className="text-sage" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-editorial text-lg text-ink">
            Get the Look for Less
          </h3>
          <p className="text-[10px] font-inter text-sage font-medium tracking-wide">
            Save up to ${totalSavings} with dupes
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-ink-muted" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {allDupes.map((dupe, i) => (
                <DupeCard key={dupe.id} dupe={dupe} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
