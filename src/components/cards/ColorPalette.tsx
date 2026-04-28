import { motion } from "framer-motion";
import { Palette } from "lucide-react";

interface ColorPaletteProps {
  colors: string[];
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  if (colors.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <Palette size={16} className="text-ink-muted" />
        <h3 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink">
          Color Story
        </h3>
      </div>
      <div className="flex gap-2">
        {colors.map((color, i) => (
          <motion.div
            key={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 400 }}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="w-10 h-10 rounded-full border border-ink/10"
              style={{ backgroundColor: color }}
            />
            <span className="text-[8px] font-inter text-ink-muted tracking-wider uppercase">
              {color}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
