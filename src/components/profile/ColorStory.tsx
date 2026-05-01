import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useStore } from "../../stores/useStore";

interface ColorSwatch {
  hex: string;
  name: string;
  percentage: number;
}

function extractColorStory(likedCount: number): ColorSwatch[] {
  const palettes: ColorSwatch[][] = [
    [
      { hex: "#1A1A1A", name: "Noir", percentage: 28 },
      { hex: "#FAF9F6", name: "Ivory", percentage: 22 },
      { hex: "#C5A572", name: "Gold", percentage: 18 },
      { hex: "#E8D5D0", name: "Blush", percentage: 16 },
      { hex: "#8A8A8A", name: "Slate", percentage: 16 },
    ],
    [
      { hex: "#C4797A", name: "Rose", percentage: 24 },
      { hex: "#E8D5D0", name: "Blush", percentage: 22 },
      { hex: "#B8A9C9", name: "Lavender", percentage: 20 },
      { hex: "#FAF9F6", name: "Cream", percentage: 18 },
      { hex: "#A8B5A0", name: "Sage", percentage: 16 },
    ],
    [
      { hex: "#2D2D2D", name: "Charcoal", percentage: 26 },
      { hex: "#C5A572", name: "Camel", percentage: 24 },
      { hex: "#FAF9F6", name: "White", percentage: 20 },
      { hex: "#4A4A4A", name: "Graphite", percentage: 16 },
      { hex: "#A8B5A0", name: "Olive", percentage: 14 },
    ],
  ];

  return palettes[likedCount % palettes.length];
}

export function ColorStory() {
  const likedLooks = useStore((s) => s.likedLooks);
  const colors = extractColorStory(likedLooks.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Palette size={16} className="text-ink-muted" />
        <h3 className="font-editorial text-lg text-ink">Your Color Story</h3>
      </div>

      <p className="font-subhead text-sm text-ink-muted italic mb-5">
        The palette that defines your wardrobe choices.
      </p>

      {/* Color bar */}
      <div className="flex rounded-xl overflow-hidden h-12 mb-4 card-shadow">
        {colors.map((color, i) => (
          <motion.div
            key={color.hex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="h-full origin-left"
            style={{
              backgroundColor: color.hex,
              width: `${color.percentage}%`,
            }}
          />
        ))}
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, i) => (
          <motion.div
            key={color.hex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-white card-shadow mb-1.5"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-[9px] font-inter text-ink font-medium text-center">
              {color.name}
            </span>
            <span className="text-[8px] font-inter text-ink-muted">
              {color.percentage}%
            </span>
          </motion.div>
        ))}
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-5 p-4 rounded-xl bg-ivory border border-ink/5"
      >
        <p className="text-xs font-inter text-ink-light leading-relaxed">
          <span className="font-semibold text-ink">Editor's Note:</span>{" "}
          {likedLooks.length > 3
            ? "Your palette skews tonal — you instinctively reach for pieces that layer in the same color family. This is a sign of a sophisticated dresser."
            : "Keep swiping to reveal your true color story. Your palette evolves with every look you love."}
        </p>
      </motion.div>
    </motion.div>
  );
}
