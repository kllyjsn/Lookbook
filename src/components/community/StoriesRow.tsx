import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { creators } from "../../data/communityData";

interface StoriesRowProps {
  onCreatorTap: (creatorId: string) => void;
}

export function StoriesRow({ onCreatorTap }: StoriesRowProps) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
      {/* Your Story */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-1.5 shrink-0"
      >
        <div className="relative w-16 h-16 rounded-full bg-ivory border-2 border-dashed border-ink/15 flex items-center justify-center">
          <Plus size={18} className="text-ink-muted" />
        </div>
        <span className="text-[9px] font-inter text-ink-muted">Your Look</span>
      </motion.div>

      {/* Creator stories */}
      {creators.slice(0, 8).map((creator, i) => (
        <motion.div
          key={creator.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (i + 1) * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCreatorTap(creator.id)}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-gold via-rose to-lavender">
              <img
                src={creator.avatar}
                alt={creator.displayName}
                className="w-full h-full rounded-full object-cover ring-2 ring-cream"
              />
            </div>
            {creator.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center ring-2 ring-cream">
                <span className="text-white text-[7px] font-bold">V</span>
              </div>
            )}
          </div>
          <span className="text-[9px] font-inter text-ink-muted max-w-[56px] truncate text-center">
            {creator.displayName.split(" ")[0]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
