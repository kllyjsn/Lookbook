import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Search, X, Sparkles, ArrowRight, TrendingUp, Hash } from "lucide-react";
import { feedLooks } from "../data/mockData";
import { ProductCard } from "../components/cards/ProductCard";
import { LookDetail } from "../components/cards/LookDetail";
import { useStore } from "../stores/useStore";

const exploreTags = [
  { label: "Quiet Luxury", count: "12.4K looks" },
  { label: "Office Siren", count: "8.9K looks" },
  { label: "Mob Wife", count: "15.2K looks" },
  { label: "Old Money", count: "21.1K looks" },
  { label: "Coquette", count: "9.7K looks" },
  { label: "Coastal Cowgirl", count: "6.3K looks" },
];

const editorPicks = [
  { title: "The Capsule Edit", subtitle: "10 pieces, 30 outfits", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop&q=80" },
  { title: "Date Night Decoded", subtitle: "From first date to anniversary", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop&q=80" },
  { title: "Under $200 Finds", subtitle: "Style on any budget", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop&q=80" },
];

export function SearchPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setShowLookDetail = useStore((s) => s.setShowLookDetail);
  const showLookDetail = useStore((s) => s.showLookDetail);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handleDemoAnalyze = () => {
    setUploadedImage(feedLooks[0].image);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const resetSearch = () => {
    setUploadedImage(null);
    setShowResults(false);
    setIsAnalyzing(false);
    setSearchQuery("");
  };

  const matchedLook = feedLooks[0];

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-editorial text-2xl text-ink">Discover</h1>
          {uploadedImage && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={resetSearch}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
            >
              <X size={14} />
            </motion.button>
          )}
        </div>

        {/* Search bar */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isSearchFocused ? "border-ink/30 bg-white" : "border-ink/10 bg-ivory"}`}>
          <Search size={16} className="text-ink-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search looks, brands, styles..."
            className="flex-1 bg-transparent text-sm font-inter text-ink placeholder:text-ink-muted outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={14} className="text-ink-muted" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedImage && !searchQuery ? (
          <motion.div
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Upload area - compact */}
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => fileInputRef.current?.click()}
              className="relative h-32 rounded-2xl border-2 border-dashed border-ink/10 flex items-center justify-center bg-ivory cursor-pointer hover:border-ink/20 transition-colors mb-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center">
                  <Camera size={22} className="text-ink-muted" />
                </div>
                <div>
                  <p className="font-inter text-sm text-ink font-medium">
                    Shop the Look
                  </p>
                  <p className="font-inter text-xs text-ink-muted">
                    Upload any photo to find every piece
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </motion.div>

            {/* Demo button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoAnalyze}
              className="w-full py-3.5 rounded-2xl bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2 mb-8"
            >
              <Sparkles size={16} />
              Try with a sample look
            </motion.button>

            {/* Trending tags */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-rose" />
                <h3 className="font-editorial text-lg text-ink">Trending Aesthetics</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {exploreTags.map((tag, i) => (
                  <motion.div
                    key={tag.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-ivory border border-ink/5 cursor-pointer hover:bg-ink/5 transition-colors"
                  >
                    <Hash size={14} className="text-ink-muted shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-inter text-ink font-medium truncate">{tag.label}</p>
                      <p className="text-[10px] font-inter text-ink-muted">{tag.count}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Editor's Picks */}
            <div className="mb-8">
              <h3 className="font-editorial text-lg text-ink mb-4">Editor's Picks</h3>
              <div className="space-y-3">
                {editorPicks.map((pick, i) => (
                  <motion.div
                    key={pick.title}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex gap-4 items-center cursor-pointer group"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0">
                      <img src={pick.image} alt={pick.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="font-inter font-semibold text-sm text-ink">{pick.title}</p>
                      <p className="text-[11px] font-inter text-ink-muted">{pick.subtitle}</p>
                    </div>
                    <ArrowRight size={14} className="text-ink-muted ml-auto shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trending grid */}
            <div>
              <h3 className="font-editorial text-lg text-ink mb-4">Explore Looks</h3>
              <div className="grid grid-cols-2 gap-3">
                {feedLooks.slice(0, 6).map((look, i) => (
                  <motion.div
                    key={look.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setShowLookDetail(look)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                      <img
                        src={look.image}
                        alt={look.title}
                        className="img-editorial group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                        <p className="text-white text-xs font-inter font-medium">
                          {look.title}
                        </p>
                        <p className="text-white/60 text-[10px] font-inter mt-0.5">
                          {look.items.length} pieces
                        </p>
                      </div>
                      {i === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose text-white text-[8px] font-inter font-bold tracking-wider">
                          HOT
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : searchQuery && !uploadedImage ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            <p className="text-xs font-inter text-ink-muted mb-4">
              Showing results for &ldquo;{searchQuery}&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-3">
              {feedLooks
                .filter(
                  (l) =>
                    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    l.tags.some((t) =>
                      t.label.toLowerCase().includes(searchQuery.toLowerCase())
                    ) ||
                    l.occasion.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((look, i) => (
                  <motion.div
                    key={look.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setShowLookDetail(look)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                      <img
                        src={look.image}
                        alt={look.title}
                        className="img-editorial group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                        <p className="text-white text-xs font-inter font-medium">
                          {look.title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6 flex flex-col items-center"
          >
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-6">
              <img
                src={uploadedImage!}
                alt="Uploaded"
                className="img-editorial"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-2 border-white/30 border-t-white"
                />
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <p className="font-subhead text-lg text-ink italic text-center">
                Analyzing your look...
              </p>
              <p className="font-inter text-xs text-ink-muted text-center mt-1">
                Finding similar items across hundreds of shops
              </p>
            </motion.div>
          </motion.div>
        ) : showResults ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Analyzed image thumbnail */}
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={uploadedImage!}
                  alt="Analyzed"
                  className="img-editorial"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={14} className="text-gold" />
                  <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold">
                    Match found
                  </span>
                </div>
                <h3 className="font-editorial text-lg text-ink mb-1">
                  {matchedLook.title}
                </h3>
                <p className="text-xs font-inter text-ink-muted">
                  {matchedLook.items.length} items identified · {matchedLook.priceRange}
                </p>
              </div>
            </div>

            {/* Get Exact Look */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLookDetail(matchedLook)}
              className="w-full py-3.5 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2 mb-8"
            >
              Get This Exact Look
              <ArrowRight size={16} />
            </motion.button>

            {/* Matched items */}
            <h3 className="font-editorial text-lg text-ink mb-4">
              Items We Found
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {matchedLook.items.map((item, i) => (
                <ProductCard key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* Similar looks */}
            <h3 className="font-editorial text-lg text-ink mb-4">
              Similar Looks
            </h3>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {feedLooks.slice(1, 5).map((look, i) => (
                <motion.div
                  key={look.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setShowLookDetail(look)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="img-editorial group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                      <p className="text-white text-xs font-inter font-medium">
                        {look.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Look Detail overlay */}
      <AnimatePresence>
        {showLookDetail && (
          <LookDetail
            look={showLookDetail}
            onClose={() => setShowLookDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
