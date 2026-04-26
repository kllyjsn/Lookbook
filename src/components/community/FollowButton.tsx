import { motion } from "framer-motion";
import { useStore } from "../../stores/useStore";

interface FollowButtonProps {
  creatorId: string;
  size?: "sm" | "md";
}

export function FollowButton({ creatorId, size = "sm" }: FollowButtonProps) {
  const followedCreators = useStore((s) => s.followedCreators);
  const followCreator = useStore((s) => s.followCreator);
  const unfollowCreator = useStore((s) => s.unfollowCreator);

  const isFollowing = followedCreators.includes(creatorId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowing) {
      unfollowCreator(creatorId);
    } else {
      followCreator(creatorId);
    }
  };

  const sizeClasses = size === "sm"
    ? "px-4 py-1.5 text-[11px]"
    : "px-6 py-2.5 text-sm";

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      className={`rounded-full font-inter font-medium transition-all duration-300 ${sizeClasses} ${
        isFollowing
          ? "border border-ink/15 text-ink-muted bg-transparent"
          : "bg-ink text-cream"
      }`}
    >
      <motion.span
        key={isFollowing ? "following" : "follow"}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {isFollowing ? "Following" : "Follow"}
      </motion.span>
    </motion.button>
  );
}
