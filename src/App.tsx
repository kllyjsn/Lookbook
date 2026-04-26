import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./stores/useStore";
import { TabBar } from "./components/layout/TabBar";
import { FeedPage } from "./pages/FeedPage";
import { SearchPage } from "./pages/SearchPage";
import { StylistPage } from "./pages/StylistPage";
import { CapsulePage } from "./pages/CapsulePage";
import { ProfilePage } from "./pages/ProfilePage";

const pages: Record<string, React.FC> = {
  feed: FeedPage,
  search: SearchPage,
  stylist: StylistPage,
  capsule: CapsulePage,
  profile: ProfilePage,
};

export default function App() {
  const activeTab = useStore((s) => s.activeTab);
  const Page = pages[activeTab] ?? FeedPage;

  return (
    <div className="h-full w-full bg-cream flex flex-col max-w-lg mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1 overflow-hidden"
        >
          <Page />
        </motion.div>
      </AnimatePresence>
      <TabBar />
    </div>
  );
}
