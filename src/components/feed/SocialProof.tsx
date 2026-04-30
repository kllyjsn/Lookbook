import { motion } from "framer-motion";
import { TrendingUp, MapPin, Users } from "lucide-react";
import type { Look } from "../../data/mockData";

const proofMessages: Record<string, { icon: typeof TrendingUp; text: string }> = {
  "look-1": { icon: TrendingUp, text: "2.1K loved today" },
  "look-2": { icon: Users, text: "Saved 890 times this week" },
  "look-3": { icon: TrendingUp, text: "Rising fast right now" },
  "look-4": { icon: MapPin, text: "Trending in NYC" },
  "look-5": { icon: Users, text: "1.4K saves this week" },
  "look-6": { icon: TrendingUp, text: "Your style match" },
  "look-7": { icon: MapPin, text: "Trending in London" },
  "look-8": { icon: TrendingUp, text: "3.8K loved today" },
  "look-9": { icon: TrendingUp, text: "Most saved this month" },
  "look-10": { icon: MapPin, text: "Trending in Copenhagen" },
  "look-11": { icon: Users, text: "Editor favorite" },
  "look-12": { icon: MapPin, text: "Trending in Tokyo" },
  "look-13": { icon: TrendingUp, text: "5.2K loved today" },
  "look-14": { icon: Users, text: "Going viral" },
  "look-15": { icon: TrendingUp, text: "Fast riser" },
  "look-16": { icon: MapPin, text: "Festival season pick" },
};

interface SocialProofProps {
  look: Look;
}

export function SocialProof({ look }: SocialProofProps) {
  const proof = proofMessages[look.id];
  if (!proof) return null;

  const Icon = proof.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/10"
    >
      <Icon size={9} className="text-white/70" />
      <span className="text-[9px] font-inter text-white/70 font-medium">
        {proof.text}
      </span>
    </motion.div>
  );
}
