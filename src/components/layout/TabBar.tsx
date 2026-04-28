import { motion } from "framer-motion";
import { Flame, Users, CalendarHeart, LayoutGrid, User } from "lucide-react";
import { useStore } from "../../stores/useStore";
import { feedLooks } from "../../data/mockData";
import { communityPosts } from "../../data/communityData";

const tabs = [
  { id: "feed", icon: Flame, label: "Discover" },
  { id: "community", icon: Users, label: "Community" },
  { id: "stylist", icon: CalendarHeart, label: "Stylist" },
  { id: "capsule", icon: LayoutGrid, label: "Capsule" },
  { id: "profile", icon: User, label: "Profile" },
];

export function TabBar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const lastSeenFeedCount = useStore((s) => s.lastSeenFeedCount);
  const lastSeenCommunityCount = useStore((s) => s.lastSeenCommunityCount);

  const hasNewFeed = feedLooks.length > lastSeenFeedCount;
  const hasNewCommunity = communityPosts.length > lastSeenCommunityCount;

  const getNotificationDot = (tabId: string): boolean => {
    if (tabId === "feed" && hasNewFeed) return true;
    if (tabId === "community" && hasNewCommunity) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass border-t border-ink/5">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const hasNotif = getNotificationDot(tab.id);

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center justify-center w-16 h-full gap-0.5"
              >
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-ink" : "text-ink-muted"
                    }`}
                  />
                  {hasNotif && !isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose"
                    />
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
