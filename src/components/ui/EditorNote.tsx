import { motion } from "framer-motion";
import { Feather } from "lucide-react";

interface EditorNoteProps {
  note: string;
}

export function EditorNote({ note }: EditorNoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative mb-8"
    >
      <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold to-gold/0 rounded-full" />
      <div className="pl-5">
        <div className="flex items-center gap-2 mb-2">
          <Feather size={13} className="text-gold" />
          <span className="text-[10px] font-inter tracking-[0.25em] uppercase text-gold font-semibold">
            Editor's Note
          </span>
        </div>
        <p className="font-subhead text-lg text-ink-light leading-relaxed italic">
          {note}
        </p>
      </div>
    </motion.div>
  );
}
