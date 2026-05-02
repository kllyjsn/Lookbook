import { motion } from "framer-motion";
import type { LookItem } from "../../data/mockData";

const categoryOrder = ["Outerwear", "Tops", "Dresses", "Bottoms", "Shoes", "Bags", "Accessories"];
const categoryLabels: Record<string, string> = {
  Outerwear: "The Layer",
  Tops: "The Foundation",
  Dresses: "The Statement",
  Bottoms: "The Anchor",
  Shoes: "The Finish",
  Bags: "The Carry",
  Accessories: "The Detail",
};

interface OutfitAnatomyProps {
  items: LookItem[];
}

export function OutfitAnatomy({ items }: OutfitAnatomyProps) {
  const sorted = [...items].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
  );

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-5 h-5 rounded-full bg-ink/5 flex items-center justify-center">
          <span className="text-[10px] font-editorial text-ink">A</span>
        </div>
        <h3 className="font-editorial text-xl text-ink">Outfit Anatomy</h3>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-gold/40 via-ink/10 to-gold/40" />

        <div className="space-y-1">
          {sorted.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 py-2"
            >
              {/* Step marker */}
              <div className="relative z-10 w-3 h-3 rounded-full bg-cream border-2 border-gold ml-[18px] flex-shrink-0" />

              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-ivory">
                <img src={item.image} alt={item.name} className="img-editorial" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-inter tracking-[0.2em] uppercase text-gold">
                  {categoryLabels[item.category] ?? item.category}
                </p>
                <p className="text-sm font-inter text-ink truncate">{item.name}</p>
                <p className="text-[11px] font-inter text-ink-muted">
                  {item.brand} · ${item.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
