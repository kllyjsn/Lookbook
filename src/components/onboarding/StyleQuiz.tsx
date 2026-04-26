import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../../stores/useStore";
import { Logo } from "../ui/Logo";

const UNSPLASH = (id: string, w = 600, h = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

interface StyleOption {
  id: string;
  label: string;
  image: string;
}

const styleOptions: StyleOption[] = [
  { id: "minimalist", label: "Minimalist", image: UNSPLASH("photo-1509631179647-0177331693ae") },
  { id: "streetwear", label: "Streetwear", image: UNSPLASH("photo-1515886657613-9f3515b0c78f") },
  { id: "romantic", label: "Romantic", image: UNSPLASH("photo-1496747611176-843222e1e57c") },
  { id: "classic", label: "Classic", image: UNSPLASH("photo-1539109136881-3be0616acf4b") },
  { id: "avant-garde", label: "Avant-Garde", image: UNSPLASH("photo-1485968579580-b6d095142e6e") },
  { id: "bohemian", label: "Bohemian", image: UNSPLASH("photo-1529139574466-a303027c1d8b") },
];

const brandOptions = [
  { id: "cos", label: "COS" },
  { id: "zara", label: "Zara" },
  { id: "aritzia", label: "Aritzia" },
  { id: "reformation", label: "Reformation" },
  { id: "allsaints", label: "AllSaints" },
  { id: "toteme", label: "Totême" },
  { id: "acne", label: "Acne Studios" },
  { id: "therow", label: "The Row" },
  { id: "maxmara", label: "Max Mara" },
  { id: "sezane", label: "Sézane" },
  { id: "everlane", label: "Everlane" },
  { id: "mejuri", label: "Mejuri" },
];

const budgetOptions = [
  { id: "budget", label: "Under $100", desc: "Smart finds" },
  { id: "mid", label: "$100 – $500", desc: "Best value" },
  { id: "premium", label: "$500 – $1,500", desc: "Investment pieces" },
  { id: "luxury", label: "$1,500+", desc: "No limits" },
];

type Step = "welcome" | "styles" | "brands" | "budget" | "ready";

export function StyleQuiz() {
  const [step, setStep] = useState<Step>("welcome");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("mid");
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const updateStyleDNA = useStore((s) => s.updateStyleDNA);
  const setBudgetPreference = useStore((s) => s.setBudgetPreference);

  const handleComplete = () => {
    const colors = ["#1A1A1A", "#C5A572", "#C4797A", "#B8A9C9", "#A8B5A0", "#E8D5D0"];
    const rawEntries = selectedStyles.map((id, i) => {
      const option = styleOptions.find((o) => o.id === id);
      return {
        style: option?.label ?? id,
        rawPct: Math.max(15, 90 - i * 20),
        color: colors[i % colors.length],
      };
    });
    const total = rawEntries.reduce((sum, d) => sum + d.rawPct, 0);
    const styleDNA = rawEntries.map(({ rawPct, ...rest }) => ({
      ...rest,
      percentage: Math.round((rawPct / total) * 100),
    }));
    if (styleDNA.length > 0) {
      updateStyleDNA(styleDNA);
    }
    setBudgetPreference(selectedBudget);
    completeOnboarding();
  };

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleBrand = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const steps: Step[] = ["welcome", "styles", "brands", "budget", "ready"];
  const currentIndex = steps.indexOf(step);
  const progress = ((currentIndex) / (steps.length - 1)) * 100;

  return (
    <div className="h-full w-full bg-cream flex flex-col max-w-lg mx-auto relative overflow-hidden">
      {/* Progress bar */}
      {step !== "welcome" && step !== "ready" && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-ink/5 z-10">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Welcome */}
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <Logo variant="full" size="lg" className="mb-12" />
            <h1 className="font-editorial text-4xl text-ink text-center leading-tight mb-3">
              Your Style,
              <br />
              <span className="italic">Curated.</span>
            </h1>
            <p className="font-subhead text-lg text-ink-muted italic text-center mb-12 max-w-xs">
              Swipe through editorial looks, discover your style DNA, and shop
              pieces that are unmistakably you.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep("styles")}
              className="w-full py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium tracking-wide flex items-center justify-center gap-2"
            >
              Let's Find Your Style
              <ArrowRight size={16} />
            </motion.button>
            <button
              onClick={completeOnboarding}
              className="mt-4 text-xs font-inter text-ink-muted tracking-wide"
            >
              Skip for now
            </button>
          </motion.div>
        )}

        {/* Style Selection */}
        {step === "styles" && (
          <motion.div
            key="styles"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col pt-10 px-6"
          >
            <div className="mb-6">
              <p className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-2">
                STEP 1 OF 3
              </p>
              <h2 className="font-editorial text-2xl text-ink mb-1">
                What speaks to you?
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic">
                Pick 2 or more styles you gravitate toward.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-24">
              {styleOptions.map((style, i) => {
                const isSelected = selectedStyles.includes(style.id);
                return (
                  <motion.button
                    key={style.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleStyle(style.id)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden"
                  >
                    <img
                      src={style.image}
                      alt={style.label}
                      className="img-editorial"
                    />
                    <div className={`absolute inset-0 transition-colors duration-200 ${isSelected ? "bg-black/20" : "bg-black/40"}`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-white font-inter text-sm font-medium tracking-wide">
                        {style.label}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </motion.div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-gold ring-inset" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cream via-cream to-transparent pt-16">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("brands")}
                disabled={selectedStyles.length < 2}
                className={`w-full py-4 rounded-full font-inter text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-all ${
                  selectedStyles.length >= 2
                    ? "bg-ink text-cream"
                    : "bg-ink/10 text-ink/30 pointer-events-none"
                }`}
              >
                Continue
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Brand Preferences */}
        {step === "brands" && (
          <motion.div
            key="brands"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col pt-10 px-6"
          >
            <div className="mb-6">
              <p className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-2">
                STEP 2 OF 3
              </p>
              <h2 className="font-editorial text-2xl text-ink mb-1">
                Brands you love
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic">
                We'll prioritize these in your feed.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pb-28">
              {brandOptions.map((brand, i) => {
                const isSelected = selectedBrands.includes(brand.id);
                return (
                  <motion.button
                    key={brand.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleBrand(brand.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-inter font-medium transition-all ${
                      isSelected
                        ? "bg-ink text-cream"
                        : "bg-ivory text-ink border border-ink/5 hover:border-ink/20"
                    }`}
                  >
                    {brand.label}
                  </motion.button>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cream via-cream to-transparent pt-16">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("budget")}
                className="w-full py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium tracking-wide flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Budget */}
        {step === "budget" && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col pt-10 px-6"
          >
            <div className="mb-6">
              <p className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-2">
                STEP 3 OF 3
              </p>
              <h2 className="font-editorial text-2xl text-ink mb-1">
                Your comfort zone
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic">
                Average spend per piece — no judgment, just curation.
              </p>
            </div>

            <div className="space-y-3 pb-28">
              {budgetOptions.map((option, i) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedBudget(option.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${
                    selectedBudget === option.id
                      ? "bg-ink text-cream"
                      : "bg-ivory text-ink hover:bg-ivory/80"
                  }`}
                >
                  <div className="text-left">
                    <p className={`font-inter text-sm font-medium ${selectedBudget === option.id ? "text-cream" : "text-ink"}`}>
                      {option.label}
                    </p>
                    <p className={`text-xs font-inter mt-0.5 ${selectedBudget === option.id ? "text-cream/60" : "text-ink-muted"}`}>
                      {option.desc}
                    </p>
                  </div>
                  {selectedBudget === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-gold flex items-center justify-center"
                    >
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-cream via-cream to-transparent pt-16">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep("ready")}
                className="w-full py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium tracking-wide flex items-center justify-center gap-2"
              >
                See My Feed
                <Sparkles size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Ready */}
        {step === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center mb-8"
            >
              <Sparkles size={32} className="text-white" />
            </motion.div>
            <h2 className="font-editorial text-3xl text-ink text-center leading-tight mb-3">
              Your feed is
              <br />
              <span className="italic">ready.</span>
            </h2>
            <p className="font-subhead text-base text-ink-muted italic text-center mb-10 max-w-xs">
              We've curated looks just for you. Swipe right to love, left to
              pass, and up to shop.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleComplete}
              className="w-full py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium tracking-wide flex items-center justify-center gap-2"
            >
              Start Discovering
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
