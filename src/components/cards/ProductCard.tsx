import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Bookmark, Flame } from "lucide-react";
import type { LookItem } from "../../data/mockData";

function formatSaves(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

interface ProductCardProps {
  item: LookItem;
  index: number;
  showBudgetAlt?: boolean;
}

export function ProductCard({ item, index, showBudgetAlt = false }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-ivory mb-3">
        {!imgLoaded && <div className="absolute inset-0 shimmer bg-ivory" />}
        <img
          src={item.image}
          alt={item.name}
          className={`img-editorial transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <ExternalLink size={16} className="text-ink" />
          </div>
        </motion.div>
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="text-[9px] font-inter tracking-[0.15em] uppercase bg-cream/90 text-ink-light px-2 py-0.5 rounded-full">
            {item.category}
          </span>
          {item.sellingFast && (
            <span className="flex items-center gap-0.5 text-[8px] font-inter font-semibold tracking-wider uppercase bg-rose/90 text-white px-2 py-0.5 rounded-full">
              <Flame size={8} />
              Hot
            </span>
          )}
        </div>
        {item.saves && (
          <div className="absolute bottom-2 right-2">
            <span className="flex items-center gap-1 text-[9px] font-inter text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <Bookmark size={8} />
              {formatSaves(item.saves)}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-[11px] font-inter tracking-[0.1em] uppercase text-ink-muted">
          {item.brand}
        </p>
        <p className="text-sm font-inter text-ink leading-snug">{item.name}</p>
        <p className="text-sm font-inter font-medium text-ink">${item.price}</p>
      </div>
      {showBudgetAlt && item.budgetAlt && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 px-2.5 py-2 rounded-lg bg-sage/10 border border-sage/20"
        >
          <p className="text-[9px] font-inter tracking-wider uppercase text-sage font-semibold mb-0.5">
            Budget Alternative
          </p>
          <p className="text-[11px] font-inter text-ink-light">
            {item.budgetAlt.name} · {item.budgetAlt.brand}
          </p>
          <p className="text-[11px] font-inter font-medium text-sage">
            ${item.budgetAlt.price}
            <span className="text-ink-muted font-normal ml-1">
              (save ${item.price - item.budgetAlt.price})
            </span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
