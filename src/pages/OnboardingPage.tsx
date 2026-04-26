import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { useStore } from "../stores/useStore";
import { Logo } from "../components/ui/Logo";

const styleOptions = [
  { id: "minimalist", label: "Minimalist", emoji: "The Row, COS, Jil Sander", color: "#1A1A1A", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop&q=80" },
  { id: "classic", label: "Classic", emoji: "Max Mara, Ralph Lauren, Toteme", color: "#C5A572", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop&q=80" },
  { id: "streetwear", label: "Streetwear", emoji: "Off-White, Stussy, Nike", color: "#2D2D2D", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80" },
  { id: "romantic", label: "Romantic", emoji: "Reformation, Zimmermann, Rouje", color: "#C4797A", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop&q=80" },
  { id: "avant-garde", label: "Avant-Garde", emoji: "Comme des Garcons, Maison Margiela", color: "#B8A9C9", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop&q=80" },
  { id: "bohemian", label: "Bohemian", emoji: "Free People, Isabel Marant, Doen", color: "#A8B5A0", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop&q=80" },
];

const occasionOptions = [
  { id: "work", label: "Office", desc: "Power dressing" },
  { id: "weekend", label: "Weekend", desc: "Off-duty cool" },
  { id: "evening", label: "Evening", desc: "After-dark allure" },
  { id: "travel", label: "Travel", desc: "Effortless packing" },
  { id: "brunch", label: "Brunch", desc: "Relaxed chic" },
  { id: "date", label: "Date Night", desc: "Head-turning looks" },
];

const budgetOptions = [
  { id: "accessible", label: "Under $200", desc: "Smart shopping" },
  { id: "mid", label: "$200 – $500", desc: "Considered investment" },
  { id: "premium", label: "$500 – $1,000", desc: "Quality first" },
  { id: "luxury", label: "$1,000+", desc: "No compromises" },
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
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

  const handleFinish = useCallback(() => {
    setIsBuilding(true);

    const styleMap: Record<string, { style: string; color: string }> = {
      minimalist: { style: "Minimalist", color: "#1A1A1A" },
      classic: { style: "Classic", color: "#C5A572" },
      streetwear: { style: "Streetwear", color: "#2D2D2D" },
      romantic: { style: "Romantic", color: "#C4797A" },
      "avant-garde": { style: "Avant-Garde", color: "#B8A9C9" },
      bohemian: { style: "Bohemian", color: "#A8B5A0" },
    };

    const totalSelected = selectedStyles.length || 1;
    const basePercent = Math.floor(80 / totalSelected);
    const remainder = 20;
    const perOther = Math.floor(remainder / (6 - totalSelected || 1));

    const dna = Object.entries(styleMap).map(([id, val]) => ({
      ...val,
      percentage: selectedStyles.includes(id) ? basePercent : perOther,
    }));

    setTimeout(() => {
      updateStyleDNA(dna);
      completeOnboarding();
    }, 2500);
  }, [selectedStyles, completeOnboarding, updateStyleDNA]);

  const canProceed =
    (step === 0) ||
    (step === 1 && selectedStyles.length > 0) ||
    (step === 2 && selectedOccasions.length > 0) ||
    (step === 3 && selectedBudget !== null);

  const totalSteps = 4;

  return (
    <div className="h-full w-full bg-cream flex flex-col max-w-lg mx-auto relative overflow-hidden">
      <AnimatePresence mode="wait">
        {isBuilding ? (
          <motion.div
            key="building"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-ink/10 border-t-gold flex items-center justify-center mb-8"
            />
            <h2 className="font-editorial text-2xl text-ink text-center mb-3">
              Building Your Style DNA
            </h2>
            <p className="font-subhead text-base text-ink-muted italic text-center">
              Curating your personalized feed...
            </p>
          </motion.div>
        ) : step === 0 ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            className="flex-1 flex flex-col"
          >
            <div className="relative flex-1 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1200&fit=crop&q=80"
                alt="Fashion editorial"
                className="img-editorial"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 pb-4">
                <Logo variant="full" size="lg" />
                <p className="font-subhead text-lg text-ink-light italic mt-4 leading-relaxed">
                  Your personal fashion editor, in your pocket. Discover looks you'll love, shop every piece, build your perfect wardrobe.
                </p>
              </div>
            </div>
            <div className="px-8 pb-10 pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl bg-ink text-cream font-inter text-sm font-medium flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                Build My Style Profile
              </motion.button>
              <button
                onClick={() => completeOnboarding()}
                className="w-full py-3 text-ink-muted text-xs font-inter mt-2 hover:text-ink transition-colors"
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {/* Progress bar */}
            <div className="px-8 pt-6 pb-2">
              <div className="flex gap-2 mb-6">
                {Array.from({ length: totalSteps - 1 }).map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-ink/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: i < step ? "100%" : "0%" }}
                      className="h-full bg-ink rounded-full"
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>

              <span className="text-[10px] font-inter tracking-[0.3em] uppercase text-ink-muted block mb-1">
                Step {step} of {totalSteps - 1}
              </span>
              <h1 className="font-editorial text-2xl text-ink mb-1">
                {step === 1 && "What's your style?"}
                {step === 2 && "Dress for the occasion"}
                {step === 3 && "Your investment level"}
              </h1>
              <p className="font-subhead text-sm text-ink-muted italic">
                {step === 1 && "Pick all that resonate. We'll learn as you swipe."}
                {step === 2 && "Select the occasions you dress for most."}
                {step === 3 && "Help us match your budget preferences."}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-4 pt-4">
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {styleOptions.map((style, i) => {
                    const isSelected = selectedStyles.includes(style.id);
                    return (
                      <motion.div
                        key={style.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleStyle(style.id)}
                        className="cursor-pointer"
                      >
                        <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden mb-2 transition-all ${isSelected ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : ""}`}>
                          <img src={style.image} alt={style.label} className="img-editorial" />
                          <div className={`absolute inset-0 transition-colors ${isSelected ? "bg-black/20" : "bg-black/40"}`} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                            <p className="text-white text-sm font-inter font-semibold text-center">{style.label}</p>
                            <p className="text-white/50 text-[10px] font-inter text-center mt-1">{style.emoji}</p>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                            >
                              <Check size={14} className="text-ink" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  {occasionOptions.map((occasion, i) => {
                    const isSelected = selectedOccasions.includes(occasion.id);
                    return (
                      <motion.div
                        key={occasion.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleOccasion(occasion.id)}
                        className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${isSelected ? "border-ink bg-ink/5" : "border-ink/10 bg-ivory"}`}
                      >
                        <p className="font-inter font-semibold text-sm text-ink mb-0.5">{occasion.label}</p>
                        <p className="text-[11px] font-inter text-ink-muted">{occasion.desc}</p>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                            <Check size={14} className="text-ink" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  {budgetOptions.map((budget, i) => {
                    const isSelected = selectedBudget === budget.id;
                    return (
                      <motion.div
                        key={budget.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBudget(budget.id)}
                        className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${isSelected ? "border-ink bg-ink/5" : "border-ink/10 bg-ivory"}`}
                      >
                        <div>
                          <p className="font-inter font-semibold text-sm text-ink">{budget.label}</p>
                          <p className="text-[11px] font-inter text-ink-muted">{budget.desc}</p>
                        </div>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center">
                              <Check size={14} className="text-cream" />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="px-8 pb-10 pt-4">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (step < 3) setStep(step + 1);
                  else handleFinish();
                }}
                disabled={!canProceed}
                className={`w-full py-4 rounded-2xl font-inter text-sm font-medium flex items-center justify-center gap-2 transition-all ${canProceed ? "bg-ink text-cream" : "bg-ink/10 text-ink-muted"}`}
              >
                {step < 3 ? (
                  <>
                    Continue
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    See My Feed
                  </>
                )}
              </motion.button>
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="w-full py-3 text-ink-muted text-xs font-inter mt-1 hover:text-ink transition-colors"
                >
                  Back
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
