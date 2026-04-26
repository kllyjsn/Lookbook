import { motion } from "framer-motion";
import { Flame, Search, Users, CalendarHeart, LayoutGrid, User } from "lucide-react";
import { useStore } from "../../stores/useStore";

const tabs = [
  { id: "feed", icon: Flame, label: "Discover" },
  { id: "search", icon: Search, label: "Search" },
  { id: "community", icon: Users, label: "Community" },
  { id: "stylist", icon: CalendarHeart, label: "Stylist" },
  { id: "capsule", icon: LayoutGrid, label: "Capsule" },
  { id: "profile", icon: User, label: "Profile" },
];

const badgeTabs = new Set(["community", "profile"]);

export function TabBar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const likedLooks = useStore((s) => s.likedLooks);
  const followedCreators = useStore((s) => s.followedCreators);

  const getBadge = (tabId: string): boolean => {
    if (tabId === "community" && followedCreators.length === 0) return true;
    if (tabId === "profile" && likedLooks.length > 0) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-ink/5">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const showBadge = badgeTabs.has(tab.id) && getBadge(tab.id) && !isActive;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5"
              >
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-ink" : "text-ink-muted"
                    }`}
                  />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose badge-pulse" />
                  )}
                </div>
                <span
                  className={`text-[9px] font-inter tracking-[0.05em] transition-colors duration-200 ${
                    isActive ? "text-ink font-medium" : "text-ink-muted"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-0 w-1 h-1 rounded-full bg-ink"
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
