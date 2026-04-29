import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BadgeCheck, Sparkles, Clock, TrendingUp, Eye } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { PostCard } from "../components/community/PostCard";
import { CreatorProfile } from "../components/community/CreatorProfile";
import { MustHaveCard } from "../components/community/MustHaveCard";
import { MustHaveDetail } from "../components/community/MustHaveDetail";
import { FollowButton } from "../components/community/FollowButton";
import { ProductCard } from "../components/cards/ProductCard";
import { useStore } from "../stores/useStore";
import { creators, communityPosts, mustHaveLists } from "../data/communityData";
import type { Creator, CommunityPost, MustHaveList } from "../data/communityData";
import { trendingAesthetics, feedLooks } from "../data/mockData";


type CommunityTab = "forYou" | "following" | "mustHaves";

function PostShopOverlay({
  post,
  onClose,
}: {
  post: CommunityPost;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream"
    >
      <div className="h-full overflow-y-auto">
        <div className="relative w-full aspect-[3/4] max-h-[50vh]">
          <img src={post.image} alt={post.title} className="img-editorial" />
          <div className="absolute inset-x-0 bottom-0 gradient-bottom p-6 pb-8">
            <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-white/60 block mb-2">
              SHOP THE LOOK
            </span>
            <h1 className="font-editorial text-3xl text-white leading-tight">
              {post.title}
            </h1>
            <p className="text-xs font-inter text-white/60 mt-1">
              by {post.creator.displayName}
            </p>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <span className="text-ink text-lg">×</span>
          </motion.button>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            {post.items.map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CommunityPage() {
  const [activeTab, setActiveTab] = useState<CommunityTab>("forYou");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedMustHave, setSelectedMustHave] = useState<MustHaveList | null>(null);
  const [shopPost, setShopPost] = useState<CommunityPost | null>(null);

  const followedCreators = useStore((s) => s.followedCreators);

  const followingPosts = useMemo(
    () => communityPosts.filter((p) => followedCreators.includes(p.creator.id)),
    [followedCreators]
  );

  const displayPosts = activeTab === "following" ? followingPosts : communityPosts;

  const handleCreatorTap = (creatorId: string) => {
    const creator = creators.find((c) => c.id === creatorId);
    if (creator) setSelectedCreator(creator);
  };

  const handleMustHaveTap = (list: MustHaveList) => {
    setSelectedMustHave(list);
  };

  const handleShopTap = (post: CommunityPost) => {
    setShopPost(post);
  };

  const topCreators = creators.slice(0, 6);

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center justify-between mb-1">
          <Logo variant="mark" size="sm" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-ink/10"
          >
            <Search size={16} className="text-ink-muted" />
          </motion.button>
        </div>
        <h1 className="font-editorial text-2xl text-ink mb-0.5">Community</h1>
        <p className="font-subhead text-sm text-ink-muted italic">
          Discover creators. Follow their style.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="px-6 mb-5">
        <div className="flex gap-1 bg-ivory rounded-xl p-1">
          {([
            { id: "forYou" as const, label: "For You" },
            { id: "following" as const, label: "Following" },
            { id: "mustHaves" as const, label: "Must Haves" },
          ]).map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-inter font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* For You + Following tabs */}
        {(activeTab === "forYou" || activeTab === "following") && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* OOTD Challenge banner (For You only) */}
            {activeTab === "forYou" && (
              <div className="px-6 mb-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=300&fit=crop&q=80"
                    alt="OOTD Challenge"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center p-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles size={12} className="text-gold" />
                        <span className="text-[9px] font-inter font-bold tracking-[0.2em] uppercase text-gold">
                          Daily Challenge
                        </span>
                      </div>
                      <h3 className="font-editorial text-lg text-white leading-tight mb-1">
                        OOTD: Summer Whites
                      </h3>
                      <p className="text-[11px] font-inter text-white/60 mb-2">
                        Style an all-white look. Best picks get featured.
                      </p>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-1.5 rounded-full bg-gold text-white text-[10px] font-inter font-semibold"
                        >
                          Join Challenge
                        </motion.button>
                        <span className="flex items-center gap-1 text-[10px] font-inter text-white/40">
                          <Clock size={10} />
                          8h left
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Trending Aesthetics carousel (For You only) */}
            {activeTab === "forYou" && (
              <div className="mb-6">
                <div className="px-6 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-rose" />
                    <h2 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted">
                      Trending Aesthetics
                    </h2>
                  </div>
                  <span className="text-[9px] font-inter text-ink-muted tracking-wider uppercase">
                    On TikTok now
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto px-6 pb-2 no-select" style={{ scrollbarWidth: "none" }}>
                  {trendingAesthetics.map((aesthetic, i) => (
                    <motion.div
                      key={aesthetic.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex-shrink-0 w-36 h-24 rounded-xl bg-gradient-to-br ${aesthetic.gradient} p-3 flex flex-col justify-between cursor-pointer`}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const look = feedLooks.find((l) => l.id === aesthetic.lookIds[0]);
                        if (look) {
                          const setShowLookDetail = useStore.getState().setShowLookDetail;
                          setShowLookDetail(look);
                        }
                      }}
                    >
                      <h3 className={`font-editorial text-base leading-tight ${aesthetic.textDark ? "text-ink" : "text-white"}`}>
                        {aesthetic.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Eye size={10} className={aesthetic.textDark ? "text-ink/50" : "text-white/60"} />
                        <span className={`text-[9px] font-inter font-medium ${aesthetic.textDark ? "text-ink/50" : "text-white/60"}`}>
                          {aesthetic.views} views
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured creators row (For You only) */}
            {activeTab === "forYou" && (
              <div className="mb-6">
                <div className="px-6 mb-3">
                  <h2 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted">
                    Featured Creators
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-select" style={{ scrollbarWidth: "none" }}>
                  {topCreators.map((creator, i) => (
                    <motion.button
                      key={creator.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCreator(creator)}
                      className="flex flex-col items-center gap-2 flex-shrink-0 w-[72px]"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-gold to-blush">
                          <img
                            src={creator.avatar}
                            alt={creator.displayName}
                            className="w-full h-full rounded-full object-cover border-2 border-cream"
                          />
                        </div>
                        {creator.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cream flex items-center justify-center">
                            <BadgeCheck size={12} className="text-gold" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-inter text-ink-muted truncate w-full text-center">
                        @{creator.username}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Posts feed */}
            <div className="px-6">
              {displayPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mb-4">
                    <span className="font-editorial text-2xl text-ink-muted">?</span>
                  </div>
                  <p className="font-editorial text-lg text-ink mb-1">
                    No posts yet
                  </p>
                  <p className="text-xs font-inter text-ink-muted text-center max-w-[240px]">
                    {activeTab === "following"
                      ? "Follow creators to see their posts here"
                      : "Check back soon for new content"}
                  </p>
                  {activeTab === "following" && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("forYou")}
                      className="mt-4 px-6 py-2.5 rounded-full bg-ink text-cream text-sm font-inter font-medium"
                    >
                      Discover Creators
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                displayPosts.map((post, i) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={i}
                    onCreatorTap={handleCreatorTap}
                    onShopTap={handleShopTap}
                  />
                ))
              )}
            </div>

            {/* Suggested creators (after feed in For You) */}
            {activeTab === "forYou" && (
              <div className="px-6 py-6 mt-2">
                <h2 className="font-editorial text-lg text-ink mb-4">
                  Creators to Follow
                </h2>
                <div className="space-y-3">
                  {creators.slice(0, 4).map((creator, i) => (
                    <motion.div
                      key={creator.id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-ivory"
                    >
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCreator(creator)}
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={creator.avatar}
                            alt={creator.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {creator.verified && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-ivory flex items-center justify-center">
                              <BadgeCheck size={12} className="text-gold" fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-inter font-semibold text-ink truncate">
                            {creator.displayName}
                          </p>
                          <p className="text-[11px] font-inter text-ink-muted">
                            {creator.styleTags.map((t) => t.label).join(" · ")}
                          </p>
                        </div>
                      </motion.div>
                      <FollowButton creatorId={creator.id} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Must Haves tab */}
        {activeTab === "mustHaves" && (
          <motion.div
            key="mustHaves"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 space-y-6"
          >
            <p className="font-subhead text-sm text-ink-light italic">
              Curated essentials by top creators. The pieces they swear by.
            </p>
            {mustHaveLists.map((list, i) => (
              <MustHaveCard
                key={list.id}
                list={list}
                index={i}
                onTap={handleMustHaveTap}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <AnimatePresence>
        {selectedCreator && (
          <CreatorProfile
            key={selectedCreator.id}
            creator={selectedCreator}
            onClose={() => setSelectedCreator(null)}
            onPostTap={(post) => {
              setShopPost(post);
            }}
            onMustHaveTap={(list) => {
              setSelectedCreator(null);
              setSelectedMustHave(list);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMustHave && (
          <MustHaveDetail
            key={selectedMustHave.id}
            list={selectedMustHave}
            onClose={() => setSelectedMustHave(null)}
            onCreatorTap={(creatorId) => {
              setSelectedMustHave(null);
              handleCreatorTap(creatorId);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shopPost && (
          <PostShopOverlay
            key={shopPost.id}
            post={shopPost}
            onClose={() => setShopPost(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
