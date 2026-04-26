import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface StylingNotesProps {
  notes: string[];
}

export function StylingNotes({ notes }: StylingNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={16} className="text-gold" />
        <h3 className="font-editorial text-lg text-ink">Why It Works</h3>
      </div>
      <div className="space-y-3">
        {notes.map((note, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center mt-0.5">
              <span className="text-[10px] font-inter font-semibold text-gold">
                {i + 1}
              </span>
            </div>
            <p className="font-subhead text-base text-ink-light leading-relaxed italic flex-1">
              {note}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
