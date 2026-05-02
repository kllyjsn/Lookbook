import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, BadgeCheck, Pin, Send } from "lucide-react";
import {
  getCommentsFor,
  avatarUrl,
  type LookComment,
} from "../../data/commentsData";

interface LookCommentsProps {
  lookId: string;
}

export function LookComments({ lookId }: LookCommentsProps) {
  const seed = useMemo(() => getCommentsFor(lookId), [lookId]);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<LookComment[]>([]);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const all = useMemo(() => {
    return [...seed, ...extra].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (b.pinned && !a.pinned) return 1;
      return 0;
    });
  }, [seed, extra]);

  const handlePost = () => {
    if (!draft.trim()) return;
    const id = `me-${Date.now()}`;
    setExtra((prev) => [
      ...prev,
      {
        id,
        author: "You",
        handle: "you",
        avatarSeed: "photo-1438761681033-6461ffad8d80",
        body: draft.trim(),
        likes: 0,
        postedAgo: "now",
      },
    ]);
    setDraft("");
  };

  const toggleLike = (id: string) => {
    setLikedIds((p) => ({ ...p, [id]: !p[id] }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-editorial text-xl text-ink">The Discussion</h3>
        <span className="text-xs font-inter text-ink-muted">
          {all.length} {all.length === 1 ? "comment" : "comments"}
        </span>
      </div>

      {/* Draft input */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePost()}
          placeholder="Add a comment…"
          className="flex-1 bg-ivory rounded-full px-4 py-2.5 text-sm font-inter text-ink outline-none border border-ink/10 focus:border-ink/30"
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handlePost}
          disabled={!draft.trim()}
          className="w-10 h-10 rounded-full bg-ink text-cream flex items-center justify-center disabled:opacity-40"
          aria-label="Post comment"
        >
          <Send size={14} />
        </motion.button>
      </div>

      <div className="space-y-4">
        {all.map((c, i) => {
          const liked = likedIds[c.id];
          const likeDelta = liked ? 1 : 0;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex gap-3 ${
                c.pinned
                  ? "p-3 -mx-3 rounded-2xl bg-gradient-to-br from-gold/5 to-blush/5 border border-gold/20"
                  : ""
              }`}
            >
              <img
                src={avatarUrl(c.avatarSeed)}
                alt={c.author}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-inter font-semibold text-ink truncate">
                    {c.author}
                  </span>
                  {c.isEditor && (
                    <BadgeCheck size={12} className="text-gold flex-shrink-0" fill="currentColor" />
                  )}
                  {c.pinned && (
                    <span className="flex items-center gap-1 text-[8px] font-inter font-bold tracking-[0.15em] uppercase text-gold/80">
                      <Pin size={9} />
                      Pinned
                    </span>
                  )}
                  <span className="text-[11px] font-inter text-ink-muted ml-auto flex-shrink-0">
                    {c.postedAgo}
                  </span>
                </div>
                <p className={`text-sm font-inter leading-relaxed ${c.isEditor ? "text-ink" : "text-ink-light"}`}>
                  {c.body}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    onClick={() => toggleLike(c.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      size={12}
                      className={liked ? "text-rose" : "text-ink-muted"}
                      fill={liked ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                    <span className={`text-[11px] font-inter ${liked ? "text-rose" : "text-ink-muted"}`}>
                      {c.likes + likeDelta}
                    </span>
                  </button>
                  <button className="text-[11px] font-inter text-ink-muted">
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
