import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled = false,
  icon,
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 font-inter font-medium tracking-wide transition-all";

  const variants = {
    primary: "bg-ink text-cream hover:bg-charcoal",
    secondary: "bg-cream text-ink border border-ink/10 hover:border-ink/30",
    ghost: "bg-transparent text-ink hover:bg-ink/5",
    outline: "bg-transparent text-ink border border-ink/20 hover:border-ink/40",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-full",
    md: "px-6 py-3 text-sm rounded-full",
    lg: "px-8 py-4 text-sm rounded-full",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-40 pointer-events-none" : ""} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}
