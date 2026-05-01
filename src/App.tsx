import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./stores/useStore";
import { TabBar } from "./components/layout/TabBar";
import { FeedPage } from "./pages/FeedPage";
import { CommunityPage } from "./pages/CommunityPage";
import { MixerPage } from "./pages/MixerPage";
import { StylistPage } from "./pages/StylistPage";
import { CapsulePage } from "./pages/CapsulePage";
import { ProfilePage } from "./pages/ProfilePage";
import { OnboardingPage } from "./pages/OnboardingPage";

const pages: Record<string, React.FC> = {
  feed: FeedPage,
  community: CommunityPage,
  mixer: MixerPage,
  stylist: StylistPage,
  capsule: CapsulePage,
  profile: ProfilePage,
};

export default function App() {
  const activeTab = useStore((s) => s.activeTab);
  const hasCompletedOnboarding = useStore((s) => s.hasCompletedOnboarding);
  const Page = pages[activeTab] ?? FeedPage;

  if (!hasCompletedOnboarding) {
    return <OnboardingPage />;
  }

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
