import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { MustHaveList } from "../../data/communityData";

interface MustHaveCardProps {
  list: MustHaveList;
  index: number;
  onTap: (list: MustHaveList) => void;
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function MustHaveCard({ list, index, onTap }: MustHaveCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onTap(list)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-3">
        <img
          src={list.coverImage}
          alt={list.name}
          className="img-editorial group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <h3 className="font-editorial text-xl text-white leading-tight mb-1">
            {list.name}
          </h3>
          <p className="text-xs font-inter text-white/60">
            {list.items.length} pieces · {formatCount(list.saves)} saves
          </p>
        </div>

        {/* Item count badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-[10px] font-inter font-semibold text-ink">
            {list.items.length} ITEMS
          </span>
        </div>
      </div>

      {/* Creator attribution */}
      <div className="flex items-center gap-2 px-1">
        <img
          src={list.creator.avatar}
          alt={list.creator.displayName}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-xs font-inter text-ink-muted">
          Curated by{" "}
          <span className="font-medium text-ink">
            {list.creator.displayName}
          </span>
        </span>
        {list.creator.verified && (
          <BadgeCheck size={12} className="text-gold" fill="currentColor" />
        )}
      </div>
    </motion.div>
  );
}
