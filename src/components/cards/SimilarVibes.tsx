import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { feedLooks } from "../../data/mockData";
import type { Look } from "../../data/mockData";

interface SimilarVibesProps {
  lookIds: string[];
  onLookTap: (look: Look) => void;
}

export function SimilarVibes({ lookIds, onLookTap }: SimilarVibesProps) {
  const similarLooks = lookIds
    .map((id) => feedLooks.find((l) => l.id === id))
    .filter((l): l is Look => l !== undefined);

  if (similarLooks.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-lavender" />
        <h3 className="font-editorial text-lg text-ink">Similar Vibes</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {similarLooks.map((look, i) => (
          <motion.button
            key={look.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onLookTap(look)}
            className="flex-shrink-0 w-36 text-left"
          >
            <div className="relative w-36 h-48 rounded-xl overflow-hidden mb-2">
              <img
                src={look.image}
                alt={look.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                <p className="text-xs font-inter font-medium text-white leading-tight">
                  {look.title}
                </p>
                <p className="text-[10px] font-inter text-white/60 mt-0.5">
                  {look.priceRange}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
