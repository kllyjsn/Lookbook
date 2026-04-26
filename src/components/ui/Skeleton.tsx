interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-ink/5 rounded-lg ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-ivory animate-pulse">
      <div className="w-full h-full bg-gradient-to-b from-ink/5 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 p-6 pb-8 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-white/20 rounded-full" />
          <div className="h-5 w-16 bg-white/20 rounded-full" />
        </div>
        <div className="h-8 w-3/4 bg-white/20 rounded-lg" />
        <div className="h-4 w-1/2 bg-white/15 rounded-lg" />
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="mb-6 animate-pulse">
      <div className="flex items-center gap-3 mb-3 px-1">
        <div className="w-10 h-10 rounded-full bg-ink/5" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 bg-ink/5 rounded" />
          <div className="h-2 w-32 bg-ink/5 rounded" />
        </div>
      </div>
      <div className="aspect-[3/4] rounded-2xl bg-ink/5 mb-3" />
      <div className="flex gap-5 px-1">
        <div className="h-4 w-12 bg-ink/5 rounded" />
        <div className="h-4 w-12 bg-ink/5 rounded" />
        <div className="h-4 w-12 bg-ink/5 rounded" />
      </div>
    </div>
  );
}
