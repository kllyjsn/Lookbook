import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartBurstProps {
  show: boolean;
  x: number;
  y: number;
}

const particles = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * Math.PI * 2;
  return {
    id: i,
    dx: Math.cos(angle) * 40,
    dy: Math.sin(angle) * 40,
  };
});

export function HeartBurst({ show, x, y }: HeartBurstProps) {
  return createPortal(
    <AnimatePresence>
      {show && (
        <div
          className="pointer-events-none fixed z-[100]"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Heart size={64} className="text-rose" fill="currentColor" strokeWidth={0} />
          </motion.div>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2"
              style={{ marginLeft: -6, marginTop: -6 }}
            >
              <Heart size={12} className="text-rose" fill="currentColor" strokeWidth={0} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
