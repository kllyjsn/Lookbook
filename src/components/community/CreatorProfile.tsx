import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BadgeCheck, Grid3X3, ListChecks } from "lucide-react";
import type { Creator, CommunityPost, MustHaveList } from "../../data/communityData";
import { communityPosts, mustHaveLists } from "../../data/communityData";
import { FollowButton } from "./FollowButton";
import { MustHaveCard } from "./MustHaveCard";

interface CreatorProfileProps {
  creator: Creator;
  onClose: () => void;
  onPostTap: (post: CommunityPost) => void;
  onMustHaveTap: (list: MustHaveList) => void;
}

function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

type ProfileTab = "posts" | "lists";

export function CreatorProfile({ creator, onClose, onPostTap, onMustHaveTap }: CreatorProfileProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  const creatorPosts = communityPosts.filter((p) => p.creator.id === creator.id);
  const creatorLists = mustHaveLists.filter((l) => l.creator.id === creator.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto">
        {/* Hero banner */}
        <div className="relative h-48 bg-gradient-to-br from-ink via-charcoal to-ink">
          <div className="absolute inset-0 opacity-20">
            <img
              src={creator.avatar}
              alt=""
              className="w-full h-full object-cover blur-2xl"
            />
          </div>

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center z-10"
          >
            <X size={18} className="text-ink" />
          </motion.button>

          {/* LKBK masthead */}
          <div className="absolute top-6 left-6">
            <span className="text-masthead text-sm text-white/60">LKBK</span>
          </div>
        </div>

        {/* Profile info */}
        <div className="px-6 -mt-12 relative">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <img
              src={creator.avatar}
              alt={creator.displayName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-cream"
            />
            {creator.verified && (
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-cream flex items-center justify-center">
                <BadgeCheck size={18} className="text-gold" fill="currentColor" />
              </div>
            )}
          </div>

          {/* Name + handle */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="font-editorial text-2xl text-ink">{creator.displayName}</h1>
              <p className="text-sm font-inter text-ink-muted">@{creator.username}</p>
            </div>
            <FollowButton creatorId={creator.id} size="md" />
          </div>

          {/* Bio */}
          <p className="font-subhead text-base text-ink-light italic leading-relaxed mb-5">
            {creator.bio}
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mb-5">
            <div className="text-center">
              <p className="font-inter font-semibold text-ink text-lg">{creatorPosts.length}</p>
              <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-inter font-semibold text-ink text-lg">{formatFollowers(creator.followers)}</p>
              <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-inter font-semibold text-ink text-lg">{formatFollowers(creator.following)}</p>
              <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">Following</p>
            </div>
          </div>

          {/* Style tags */}
          <div className="flex gap-2 mb-6">
            {creator.styleTags.map((tag) => (
              <span
                key={tag.label}
                className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted border border-ink/10 rounded-full px-3 py-1.5"
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Content tabs */}
          <div className="flex gap-1 bg-ivory rounded-xl p-1 mb-6">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-inter font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "posts"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted"
              }`}
            >
              <Grid3X3 size={14} />
              Posts
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab("lists")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-inter font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "lists"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted"
              }`}
            >
              <ListChecks size={14} />
              Must Haves
              {creatorLists.length > 0 && (
                <span className="bg-gold/10 text-gold text-[10px] rounded-full px-1.5">
                  {creatorLists.length}
                </span>
              )}
            </motion.button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "posts" && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pb-24"
              >
                {creatorPosts.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <Grid3X3 size={28} className="text-ink/10 mb-2" />
                    <p className="text-sm font-inter text-ink-muted">No posts yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {creatorPosts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => onPostTap(post)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="img-editorial group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                            <p className="text-white text-xs font-inter font-medium">
                              {post.title}
                            </p>
                            <p className="text-white/50 text-[10px] font-inter">
                              {post.occasion} · ❤ {post.likes.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "lists" && (
              <motion.div
                key="lists"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pb-24 space-y-4"
              >
                {creatorLists.length === 0 ? (
                  <div className="flex flex-col items-center py-12">
                    <ListChecks size={28} className="text-ink/10 mb-2" />
                    <p className="text-sm font-inter text-ink-muted">No must-have lists yet</p>
                  </div>
                ) : (
                  creatorLists.map((list, i) => (
                    <MustHaveCard key={list.id} list={list} index={i} onTap={onMustHaveTap} />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
