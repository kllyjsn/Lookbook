import { motion } from "framer-motion";

interface TagProps {
  label: string;
  color?: string;
  size?: "sm" | "md";
  onClick?: () => void;
}

export function Tag({ label, color = "#1A1A1A", size = "sm", onClick }: TagProps) {
  return (
    <motion.span
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
      className={`inline-flex items-center rounded-full border font-inter tracking-wide
        ${size === "sm" ? "px-3 py-1 text-[10px]" : "px-4 py-1.5 text-xs"}
        ${onClick ? "cursor-pointer" : ""}
      `}
      style={{
        borderColor: color + "40",
        color: color,
        backgroundColor: color + "08",
      }}
    >
      {label}
    </motion.span>
  );
}
