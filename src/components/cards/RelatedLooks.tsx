import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { feedLooks } from "../../data/mockData";
import type { Look } from "../../data/mockData";

interface RelatedLooksProps {
  currentLook: Look;
  onLookTap: (look: Look) => void;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function RelatedLooks({ currentLook, onLookTap }: RelatedLooksProps) {
  const related = useMemo(() => {
    const currentTags = new Set(currentLook.tags.map((t) => t.label));
    return feedLooks
      .filter((l) => l.id !== currentLook.id)
      .map((look) => {
        const overlap = look.tags.filter((t) => currentTags.has(t.label)).length;
        const moodMatch = look.mood === currentLook.mood ? 2 : 0;
        return { look, score: overlap + moodMatch };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((r) => r.look);
  }, [currentLook]);

  if (related.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="font-editorial text-xl text-ink mb-5">You Might Also Love</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {related.map((look, i) => (
          <RelatedCard key={look.id} look={look} index={i} onTap={onLookTap} />
        ))}
      </div>
    </div>
  );
}

function RelatedCard({
  look,
  index,
  onTap,
}: {
  look: Look;
  index: number;
  onTap: (look: Look) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onTap(look)}
      className="flex-shrink-0 w-36 cursor-pointer group"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-charcoal">
        {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}
        <img
          src={look.image}
          alt={look.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pb-3">
          <p className="font-editorial text-sm text-white leading-tight">{look.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Heart size={10} className="text-white/60" fill="currentColor" />
            <span className="text-[10px] font-inter text-white/60">
              {formatCount(look.likes)}
            </span>
          </div>
        </div>
        {look.badge && (
          <div className="absolute top-2 left-2">
            <span className="text-[8px] font-inter font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-sm text-white rounded-full px-2 py-0.5">
              {look.badge === "editors-pick" ? "PICK" : look.badge === "trending" ? "HOT" : "NEW"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
