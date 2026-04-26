import { motion } from "framer-motion";
import { Flame, Users, Camera, CalendarHeart, LayoutGrid, User } from "lucide-react";
import { useStore } from "../../stores/useStore";

const tabs = [
  { id: "feed", icon: Flame, label: "Discover" },
  { id: "community", icon: Users, label: "Community" },
  { id: "search", icon: Camera, label: "Shop" },
  { id: "stylist", icon: CalendarHeart, label: "Stylist" },
  { id: "capsule", icon: LayoutGrid, label: "Capsule" },
  { id: "profile", icon: User, label: "Profile" },
];

export function TabBar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-ink/5">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center w-14 h-full gap-0.5"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-ink-muted"
                  }`}
                />
                <span
                  className={`text-[9px] font-inter leading-none transition-all duration-200 ${
                    isActive
                      ? "text-ink font-semibold opacity-100"
                      : "text-ink-muted opacity-70"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-0 w-8 h-0.5 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
