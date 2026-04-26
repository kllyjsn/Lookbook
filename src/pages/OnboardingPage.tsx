import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import { useStore } from "../stores/useStore";

const UNSPLASH = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

interface StyleOption {
  id: string;
  label: string;
  image: string;
  tags: string[];
}

const styleOptions: StyleOption[] = [
  {
    id: "minimalist",
    label: "Minimalist",
    image: UNSPLASH("photo-1509631179647-0177331693ae"),
    tags: ["Clean Lines", "Neutral Palette"],
  },
  {
    id: "streetwear",
    label: "Street Luxe",
    image: UNSPLASH("photo-1515886657613-9f3515b0c78f"),
    tags: ["Urban", "Effortless"],
  },
  {
    id: "romantic",
    label: "Romantic",
    image: UNSPLASH("photo-1496747611176-843222e1e57c"),
    tags: ["Soft Hues", "Feminine"],
  },
  {
    id: "classic",
    label: "Classic",
    image: UNSPLASH("photo-1539109136881-3be0616acf4b"),
    tags: ["Tailored", "Timeless"],
  },
  {
    id: "avant-garde",
    label: "Avant-Garde",
    image: UNSPLASH("photo-1485968579580-b6d095142e6e"),
    tags: ["Bold", "Creative"],
  },
  {
    id: "bohemian",
    label: "Bohemian",
    image: UNSPLASH("photo-1529139574466-a303027c1d8b"),
    tags: ["Free-Spirit", "Prints"],
  },
];

const budgetOptions = [
  { id: "budget", label: "Smart Finds", range: "Under $100", emoji: "" },
  { id: "mid", label: "Balanced", range: "$100 – $500", emoji: "" },
  { id: "premium", label: "Investment", range: "$500+", emoji: "" },
  { id: "luxury", label: "No Limits", range: "Luxury", emoji: "" },
];

export function OnboardingPage() {
  const [step, setStep] = useState<"welcome" | "style" | "budget" | "ready">("welcome");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const updateStyleDNA = useStore((s) => s.updateStyleDNA);
  const setBudgetPreference = useStore((s) => s.setBudgetPreference);

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

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
    if (selectedBudget) {
      setBudgetPreference(selectedBudget);
    }
    completeOnboarding();
  };

  return (
    <div className="h-full w-full bg-cream flex flex-col max-w-lg mx-auto relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Logo variant="full" size="lg" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-subhead text-xl text-ink-light italic text-center mt-8 leading-relaxed"
            >
              Your personal fashion magazine.
              <br />
              Swipe. Discover. Define your style.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 w-full"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("style")}
                className="w-full py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
              >
                Find Your Style
                <ChevronRight size={16} />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex gap-2 mt-8"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-ink" : "bg-ink/15"}`}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {step === "style" && (
          <motion.div
            key="style"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col"
          >
            <div className="px-6 pt-8 pb-4">
              <p className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-2">
                STEP 1 OF 3
              </p>
              <h1 className="font-editorial text-3xl text-ink leading-tight mb-2">
                What's your
                <br />
                style vibe?
              </h1>
              <p className="font-subhead text-base text-ink-muted italic">
                Pick as many as speak to you.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-32">
              <div className="grid grid-cols-2 gap-3">
                {styleOptions.map((option, i) => {
                  const isSelected = selectedStyles.includes(option.id);
                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleStyle(option.id)}
                      className="relative cursor-pointer group"
                    >
                      <div
                        className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all ${
                          isSelected ? "ring-2 ring-gold ring-offset-2 ring-offset-cream" : ""
                        }`}
                      >
                        <img
                          src={option.image}
                          alt={option.label}
                          className="img-editorial group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />
                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                          <h3 className="font-editorial text-lg text-white leading-tight">
                            {option.label}
                          </h3>
                          <div className="flex gap-1.5 mt-2">
                            {option.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[8px] font-inter tracking-wider uppercase text-white/70 bg-white/15 rounded-full px-2 py-0.5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gold flex items-center justify-center"
                          >
                            <span className="text-white text-sm font-bold">
                              {selectedStyles.indexOf(option.id) + 1}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 px-6 pb-8 pt-6 bg-gradient-to-t from-cream via-cream to-cream/0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("budget")}
                disabled={selectedStyles.length === 0}
                className={`w-full py-4 rounded-full font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  selectedStyles.length > 0
                    ? "bg-ink text-cream"
                    : "bg-ink/20 text-ink/40 pointer-events-none"
                }`}
              >
                Continue
                <ChevronRight size={16} />
              </motion.button>
              <div className="flex gap-2 justify-center mt-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === 1 ? "bg-ink" : "bg-ink/15"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "budget" && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col px-6"
          >
            <div className="pt-8 pb-4">
              <p className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted mb-2">
                STEP 2 OF 3
              </p>
              <h1 className="font-editorial text-3xl text-ink leading-tight mb-2">
                How do you
                <br />
                invest in style?
              </h1>
              <p className="font-subhead text-base text-ink-muted italic">
                We'll tailor recommendations to your budget.
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-3 py-4">
              {budgetOptions.map((option, i) => {
                const isSelected = selectedBudget === option.id;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBudget(option.id)}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all text-left ${
                      isSelected
                        ? "bg-ink text-cream"
                        : "bg-ivory text-ink hover:bg-ivory/80 border border-ink/5"
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-inter font-semibold ${
                          isSelected ? "text-cream" : "text-ink"
                        }`}
                      >
                        {option.label}
                      </p>
                      <p
                        className={`text-xs font-inter mt-0.5 ${
                          isSelected ? "text-cream/60" : "text-ink-muted"
                        }`}
                      >
                        {option.range}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                      >
                        <span className="text-white text-xs">&#10003;</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="pb-8 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep("ready")}
                disabled={!selectedBudget}
                className={`w-full py-4 rounded-full font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  selectedBudget
                    ? "bg-ink text-cream"
                    : "bg-ink/20 text-ink/40 pointer-events-none"
                }`}
              >
                Almost There
                <ChevronRight size={16} />
              </motion.button>
              <div className="flex gap-2 justify-center mt-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === 2 ? "bg-ink" : "bg-ink/15"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === "ready" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-blush flex items-center justify-center mb-8"
            >
              <Sparkles size={32} className="text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-editorial text-4xl text-ink text-center leading-tight mb-4"
            >
              Your Lookbook
              <br />
              is ready.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-subhead text-lg text-ink-muted italic text-center mb-2"
            >
              We've curated your feed based on
              <br />
              your style preferences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-2 mb-10 mt-4"
            >
              {selectedStyles.map((id) => {
                const style = styleOptions.find((s) => s.id === id);
                return (
                  <span
                    key={id}
                    className="text-[10px] font-inter tracking-[0.15em] uppercase text-gold border border-gold/30 bg-gold/5 rounded-full px-4 py-1.5"
                  >
                    {style?.label}
                  </span>
                );
              })}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              className="w-full py-4 rounded-full bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Start Discovering
            </motion.button>

            <div className="flex gap-2 justify-center mt-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 3 ? "bg-ink" : "bg-ink/15"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
