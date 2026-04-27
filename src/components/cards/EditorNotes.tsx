import { motion } from "framer-motion";
import { Sparkles, Palette, Check, X as XIcon } from "lucide-react";
import type { EditorNote } from "../../data/trendData";

interface EditorNotesProps {
  note: EditorNote;
}

export function EditorNotes({ note }: EditorNotesProps) {
  return (
    <div className="space-y-6">
      {/* Color Story */}
      <div>
        <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3 flex items-center gap-2">
          <Palette size={12} />
          COLOR STORY
        </h3>
        <div className="flex gap-2 mb-2">
          {note.colorStory.map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
              className="flex-1 aspect-[3/4] rounded-xl relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-x-0 bottom-0 p-1.5">
                <span className="text-[7px] font-inter tracking-wider uppercase text-white/70 mix-blend-difference">
                  {color}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Editor's Voice */}
      <div>
        <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3 flex items-center gap-2">
          <Sparkles size={12} />
          EDITOR'S NOTES
        </h3>
        <div className="p-4 rounded-xl bg-ivory border-l-2 border-gold">
          <p className="font-subhead text-base text-ink-light italic leading-relaxed">
            "{note.editorsVoice}"
          </p>
        </div>
      </div>

      {/* Styling Tip */}
      <div>
        <h3 className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-3">
          STYLING TIP
        </h3>
        <p className="text-sm font-inter text-ink leading-relaxed">
          {note.stylingTip}
        </p>
      </div>

      {/* Pairs With / Avoid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[10px] font-inter tracking-[0.15em] uppercase text-green-700 mb-2 flex items-center gap-1">
            <Check size={10} />
            Pairs with
          </h4>
          <ul className="space-y-1.5">
            {note.pairsWith.map((item) => (
              <li key={item} className="text-xs font-inter text-ink-light flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-inter tracking-[0.15em] uppercase text-rose mb-2 flex items-center gap-1">
            <XIcon size={10} />
            Avoid with
          </h4>
          <ul className="space-y-1.5">
            {note.avoidWith.map((item) => (
              <li key={item} className="text-xs font-inter text-ink-light flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-rose" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
