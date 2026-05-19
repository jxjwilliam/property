"use client";

import type { GalleryGroup } from "@/config/gallery";

interface FilterBarProps {
  groups: GalleryGroup[];
  activeKey: string;
  onFilterChange: (key: string) => void;
}

export function FilterBar({ groups, activeKey, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2.5" aria-label="Gallery filters">
      {groups.map((group) => (
        <button
          key={group.key}
          type="button"
          onClick={() => onFilterChange(group.key)}
          className={`
            inline-flex items-center gap-2 rounded-full border px-3.5 py-2.5
            text-sm font-sans text-[var(--foreground)] transition-all
            duration-180 ease-in-out
            ${
              group.key === activeKey
                ? "border-[rgba(240,179,90,0.75)] bg-[linear-gradient(145deg,rgba(240,179,90,0.22),rgba(255,255,255,0.08))] shadow-[0_0_0_1px_rgba(240,179,90,0.1),0_18px_40px_rgba(240,179,90,0.08)]"
                : "border-[var(--line)] bg-[rgba(9,11,15,0.72)] hover:border-[rgba(255,255,255,0.28)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-px"
            }
          `}
        >
          <span>{group.label}</span>
          <span className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.05)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">
            {group.files.length}
          </span>
        </button>
      ))}
    </div>
  );
}
