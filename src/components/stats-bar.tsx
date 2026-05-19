"use client";

import type { GalleryStat } from "@/config/gallery";

interface StatsBarProps {
  stats: GalleryStat[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="min-w-[120px] rounded-xl border border-[var(--line)] bg-[rgba(8,10,14,0.6)] px-3.5 py-3"
        >
          <strong className="block text-sm leading-none text-[var(--foreground)]">
            {stat.value}
          </strong>
          <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
