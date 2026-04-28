import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Repeat } from "lucide-react";
import type { LookItem } from "../../data/mockData";
import { costPerWear } from "../../lib/styleMatch";

interface ProductCardProps {
  item: LookItem;
  index: number;
  showCostPerWear?: boolean;
}

export function ProductCard({ item, index, showCostPerWear }: ProductCardProps) {
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
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-inter tracking-[0.15em] uppercase bg-cream/90 text-ink-light px-2 py-0.5 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-[11px] font-inter tracking-[0.1em] uppercase text-ink-muted">
          {item.brand}
        </p>
        <p className="text-sm font-inter text-ink leading-snug">{item.name}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-inter font-medium text-ink">${item.price}</p>
          {showCostPerWear && (
            <span className="flex items-center gap-0.5 text-[9px] font-inter text-ink-muted">
              <Repeat size={8} />
              {costPerWear(item.price, item.category)}/wear
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
