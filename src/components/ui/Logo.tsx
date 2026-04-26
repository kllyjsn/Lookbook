interface LogoProps {
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg";
  color?: "dark" | "light";
  className?: string;
}

export function Logo({
  variant = "full",
  size = "md",
  color = "dark",
  className = "",
}: LogoProps) {
  const fill = color === "dark" ? "#1A1A1A" : "#FAF9F6";
  const accent = "#C5A572";

  const sizes = {
    sm: { mark: 28, wordmark: 80, full: 120 },
    md: { mark: 36, wordmark: 110, full: 160 },
    lg: { mark: 48, wordmark: 150, full: 220 },
  };

  const s = sizes[size];

  if (variant === "mark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={s.mark}
        height={s.mark}
        className={className}
      >
        <rect width="64" height="64" rx="14" fill={fill} />
        <text
          x="32"
          y="25"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="11"
          letterSpacing="3"
          fill={color === "dark" ? "#FAF9F6" : "#1A1A1A"}
        >
          LK
        </text>
        <text
          x="32"
          y="45"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="11"
          letterSpacing="3"
          fill={color === "dark" ? "#FAF9F6" : "#1A1A1A"}
        >
          BK
        </text>
        <line x1="14" y1="32" x2="50" y2="32" stroke={accent} strokeWidth="0.75" />
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 32"
        width={s.wordmark}
        height={s.wordmark * (32 / 200)}
        className={className}
      >
        <text
          x="0"
          y="24"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize="22"
          letterSpacing="8"
          fill={fill}
        >
          LOOKBOOK
        </text>
      </svg>
    );
  }

  // Full variant: mark + wordmark
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={s.mark}
        height={s.mark}
      >
        <rect width="64" height="64" rx="14" fill={fill} />
        <text
          x="32"
          y="25"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="11"
          letterSpacing="3"
          fill={color === "dark" ? "#FAF9F6" : "#1A1A1A"}
        >
          LK
        </text>
        <text
          x="32"
          y="45"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fontSize="11"
          letterSpacing="3"
          fill={color === "dark" ? "#FAF9F6" : "#1A1A1A"}
        >
          BK
        </text>
        <line x1="14" y1="32" x2="50" y2="32" stroke={accent} strokeWidth="0.75" />
      </svg>
      <div className="flex flex-col">
        <span
          className="font-editorial font-bold tracking-[0.25em] leading-none"
          style={{ color: fill, fontSize: size === "lg" ? 18 : size === "md" ? 14 : 11 }}
        >
          LOOKBOOK
        </span>
        <span
          className="font-inter tracking-[0.15em] text-ink-muted leading-none mt-0.5"
          style={{ fontSize: size === "lg" ? 9 : size === "md" ? 7 : 6 }}
        >
          DISCOVER YOUR LOOK
        </span>
      </div>
    </div>
  );
}
