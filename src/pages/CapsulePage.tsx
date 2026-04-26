import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, ArrowLeft, Sparkles, ChevronDown, ChevronUp,
  Check, ShoppingBag, Shirt,
} from "lucide-react";
import { capsuleCategories } from "../data/mockData";
import type { CapsuleItem } from "../data/mockData";
import { useStore } from "../stores/useStore";
import { Button } from "../components/ui/Button";

const lifestyleOptions = [
  { id: "minimal", label: "Minimalist", desc: "Less is more — clean, intentional wardrobe" },
  { id: "classic", label: "Classic", desc: "Timeless pieces that never go out of style" },
  { id: "creative", label: "Creative", desc: "Expressive with prints, textures, and color" },
  { id: "active", label: "Active", desc: "Functional meets fashionable" },
];

const budgetPresets = [
  { label: "$1,500", value: 1500 },
  { label: "$3,000", value: 3000 },
  { label: "$5,000", value: 5000 },
  { label: "$10,000", value: 10000 },
];

export function CapsulePage() {
  const [step, setStep] = useState<"intro" | "quiz" | "wardrobe">("intro");
  const [selectedLifestyle, setSelectedLifestyle] = useState("classic");
  const [isBuilding, setIsBuilding] = useState(false);
  const capsuleSelectedItems = useStore((s) => s.capsuleSelectedItems);
  const toggleCapsuleItem = useStore((s) => s.toggleCapsuleItem);
  const capsuleBudget = useStore((s) => s.capsuleBudget);
  const setCapsuleBudget = useStore((s) => s.setCapsuleBudget);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Tops");

  const allItems = useMemo(
    () => capsuleCategories.flatMap((c) => c.items),
    []
  );

  const selectedItems = useMemo(
    () => allItems.filter((item) => capsuleSelectedItems.includes(item.id)),
    [allItems, capsuleSelectedItems]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  );

  const outfitCombinations = useMemo(() => {
    const tops = selectedItems.filter(
      (i) => capsuleCategories[0].items.some((c) => c.id === i.id)
    ).length;
    const bottoms = selectedItems.filter(
      (i) => capsuleCategories[1].items.some((c) => c.id === i.id)
    ).length;
    const outerwear = selectedItems.filter(
      (i) => capsuleCategories[2].items.some((c) => c.id === i.id)
    ).length;
    return Math.max(1, tops * bottoms * Math.max(1, outerwear));
  }, [selectedItems]);

  const handleBuildWardrobe = () => {
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      capsuleCategories.forEach((cat) => {
        cat.items.forEach((item) => {
          if (item.essential && !capsuleSelectedItems.includes(item.id)) {
            toggleCapsuleItem(item.id);
          }
        });
      });
      setStep("wardrobe");
    }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto bg-cream pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          {step !== "intro" && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setStep(step === "wardrobe" ? "quiz" : "intro")
              }
              className="w-8 h-8 rounded-full flex items-center justify-center border border-ink/10"
            >
              <ArrowLeft size={14} />
            </motion.button>
          )}
          <h1 className="font-editorial text-2xl text-ink">
            Capsule Wardrobe
          </h1>
        </div>
        <p className="font-subhead text-sm text-ink-muted italic">
          {step === "intro" && "Build your perfect wardrobe from scratch."}
          {step === "quiz" && "Tell us about your lifestyle."}
          {step === "wardrobe" && `${selectedItems.length} pieces · ${outfitCombinations}+ outfits`}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            {/* Hero */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop&q=80"
                alt="Capsule wardrobe"
                className="img-editorial"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6">
                <LayoutGrid size={32} className="text-white mb-3" />
                <h2 className="font-editorial text-3xl text-white text-center leading-tight mb-2">
                  Fewer Pieces.
                  <br />
                  Endless Outfits.
                </h2>
                <p className="font-subhead text-sm text-white/70 text-center italic">
                  A curated capsule wardrobe tailored to your life
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { number: "28", label: "Pieces" },
                { number: "180+", label: "Outfits" },
                { number: "5", label: "Categories" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-ivory rounded-xl p-4 text-center"
                >
                  <p className="font-editorial text-2xl text-ink">
                    {stat.number}
                  </p>
                  <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mb-8">
              <h3 className="font-editorial text-lg text-ink mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Define Your Lifestyle",
                    desc: "Tell us about your daily activities and preferences",
                  },
                  {
                    step: "02",
                    title: "Set Your Budget",
                    desc: "We'll optimize your wardrobe within your means",
                  },
                  {
                    step: "03",
                    title: "Get Your Capsule",
                    desc: "A curated collection of mix-and-match essentials",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <span className="font-editorial text-2xl text-gold/40 w-8 flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-inter text-sm font-medium text-ink">
                        {item.title}
                      </p>
                      <p className="text-xs font-inter text-ink-muted mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("quiz")}
              className="w-full"
              size="lg"
              icon={<Sparkles size={16} />}
            >
              Build My Capsule
            </Button>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 space-y-8"
          >
            {/* Lifestyle */}
            <div>
              <h3 className="font-editorial text-lg text-ink mb-4">
                Your Style Identity
              </h3>
              <div className="space-y-2">
                {lifestyleOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLifestyle(option.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
                      selectedLifestyle === option.id
                        ? "bg-ink text-cream"
                        : "bg-ivory text-ink hover:bg-ivory/80"
                    }`}
                  >
                    <Shirt
                      size={18}
                      className={
                        selectedLifestyle === option.id
                          ? "text-cream"
                          : "text-ink-muted"
                      }
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-inter font-medium ${
                          selectedLifestyle === option.id
                            ? "text-cream"
                            : "text-ink"
                        }`}
                      >
                        {option.label}
                      </p>
                      <p
                        className={`text-xs font-inter mt-0.5 ${
                          selectedLifestyle === option.id
                            ? "text-cream/60"
                            : "text-ink-muted"
                        }`}
                      >
                        {option.desc}
                      </p>
                    </div>
                    {selectedLifestyle === option.id && (
                      <Check size={16} className="text-cream" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <h3 className="font-editorial text-lg text-ink mb-4">
                Total Budget
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {budgetPresets.map((preset) => (
                  <motion.button
                    key={preset.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCapsuleBudget(preset.value)}
                    className={`py-3 rounded-xl text-sm font-inter transition-all ${
                      capsuleBudget === preset.value
                        ? "bg-ink text-cream"
                        : "bg-ivory text-ink"
                    }`}
                  >
                    {preset.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleBuildWardrobe}
              className="w-full"
              size="lg"
              disabled={isBuilding}
              icon={isBuilding ? undefined : <Sparkles size={16} />}
            >
              {isBuilding ? "Building your capsule..." : "Generate Wardrobe"}
            </Button>

            {isBuilding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-6"
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
                  Assembling your perfect wardrobe...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === "wardrobe" && (
          <motion.div
            key="wardrobe"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            {/* Summary bar */}
            <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl bg-ivory mb-6">
              <div>
                <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                  Pieces
                </p>
                <p className="font-editorial text-xl text-ink">
                  {selectedItems.length}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                  Outfits
                </p>
                <p className="font-editorial text-xl text-ink">
                  {outfitCombinations}+
                </p>
              </div>
              <div>
                <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                  Total
                </p>
                <p className="font-editorial text-xl text-ink">
                  ${totalPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                  Cost/Wear
                </p>
                <p className="font-editorial text-xl text-gold">
                  ${outfitCombinations > 0 ? (totalPrice / outfitCombinations).toFixed(0) : "—"}
                </p>
              </div>
            </div>

            {/* Color palette preview */}
            <div className="mb-6">
              <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted mb-2">
                Your palette
              </p>
              <div className="flex gap-1.5">
                {Array.from(
                  new Set(selectedItems.map((i) => i.color))
                )
                  .slice(0, 8)
                  .map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-full border border-ink/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </div>

            {/* Wardrobe categories */}
            <div className="space-y-3 pb-8">
              {capsuleCategories.map((category) => {
                const isExpanded = expandedCategory === category.name;
                const selectedCount = category.items.filter((i) =>
                  capsuleSelectedItems.includes(i.id)
                ).length;

                return (
                  <div key={category.name} className="rounded-2xl bg-ivory overflow-hidden">
                    <motion.button
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : category.name)
                      }
                      className="w-full flex items-center gap-3 p-4"
                    >
                      <span className="font-editorial text-base text-ink flex-1 text-left">
                        {category.name}
                      </span>
                      <span className="text-xs font-inter text-ink-muted">
                        {selectedCount}/{category.items.length}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-ink-muted" />
                      ) : (
                        <ChevronDown size={16} className="text-ink-muted" />
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                            {category.items.map((item) => (
                              <CapsuleItemCard
                                key={item.id}
                                item={item}
                                selected={capsuleSelectedItems.includes(
                                  item.id
                                )}
                                onToggle={() => toggleCapsuleItem(item.id)}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Shop all button */}
            {selectedItems.length > 0 && (
              <div className="sticky bottom-20 px-6 pb-4">
                <Button
                  className="w-full shadow-lg"
                  size="lg"
                  icon={<ShoppingBag size={16} />}
                >
                  Shop All {selectedItems.length} Pieces — $
                  {totalPrice.toLocaleString()}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CapsuleItemCard({
  item,
  selected,
  onToggle,
}: {
  item: CapsuleItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
        selected ? "ring-2 ring-ink" : "ring-1 ring-ink/5"
      }`}
    >
      <div className="aspect-square">
        <img
          src={item.image}
          alt={item.name}
          className={`img-editorial transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
      </div>
      <div className="p-2.5 bg-white">
        <p className="text-[10px] font-inter tracking-[0.1em] uppercase text-ink-muted">
          {item.brand}
        </p>
        <p className="text-xs font-inter text-ink leading-snug mt-0.5">
          {item.name}
        </p>
        <p className="text-xs font-inter font-medium text-ink mt-0.5">
          ${item.price}
        </p>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-ink flex items-center justify-center"
        >
          <Check size={12} className="text-cream" />
        </motion.div>
      )}
      {item.essential && (
        <div className="absolute top-2 left-2">
          <span className="text-[8px] font-inter tracking-[0.1em] uppercase bg-gold/90 text-white px-1.5 py-0.5 rounded-full">
            Essential
          </span>
        </div>
      )}
    </motion.div>
  );
}
