import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Search, X, Sparkles, ArrowRight } from "lucide-react";
import { feedLooks } from "../data/mockData";
import { ProductCard } from "../components/cards/ProductCard";
import { LookDetail } from "../components/cards/LookDetail";


export function SearchPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLook, setSelectedLook] = useState<typeof feedLooks[0] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsAnalyzing(true);
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
      analyzeTimerRef.current = setTimeout(() => {
        analyzeTimerRef.current = null;
        setIsAnalyzing(false);
        setShowResults(true);
      }, 2000);
    }
  };

  const handleDemoAnalyze = () => {
    setUploadedImage(feedLooks[0].image);
    setIsAnalyzing(true);
    if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    analyzeTimerRef.current = setTimeout(() => {
      analyzeTimerRef.current = null;
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const resetSearch = () => {
    if (analyzeTimerRef.current) {
      clearTimeout(analyzeTimerRef.current);
      analyzeTimerRef.current = null;
    }
    if (uploadedImage && uploadedImage.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setShowResults(false);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    return () => {
      if (uploadedImage && uploadedImage.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  useEffect(() => {
    return () => {
      if (analyzeTimerRef.current) clearTimeout(analyzeTimerRef.current);
    };
  }, []);

  const matchedLook = feedLooks[0];

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-editorial text-2xl text-ink">Shop the Look</h1>
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
          Upload any image. Find every piece.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!uploadedImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Upload area */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-ink/10 flex flex-col items-center justify-center bg-ivory cursor-pointer hover:border-ink/20 transition-colors mb-6"
            >
              <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mb-4">
                <Camera size={28} className="text-ink-muted" />
              </div>
              <p className="font-inter text-sm text-ink mb-1">
                Tap to upload a photo
              </p>
              <p className="font-inter text-xs text-ink-muted">
                or drag and drop an image
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream border border-ink/10">
                  <Upload size={14} className="text-ink-muted" />
                  <span className="text-xs font-inter text-ink-light">Gallery</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream border border-ink/10">
                  <Camera size={14} className="text-ink-muted" />
                  <span className="text-xs font-inter text-ink-light">Camera</span>
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
              className="w-full py-4 rounded-2xl bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2 mb-8"
            >
              <Sparkles size={16} />
              Try with a sample look
            </motion.button>

            {/* Trending searches */}
            <div>
              <h3 className="font-editorial text-lg text-ink mb-4">Trending Now</h3>
              <div className="grid grid-cols-2 gap-3">
                {feedLooks.slice(0, 4).map((look, i) => (
                  <motion.div
                    key={look.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
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
                src={uploadedImage}
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
                  src={uploadedImage}
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
            look={selectedLook}
            onClose={() => setSelectedLook(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
