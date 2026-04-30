import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Gem, Briefcase, Coffee, Sun, Sparkles, Shirt, Music,
  ArrowLeft, ArrowRight, DollarSign, Palette, ChevronRight,
  TrendingUp, ThumbsUp, ThumbsDown, Eye,
} from "lucide-react";
import { eventTypes, feedLooks } from "../data/mockData";
import type { Look } from "../data/mockData";
import { LookDetail } from "../components/cards/LookDetail";
import { Button } from "../components/ui/Button";
import { useStore, computeAffinityScore } from "../stores/useStore";

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

type StylistTab = "trends" | "stylist";

const trendInsights = [
  { title: "Quiet Luxury Still Reigns", desc: "The Row, Toteme, and COS dominate wish lists. Logomania is officially dead — your taste level IS the label.", tag: "IN", color: "#C5A572" },
  { title: "Sheer Everything", desc: "From organza blouses to mesh layers — if you can't see through it, is it even fashion?", tag: "IN", color: "#B8A9C9" },
  { title: "The Return of the Kitten Heel", desc: "Stilettos step aside. The 2-inch heel is the new power move — chic, walkable, and très français.", tag: "IN", color: "#E8D5D0" },
  { title: "Micro Bags", desc: "If your bag can hold more than your lipstick and keys, it's too big. Function left the chat.", tag: "OUT", color: "#C4797A" },
  { title: "Athleisure as Evening Wear", desc: "The pandemic grace period is over. Save the joggers for the gym.", tag: "OUT", color: "#8A8A8A" },
  { title: "Cherry Red Accessories", desc: "A cherry red bag or shoe elevates every neutral outfit. The easiest dopamine hit in fashion.", tag: "IN", color: "#C4797A" },
];

export function StylistPage() {
  const [activeTab, setActiveTab] = useState<StylistTab>("trends");
  const [step, setStep] = useState<"events" | "preferences" | "results">("events");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState(1);
  const [selectedColors, setSelectedColors] = useState<number[]>([0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);

  const styleDNA = useStore((s) => s.styleDNA);
  const likedLooks = useStore((s) => s.likedLooks);

  const trendingLooks = useMemo(() => {
    return [...feedLooks]
      .filter((l) => l.trending)
      .sort((a, b) => computeAffinityScore(b, styleDNA) - computeAffinityScore(a, styleDNA))
      .slice(0, 6);
  }, [styleDNA]);

  const editorsPicks = useMemo(() => {
    return feedLooks.filter((l) => l.editorsChoice);
  }, []);

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
      <div className="px-6 pt-6 pb-3">
        <div className="flex items-center gap-3 mb-1">
          {activeTab === "stylist" && step !== "events" && (
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
          <h1 className="font-editorial text-2xl text-ink">
            {activeTab === "trends" ? "This Week" : "Event Stylist"}
          </h1>
        </div>
        <p className="font-subhead text-sm text-ink-muted italic">
          {activeTab === "trends" && "Your weekly style briefing."}
          {activeTab === "stylist" && step === "events" && "Tell us the occasion. We'll dress you."}
          {activeTab === "stylist" && step === "preferences" && "Customize your style preferences."}
          {activeTab === "stylist" && step === "results" && "Your personalized outfit suggestions."}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="px-6 mb-5">
        <div className="flex gap-1 bg-ivory rounded-xl p-1">
          {([
            { id: "trends" as const, label: "Trend Report" },
            { id: "stylist" as const, label: "Event Stylist" },
          ]).map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveTab(tab.id); setStep("events"); }}
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
        {/* TREND REPORT TAB */}
        {activeTab === "trends" && (
          <motion.div
            key="trends"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Hero editorial banner */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <div className="aspect-[16/9]">
                <img
                  src={trendingLooks[0]?.image ?? feedLooks[0].image}
                  alt="Trend report"
                  className="img-editorial"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-[9px] font-inter tracking-[0.3em] uppercase text-gold block mb-2">
                  WEEKLY EDIT · THE LKBK BRIEFING
                </span>
                <h2 className="font-editorial text-2xl text-white leading-tight mb-1">
                  What's Moving<br />This Week
                </h2>
                <p className="font-subhead text-sm text-white/60 italic">
                  The trends, the shifts, the pieces to watch.
                </p>
              </div>
            </div>

            {/* In / Out list */}
            <div className="mb-8">
              <h3 className="font-editorial text-lg text-ink mb-4">The Verdict</h3>
              <div className="space-y-3">
                {trendInsights.map((insight, i) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-3 p-4 rounded-xl bg-ivory"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${insight.tag === "IN" ? "bg-sage/20" : "bg-rose/10"}`}>
                      {insight.tag === "IN" ? (
                        <ThumbsUp size={14} className="text-sage" />
                      ) : (
                        <ThumbsDown size={14} className="text-rose" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-inter font-bold tracking-[0.15em] uppercase ${insight.tag === "IN" ? "text-sage" : "text-rose"}`}>
                          {insight.tag}
                        </span>
                        <p className="text-sm font-inter font-medium text-ink">{insight.title}</p>
                      </div>
                      <p className="text-xs font-inter text-ink-muted leading-relaxed">{insight.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Trending looks */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-ink" />
                <h3 className="font-editorial text-lg text-ink">Trending Looks</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {trendingLooks.map((look, i) => (
                  <motion.div
                    key={look.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setSelectedLook(look)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                      <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 gradient-bottom p-3">
                        <p className="text-white text-xs font-inter font-medium">{look.title}</p>
                        <p className="text-white/50 text-[10px] font-inter">{look.priceRange}</p>
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                        <Eye size={8} className="text-white/70" />
                        <span className="text-[8px] font-inter text-white/70">{(look.likes / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Editor's picks */}
            {editorsPicks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-gold" />
                  <h3 className="font-editorial text-lg text-ink">Editor's Picks</h3>
                </div>
                <div className="space-y-3">
                  {editorsPicks.map((look, i) => (
                    <motion.div
                      key={look.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedLook(look)}
                      className="flex gap-4 p-3 rounded-xl bg-ivory cursor-pointer hover:bg-blush/20 transition-colors"
                    >
                      <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={look.image} alt={look.title} className="img-editorial" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-[9px] font-inter tracking-[0.15em] uppercase text-gold font-semibold">
                          EDITOR'S PICK
                        </span>
                        <p className="font-inter text-sm font-medium text-ink">{look.title}</p>
                        <p className="font-subhead text-xs text-ink-muted italic mt-0.5">{look.subtitle}</p>
                        <p className="text-[10px] font-inter text-ink-muted mt-1">{look.items.length} pieces · {look.priceRange}</p>
                      </div>
                      <ChevronRight size={16} className="text-ink-muted self-center" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized reco if they've swiped */}
            {likedLooks.length > 0 && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-gold/5 to-blush/10 border border-gold/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-gold" />
                  <span className="text-[10px] font-inter tracking-[0.15em] uppercase text-gold font-semibold">
                    MATCHED TO YOUR DNA
                  </span>
                </div>
                <p className="font-subhead text-sm text-ink-muted italic mb-3">
                  Based on your {likedLooks.length} loved looks, we think you'll obsess over these.
                </p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {[...feedLooks]
                    .sort((a, b) => computeAffinityScore(b, styleDNA) - computeAffinityScore(a, styleDNA))
                    .slice(0, 4)
                    .map((look) => (
                      <motion.div
                        key={look.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedLook(look)}
                        className="flex-shrink-0 w-28 cursor-pointer"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-1">
                          <img src={look.image} alt={look.title} className="img-editorial" />
                        </div>
                        <p className="text-[10px] font-inter text-ink truncate">{look.title}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* EVENT STYLIST TAB */}
        {activeTab === "stylist" && step === "events" && (
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

        {activeTab === "stylist" && step === "preferences" && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-6 space-y-8"
          >
            {selectedEventData && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-ivory">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={selectedEventData.image} alt={selectedEventData.name} className="img-editorial" />
                </div>
                <div>
                  <p className="font-inter text-sm font-medium text-ink">{selectedEventData.name}</p>
                  <p className="text-xs font-inter text-ink-muted">{selectedEventData.description}</p>
                </div>
                <ChevronRight size={16} className="text-ink-muted ml-auto" />
              </div>
            )}

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

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette size={16} className="text-ink" />
                <h3 className="font-editorial text-lg text-ink">Color Palette</h3>
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
                        <div key={color} className="w-6 h-6 rounded-full border border-ink/10" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-sm font-inter text-ink">{pref.name}</span>
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

            <Button onClick={handleGenerate} className="w-full" size="lg" icon={<Sparkles size={16} />}>
              {isGenerating ? "Creating your looks..." : "Style Me"}
            </Button>

            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-2 border-ink/10 border-t-ink mb-4"
                />
                <p className="font-subhead text-base text-ink italic">Curating your perfect outfits...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "stylist" && step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-gold" />
              <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-gold">Styled for you</span>
            </div>
            <h2 className="font-editorial text-2xl text-ink mb-1">{selectedEventData?.name} Looks</h2>
            <p className="font-subhead text-sm text-ink-muted italic mb-6">
              {outfitSuggestions.length} outfit suggestions curated for your style
            </p>

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
                      <img src={look.image} alt={look.title} className="img-editorial group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 gradient-bottom p-6">
                      <span className="text-[10px] font-inter tracking-[0.2em] uppercase text-white/50 block mb-2">
                        Look {i + 1} of {outfitSuggestions.length}
                      </span>
                      <h3 className="font-editorial text-2xl text-white mb-1">{look.title}</h3>
                      <p className="font-subhead text-sm text-white/70 italic mb-3">{look.subtitle}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50 font-inter">{look.items.length} pieces</span>
                        <span className="text-white/30">·</span>
                        <span className="text-xs text-white/50 font-inter">{look.priceRange}</span>
                        <ArrowRight size={14} className="text-white/50 ml-auto" />
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
          <LookDetail look={selectedLook} onClose={() => setSelectedLook(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
