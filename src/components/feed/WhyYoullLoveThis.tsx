import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import type { Look } from "../../data/mockData";
import { useStore } from "../../stores/useStore";

interface WhyYoullLoveThisProps {
  look: Look;
}

const styleReasons: Record<string, string[]> = {
  "Minimalist": [
    "Clean silhouettes you gravitate toward",
    "Neutral palette matches your DNA",
    "Effortless pieces you always save",
  ],
  "Classic": [
    "Timeless investment pieces you love",
    "Tailored fit your profile prefers",
    "Wardrobe staple energy",
  ],
  "Romantic": [
    "Soft textures you keep swiping right on",
    "Feminine details that match your vibe",
    "Date-night ready — your most-saved occasion",
  ],
  "Streetwear": [
    "Bold proportions you always love",
    "Urban edge that fits your DNA",
    "Statement pieces you consistently save",
  ],
  "Avant-Garde": [
    "Creative expression you're drawn to",
    "Rule-breaking pieces you keep saving",
    "Bold artistry matching your style",
  ],
};

export function WhyYoullLoveThis({ look }: WhyYoullLoveThisProps) {
  const styleDNA = useStore((s) => s.styleDNA);
  const topStyle = styleDNA.length > 0 ? styleDNA[0].style : "Minimalist";

  const matchingTag = look.tags.find((t) => {
    const tagStyle = t.label;
    return styleDNA.some((d) => d.style === tagStyle || d.style.includes(tagStyle));
  });

  const reasons = styleReasons[topStyle] ?? styleReasons["Minimalist"];
  const reason = reasons[Math.abs(look.id.charCodeAt(look.id.length - 1)) % reasons.length];

  const matchPct = matchingTag
    ? styleDNA.find((d) => d.style === matchingTag.label)?.percentage ?? 0
    : styleDNA[0]?.percentage ?? 0;

  if (matchPct < 10) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-4 left-4 right-4 z-20"
    >
      <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 border border-white/20">
        <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
          <Zap size={10} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-inter text-ink-muted tracking-wide uppercase">
            {matchPct}% match
          </p>
          <p className="text-[11px] font-inter text-ink truncate">
            {reason}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
