import { motion } from "framer-motion";
import { BadgeDollarSign } from "lucide-react";
import type { LookItem } from "../../data/mockData";

interface BudgetAlternativesProps {
  items: LookItem[];
}

export function BudgetAlternatives({ items }: BudgetAlternativesProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <BadgeDollarSign size={18} className="text-sage" />
        <h3 className="font-editorial text-xl text-ink">Get the Look for Less</h3>
      </div>
      <p className="text-xs font-inter text-ink-muted mb-4 -mt-2">
        Same energy, friendlier price tag.
      </p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-sage/5 border border-sage/15"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-ivory">
              <img src={item.image} alt={item.name} className="img-editorial" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-inter tracking-[0.15em] uppercase text-ink-muted">
                {item.brand}
              </p>
              <p className="text-sm font-inter text-ink truncate">{item.name}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-sm font-inter font-semibold text-sage">${item.price}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
