import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "../../stores/useStore";
import { Logo } from "../ui/Logo";

const UNSPLASH = (id: string, w = 400, h = 500) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

interface StyleOption {
  id: string;
  label: string;
  image: string;
  dnaWeight: string;
}

const styleOptions: StyleOption[] = [
  { id: "minimalist", label: "Minimalist", image: UNSPLASH("photo-1509631179647-0177331693ae"), dnaWeight: "Minimalist" },
  { id: "streetwear", label: "Street Luxe", image: UNSPLASH("photo-1515886657613-9f3515b0c78f"), dnaWeight: "Streetwear" },
  { id: "romantic", label: "Romantic", image: UNSPLASH("photo-1496747611176-843222e1e57c"), dnaWeight: "Romantic" },
  { id: "evening", label: "Evening", image: UNSPLASH("photo-1469334031218-e382a71b716b"), dnaWeight: "Evening" },
  { id: "classic", label: "Classic", image: UNSPLASH("photo-1539109136881-3be0616acf4b"), dnaWeight: "Classic" },
  { id: "bohemian", label: "Bohemian", image: UNSPLASH("photo-1529139574466-a303027c1d8b"), dnaWeight: "Bohemian" },
];

const occasionOptions = [
  { id: "work", label: "Work & Office", icon: "briefcase" },
  { id: "weekend", label: "Weekend Casual", icon: "coffee" },
  { id: "datenight", label: "Date Night", icon: "heart" },
  { id: "events", label: "Events & Galas", icon: "sparkles" },
  { id: "travel", label: "Travel", icon: "sun" },
  { id: "everyday", label: "Everyday", icon: "shirt" },
];

const budgetOptions = [
  { id: "accessible", label: "Accessible", range: "Under $200 per piece", emoji: "" },
  { id: "contemporary", label: "Contemporary", range: "$200 – $500 per piece", emoji: "" },
  { id: "designer", label: "Designer", range: "$500 – $1,000 per piece", emoji: "" },
  { id: "luxury", label: "Luxury", range: "$1,000+ per piece", emoji: "" },
];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const updateStyleDNA = useStore((s) => s.updateStyleDNA);

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleOccasion = (id: string) => {
    setSelectedOccasions((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    const dnaEntries = [
      { style: "Minimalist", percentage: selectedStyles.includes("minimalist") ? 35 : 10, color: "#1A1A1A" },
      { style: "Classic", percentage: selectedStyles.includes("classic") ? 30 : 12, color: "#C5A572" },
      { style: "Streetwear", percentage: selectedStyles.includes("streetwear") ? 25 : 8, color: "#2D2D2D" },
      { style: "Romantic", percentage: selectedStyles.includes("romantic") ? 28 : 10, color: "#C4797A" },
      { style: "Evening", percentage: selectedStyles.includes("evening") ? 22 : 5, color: "#B8A9C9" },
      { style: "Bohemian", percentage: selectedStyles.includes("bohemian") ? 20 : 7, color: "#A8B5A0" },
    ];
    updateStyleDNA(dnaEntries);
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-cream flex flex-col">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="flex-1 flex flex-col"
          >
            {/* Full-bleed hero */}
            <div className="relative flex-1">
              <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1 opacity-60">
                {styleOptions.map((opt) => (
                  <div key={opt.id} className="overflow-hidden rounded-lg">
                    <img
                      src={opt.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/70 to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 pb-12 flex flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Logo variant="full" size="lg" className="mb-6 justify-center" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="font-editorial text-3xl text-ink leading-tight mb-3"
                >
                  Your personal
                  <br />
                  style journey starts here
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="font-subhead text-base text-ink-light italic mb-8"
                >
                  Swipe, discover, and build the wardrobe you've always wanted.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  className="w-full max-w-xs py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
                >
                  Let's Discover Your Style
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="styles"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col"
          >
            <div className="px-6 pt-8 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted">
                  Step 1 of 3
                </span>
                <div className="flex gap-1.5">
                  <div className="w-8 h-1 rounded-full bg-ink" />
                  <div className="w-8 h-1 rounded-full bg-ink/15" />
                  <div className="w-8 h-1 rounded-full bg-ink/15" />
                </div>
              </div>
              <h2 className="font-editorial text-2xl text-ink mt-3 mb-1">
                What speaks to you?
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic">
                Pick the aesthetics that feel like you. Choose at least 2.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((opt, i) => {
                  const isSelected = selectedStyles.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleStyle(opt.id)}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
                    >
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isSelected ? "scale-105" : "group-hover:scale-105"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 transition-colors duration-300 ${
                          isSelected ? "bg-ink/30" : "bg-black/40"
                        }`}
                      />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center"
                        >
                          <span className="text-ink text-sm font-bold">&#10003;</span>
                        </motion.div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <span className="font-editorial text-lg text-white">
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 rounded-2xl ring-2 ring-white ring-inset pointer-events-none"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 pb-8 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(2)}
                disabled={selectedStyles.length < 2}
                className={`w-full py-4 rounded-full font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  selectedStyles.length >= 2
                    ? "bg-ink text-cream"
                    : "bg-ink/10 text-ink-muted cursor-not-allowed"
                }`}
              >
                Continue
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="occasions"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col"
          >
            <div className="px-6 pt-8 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted">
                  Step 2 of 3
                </span>
                <div className="flex gap-1.5">
                  <div className="w-8 h-1 rounded-full bg-ink" />
                  <div className="w-8 h-1 rounded-full bg-ink" />
                  <div className="w-8 h-1 rounded-full bg-ink/15" />
                </div>
              </div>
              <h2 className="font-editorial text-2xl text-ink mt-3 mb-1">
                Where do you dress for?
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic">
                Select all that apply. We'll tailor your feed.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-3">
                {occasionOptions.map((opt, i) => {
                  const isSelected = selectedOccasions.includes(opt.id);
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleOccasion(opt.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all text-left ${
                        isSelected
                          ? "bg-ink text-cream"
                          : "bg-ivory text-ink hover:bg-ivory/80"
                      }`}
                    >
                      <span className="text-lg">
                        {opt.icon === "briefcase" && "\uD83D\uDCBC"}
                        {opt.icon === "coffee" && "\u2615"}
                        {opt.icon === "heart" && "\uD83E\uDE77"}
                        {opt.icon === "sparkles" && "\u2728"}
                        {opt.icon === "sun" && "\u2600\uFE0F"}
                        {opt.icon === "shirt" && "\uD83D\uDC55"}
                      </span>
                      <span className="font-inter text-sm font-medium">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-5 h-5 rounded-full bg-cream/20 flex items-center justify-center"
                        >
                          <span className="text-cream text-[10px]">&#10003;</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 pb-8 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(3)}
                disabled={selectedOccasions.length === 0}
                className={`w-full py-4 rounded-full font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  selectedOccasions.length > 0
                    ? "bg-ink text-cream"
                    : "bg-ink/10 text-ink-muted cursor-not-allowed"
                }`}
              >
                Almost There
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col"
          >
            <div className="px-6 pt-8 pb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted">
                  Step 3 of 3
                </span>
                <div className="flex gap-1.5">
                  <div className="w-8 h-1 rounded-full bg-ink" />
                  <div className="w-8 h-1 rounded-full bg-ink" />
                  <div className="w-8 h-1 rounded-full bg-ink" />
                </div>
              </div>
              <h2 className="font-editorial text-2xl text-ink mt-3 mb-1">
                Your investment style
              </h2>
              <p className="font-subhead text-sm text-ink-muted italic">
                No judgment. We'll find the best at every price point.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-3">
                {budgetOptions.map((opt, i) => {
                  const isSelected = selectedBudget === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBudget(opt.id)}
                      className={`w-full flex flex-col p-5 rounded-2xl transition-all text-left ${
                        isSelected
                          ? "bg-ink text-cream"
                          : "bg-ivory text-ink hover:bg-ivory/80"
                      }`}
                    >
                      <span className="font-inter text-sm font-medium">
                        {opt.label}
                      </span>
                      <span
                        className={`text-xs font-inter mt-1 ${
                          isSelected ? "text-cream/60" : "text-ink-muted"
                        }`}
                      >
                        {opt.range}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="px-6 pb-8 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleComplete}
                disabled={!selectedBudget}
                className={`w-full py-4 rounded-full font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  selectedBudget
                    ? "bg-ink text-cream"
                    : "bg-ink/10 text-ink-muted cursor-not-allowed"
                }`}
              >
                <Sparkles size={16} />
                Start Discovering
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
