import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartBurstProps {
  burstKey: number;
  onComplete: () => void;
}

const particles = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2;
  return {
    id: i,
    x: Math.cos(angle) * 80,
    y: Math.sin(angle) * 80,
    rotate: Math.random() * 360,
    scale: 0.4 + Math.random() * 0.6,
    delay: Math.random() * 0.1,
  };
});

export function HeartBurst({ burstKey, onComplete }: HeartBurstProps) {
  const show = burstKey > 0;

  useEffect(() => {
    if (!burstKey) return;
    const timer = setTimeout(onComplete, 900);
    return () => clearTimeout(timer);
  }, [burstKey, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`heart-burst-${burstKey}`}
          className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Big center heart */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 12,
              duration: 0.6,
            }}
          >
            <Heart
              size={80}
              className="text-rose drop-shadow-lg"
              fill="currentColor"
            />
          </motion.div>

          {/* Particle hearts */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, p.scale, 0],
                x: [0, p.x * 0.5, p.x],
                y: [0, p.y * 0.5, p.y],
                opacity: [0, 1, 0],
                rotate: p.rotate,
              }}
              transition={{
                duration: 0.7,
                delay: p.delay,
                ease: "easeOut",
              }}
            >
              <Heart
                size={16 + p.scale * 12}
                className="text-rose"
                fill="currentColor"
              />
            </motion.div>
          ))}

          {/* Shimmer ring */}
          <motion.div
            className="absolute rounded-full border-2 border-rose/40"
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
