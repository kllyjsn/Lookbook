import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Gem, Briefcase, Coffee, Sun, Sparkles, Shirt, Music,
  ArrowLeft, ArrowRight, DollarSign, Palette, ChevronRight, TrendingUp,
} from "lucide-react";
import { eventTypes, feedLooks, trendForecasts } from "../data/mockData";
import type { Look } from "../data/mockData";
import { LookDetail } from "../components/cards/LookDetail";
import { Button } from "../components/ui/Button";

const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  gem: Gem,
  briefcase: Briefcase,
  coffee: Coffee,
  sun: Sun,
  sparkles: Sparkles,
  shirt: Shirt,
  music: Music,
};

const budgetRanges = [
  { label: "Under $200", min: 0, max: 200 },
  { label: "$200 – $500", min: 200, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "$1,000+", min: 1000, max: 99999 },
];

const colorPreferences = [
  { name: "Neutrals", colors: ["#FAF9F6", "#E8D5D0", "#C5A572", "#8A8A8A"] },
  { name: "Bold", colors: ["#C4797A", "#B8A9C9", "#A8B5A0", "#4A6A8A"] },
  { name: "Dark", colors: ["#1A1A1A", "#2D2D2D", "#4A4A4A", "#6B4C3B"] },
  { name: "Pastels", colors: ["#E8D5D0", "#D4E4DC", "#D5D0E8", "#E8E0D0"] },
];

export function StylistPage() {
  const [step, setStep] = useState<"events" | "preferences" | "results">("events");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState(1);
  const [selectedColors, setSelectedColors] = useState<number[]>([0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    setStep("preferences");
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep("results");
    }, 2500);
  };

  const toggleColorPref = (index: number) => {
    setSelectedColors((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const selectedEventData = eventTypes.find((e) => e.id === selectedEvent);
  const outfitSuggestions = feedLooks.slice(0, 4);

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          {step !== "events" && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setStep(step === "results" ? "preferences" : "events")
              }
              className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
            >
              <ArrowLeft size={14} />
            </motion.button>
          )}
          <h1 className="font-editorial text-2xl text-ink">Event Stylist</h1>
        </div>
        <p className="font-subhead text-sm text-ink-muted italic">
          {step === "events" && "Tell us the occasion. We'll dress you."}
          {step === "preferences" && "Customize your style preferences."}
          {step === "results" && "Your personalized outfit suggestions."}
        </p>
      </div>

      {/* Trend Forecast (events step only) */}
      {step === "events" && (
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-gold" />
            <h2 className="text-xs font-inter font-semibold tracking-[0.12em] uppercase text-ink-muted">
              Trend Forecast
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {trendForecasts.map((forecast, i) => (
              <motion.div
                key={forecast.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden bg-ivory border border-ink/5"
              >
                <div className="relative aspect-[4/5]">
                  <img src={forecast.image} alt={forecast.title} className="img-editorial" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className="text-[8px] font-inter font-bold tracking-wider uppercase bg-gold/90 text-white px-2 py-0.5 rounded-full">
                      {forecast.confidence}% match
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[9px] font-inter tracking-wider uppercase text-white/50 mb-0.5">
                      {forecast.season} · {forecast.trend}
                    </p>
                    <p className="text-sm font-editorial text-white leading-tight">
                      {forecast.title}
                    </p>
                    <p className="text-[10px] font-subhead text-white/70 italic mt-0.5">
                      {forecast.subtitle}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-inter text-ink-muted leading-relaxed mb-2">
                    {forecast.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {forecast.keyPieces.map((piece) => (
                      <span
                        key={piece}
                        className="text-[8px] font-inter tracking-wider uppercase text-ink-muted bg-cream rounded-full px-2 py-0.5"
                      >
                        {piece}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "events" && (
          <motion.div
            key="events"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            <div className="grid grid-cols-2 gap-3">
              {eventTypes.map((event, i) => {
                const Icon = iconMap[event.icon] ?? Sparkles;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleEventSelect(event.id)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="img-editorial group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Icon size={24} className="text-white mb-2" />
                        <p className="text-white text-sm font-inter font-medium">
                          {event.name}
                        </p>
                        <p className="text-white/60 text-[10px] font-inter mt-0.5">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === "preferences" && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-6 space-y-8"
          >
            {/* Selected event preview */}
            {selectedEventData && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-ivory">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={selectedEventData.image}
                    alt={selectedEventData.name}
                    className="img-editorial"
                  />
                </div>
                <div>
                  <p className="font-inter text-sm font-medium text-ink">
                    {selectedEventData.name}
                  </p>
                  <p className="text-xs font-inter text-ink-muted">
                    {selectedEventData.description}
                  </p>
                </div>
                <ChevronRight size={16} className="text-ink-muted ml-auto" />
              </div>
            )}

            {/* Budget */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={16} className="text-ink" />
                <h3 className="font-editorial text-lg text-ink">Budget</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {budgetRanges.map((range, i) => (
                  <motion.button
                    key={range.label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedBudget(i)}
                    className={`py-3 px-4 rounded-xl text-sm font-inter transition-all ${
                      selectedBudget === i
                        ? "bg-ink text-cream"
                        : "bg-ivory text-ink border border-ink/5 hover:border-ink/20"
                    }`}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color preferences */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette size={16} className="text-ink" />
                <h3 className="font-editorial text-lg text-ink">
                  Color Palette
                </h3>
              </div>
              <div className="space-y-3">
                {colorPreferences.map((pref, i) => (
                  <motion.button
                    key={pref.name}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleColorPref(i)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      selectedColors.includes(i)
                        ? "bg-ink/5 border border-ink/20"
                        : "bg-ivory border border-transparent hover:border-ink/10"
                    }`}
                  >
                    <div className="flex gap-1.5">
                      {pref.colors.map((color) => (
                        <div
                          key={color}
                          className="w-6 h-6 rounded-full border border-ink/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-inter text-ink">
                      {pref.name}
                    </span>
                    {selectedColors.includes(i) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-5 h-5 rounded-full bg-ink flex items-center justify-center"
                      >
                        <span className="text-cream text-[10px]">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              className="w-full"
              size="lg"
              icon={<Sparkles size={16} />}
            >
              {isGenerating ? "Creating your looks..." : "Style Me"}
            </Button>

            {/* Loading state */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-12 h-12 rounded-full border-2 border-ink/10 border-t-ink mb-4"
                />
                <p className="font-subhead text-base text-ink italic">
                  Curating your perfect outfits...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-6"
          >
            {/* Results header */}
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-gold" />
              <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold">
                Styled for you
              </span>
            </div>
            <h2 className="font-editorial text-2xl text-ink mb-1">
              {selectedEventData?.name} Looks
            </h2>
            <p className="font-subhead text-sm text-ink-muted italic mb-6">
              {outfitSuggestions.length} outfit suggestions curated for your style
            </p>

            {/* Outfit cards — editorial grid */}
            <div className="space-y-6 pb-8">
              {outfitSuggestions.map((look, i) => (
                <motion.div
                  key={look.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedLook(look)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="aspect-[3/4]">
                      <img
                        src={look.image}
                        alt={look.title}
                        className="img-editorial group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 gradient-bottom p-6">
                      <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/50 block mb-2">
                        Look {i + 1} of {outfitSuggestions.length}
                      </span>
                      <h3 className="font-editorial text-2xl text-white mb-1">
                        {look.title}
                      </h3>
                      <p className="font-subhead text-sm text-white/70 italic mb-3">
                        {look.subtitle}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50 font-inter">
                          {look.items.length} pieces
                        </span>
                        <span className="text-white/30">·</span>
                        <span className="text-xs text-white/50 font-inter">
                          {look.priceRange}
                        </span>
                        <ArrowRight
                          size={14}
                          className="text-white/50 ml-auto"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
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
