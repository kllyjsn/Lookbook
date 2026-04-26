import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface DoubleTapHeartProps {
  x: number;
  y: number;
}

export function DoubleTapHeart({ x, y }: DoubleTapHeartProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 1.4, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute pointer-events-none z-30"
      style={{ left: x - 30, top: y - 30 }}
    >
      <Heart size={60} className="text-white drop-shadow-lg" fill="white" />
    </motion.div>
  );
}
