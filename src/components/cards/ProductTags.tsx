import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import type { Look } from "../../data/mockData";

interface ProductTagsProps {
  look: Look;
  visible: boolean;
  onClose: () => void;
}

const tagPositions = [
  { top: "25%", left: "30%" },
  { top: "45%", left: "65%" },
  { top: "60%", left: "25%" },
  { top: "75%", left: "55%" },
];

export function ProductTags({ look, visible, onClose }: ProductTagsProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-black/20" onClick={onClose} />

          {look.items.slice(0, 4).map((item, i) => {
            const pos = tagPositions[i];
            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 20 }}
                className="absolute"
                style={{ top: pos.top, left: pos.left }}
              >
                <ProductTagPill item={item} />
              </motion.div>
            );
          })}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <X size={14} className="text-white" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProductTagPill({ item }: { item: Look["items"][0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(!expanded);
      }}
      className="cursor-pointer"
    >
      {expanded ? (
        <motion.div
          layoutId={`tag-${item.id}`}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg"
        >
          <div className="w-8 h-10 rounded-md overflow-hidden bg-ivory flex-shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-inter tracking-wider uppercase text-ink-muted">
              {item.brand}
            </p>
            <p className="text-[11px] font-inter text-ink leading-snug truncate max-w-[120px]">
              {item.name}
            </p>
            <p className="text-[11px] font-inter font-semibold text-ink">${item.price}</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layoutId={`tag-${item.id}`}
          className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center"
        >
          <ShoppingBag size={12} className="text-ink" />
        </motion.div>
      )}
    </motion.div>
  );
}
