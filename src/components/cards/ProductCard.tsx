import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Heart } from "lucide-react";
import type { LookItem } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

interface ProductCardProps {
  item: LookItem;
  index: number;
}

// Cost-per-wear estimate: typical wears for the item's category over its expected useful life.
const CATEGORY_WEAR_ESTIMATE: Record<string, number> = {
  Tops: 80,
  Bottoms: 100,
  Outerwear: 120,
  Shoes: 200,
  Bags: 150,
  Dresses: 30,
  Accessories: 100,
};

function estimateCostPerWear(item: LookItem): number {
  const wears = CATEGORY_WEAR_ESTIMATE[item.category] ?? 80;
  return Math.max(1, Math.round(item.price / wears));
}

export function ProductCard({ item, index }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const wishlistItemIds = useStore((s) => s.wishlistItemIds);
  const toggleWishlistItem = useStore((s) => s.toggleWishlistItem);
  const wishlisted = wishlistItemIds.includes(item.id);
  const cpw = estimateCostPerWear(item);

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
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlistItem(item);
          }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            wishlisted ? "bg-rose text-white" : "bg-white/90 text-ink-muted"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.span
            animate={wishlisted ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart size={12} fill={wishlisted ? "currentColor" : "none"} strokeWidth={1.8} />
          </motion.span>
        </motion.button>
      </div>
      <div className="space-y-0.5">
        <p className="text-[11px] font-inter tracking-[0.1em] uppercase text-ink-muted">
          {item.brand}
        </p>
        <p className="text-sm font-inter text-ink leading-snug">{item.name}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-inter font-medium text-ink">${item.price}</p>
          <p className="text-[10px] font-inter text-ink-muted">
            ~${cpw}/wear
          </p>
        </div>
      </div>
    </motion.div>
  );
}
