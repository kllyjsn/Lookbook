import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Search, X, Sparkles, ArrowRight, TrendingUp, Flame } from "lucide-react";
import { feedLooks } from "../data/mockData";
import { ProductCard } from "../components/cards/ProductCard";
import { LookDetail } from "../components/cards/LookDetail";
import { trendingTags, discoverCategories } from "../data/trendData";


export function SearchPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLook, setSelectedLook] = useState<typeof feedLooks[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return feedLooks.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.tags.some((t) => t.label.toLowerCase().includes(q)) ||
        l.occasion.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);


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
  };

  const matchedLook = feedLooks[0];

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
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
        <p className="font-subhead text-sm text-ink-muted italic">
          Search, explore, and shop every piece.
        </p>

        {/* Text search bar */}
        <div className="relative mt-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search looks, styles, occasions..."
            className="w-full bg-ivory rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-ink outline-none border border-ink/5 focus:border-ink/20 transition-colors"
          />
          {searchQuery && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-ink-muted" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Text search results */}
      {searchQuery.trim() && (
        <div className="px-6 pb-6">
          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <Search size={24} className="text-ink/10 mb-2" />
              <p className="text-sm font-inter text-ink-muted">No results for "{searchQuery}"</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-inter text-ink-muted mb-3">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {searchResults.map((look, i) => (
                  <motion.div
                    key={look.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedLook(look)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                      <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                        <p className="text-white text-xs font-inter font-medium">{look.title}</p>
                        <p className="text-white/50 text-[10px] font-inter">{look.occasion}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!uploadedImage && !searchQuery.trim() ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Trending Tags */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-rose" />
                <h3 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted">
                  Trending Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((item, i) => (
                  <motion.button
                    key={item.tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery(item.tag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ivory border border-ink/5 hover:border-ink/15 transition-colors"
                  >
                    {item.hot && <Flame size={10} className="text-rose" />}
                    <span className="text-xs font-inter text-ink">{item.tag}</span>
                    <span className="text-[10px] font-inter text-ink-muted">{item.count}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Shop by Occasion */}
            <div className="mb-6">
              <h3 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted mb-3">
                Shop by Occasion
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {discoverCategories.map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSearchQuery(cat.label)}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-1.5">
                      <img src={cat.image} alt={cat.label} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-inter font-medium">{cat.label}</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-inter text-ink-muted text-center">{cat.count} looks</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Photo Search Upload */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-[2/1] rounded-2xl border-2 border-dashed border-ink/10 flex flex-col items-center justify-center bg-ivory cursor-pointer hover:border-ink/20 transition-colors mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center mb-3">
                <Camera size={22} className="text-ink-muted" />
              </div>
              <p className="font-inter text-sm text-ink mb-0.5">
                Photo Search
              </p>
              <p className="font-inter text-[10px] text-ink-muted">
                Upload an image to find matching pieces
              </p>
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
              className="w-full py-3 rounded-xl bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2 mb-6"
            >
              <Sparkles size={14} />
              Try with a sample look
            </motion.button>

            {/* Trending looks grid */}
            <div>
              <h3 className="font-editorial text-lg text-ink mb-4">Trending Now</h3>
              <div className="grid grid-cols-2 gap-3">
                {feedLooks.slice(0, 4).map((look, i) => (
                  <motion.div
                    key={look.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => {
                      setSelectedLook(look);
                    }}
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
                src={uploadedImage ?? undefined}
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
                  src={uploadedImage ?? undefined}
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
              onClick={() => setSelectedLook(matchedLook)}
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
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedLook(look)}
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
        {selectedLook && (
          <LookDetail
            key={selectedLook.id}
            look={selectedLook}
            onClose={() => setSelectedLook(null)}
            onLookTap={(l) => setSelectedLook(l)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
