import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import type { Look } from "../../data/mockData";

interface QuickShopPeekProps {
  look: Look;
}

export function QuickShopPeek({ look }: QuickShopPeekProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute bottom-24 left-4 right-4 z-20 pointer-events-none"
    >
      <div className="glass-dark rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag size={14} className="text-white/70" />
          <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/60">
            Quick Shop
          </span>
          <span className="ml-auto text-xs font-inter font-medium text-gold">
            {look.priceRange}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {look.items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-20">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-charcoal mb-1.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[9px] font-inter text-white/50 truncate">
                {item.brand}
              </p>
              <p className="text-[10px] font-inter text-white font-medium">
                ${item.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
