import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import type { Look } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

interface TodaysPickProps {
  look: Look;
  onTap: (look: Look) => void;
}

export function TodaysPick({ look, onTap }: TodaysPickProps) {
  const styleDNA = useStore((s) => s.styleDNA);
  const topStyle = styleDNA.length > 0 ? styleDNA[0].style : "Minimalist";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="mx-4 mb-3"
    >
      <div className="flex items-center gap-2 mb-2 px-1">
        <Sparkles size={12} className="text-gold" />
        <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold font-semibold">
          Today's Pick for You
        </span>
      </div>

      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => onTap(look)}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
      >
        <div className="aspect-[16/7] relative">
          <img
            src={look.image}
            alt={look.title}
            className="img-editorial group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          <div className="absolute inset-0 flex items-center p-5">
            <div className="flex-1">
              <span className="text-[8px] font-inter tracking-[0.3em] uppercase text-white/50 block mb-1">
                Based on your {topStyle} DNA
              </span>
              <h3 className="font-editorial text-lg text-white leading-tight mb-0.5">
                {look.title}
              </h3>
              <p className="font-subhead text-xs text-white/70 italic">
                {look.subtitle}
              </p>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center"
            >
              <ChevronRight size={14} className="text-white" />
            </motion.div>
          </div>

          <div className="absolute top-3 right-3">
            <span className="text-[8px] font-inter tracking-wider uppercase bg-gold/90 text-white rounded-full px-2 py-0.5 font-medium">
              {look.priceRange}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
