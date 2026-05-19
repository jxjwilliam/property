"use client";

import type { GalleryImage } from "@/config/gallery";

interface FilmstripProps {
  items: GalleryImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const TILTS = ["-0.7deg", "0.6deg", "-0.3deg"];

export function Filmstrip({ items, activeIndex, onSelect }: FilmstripProps) {
  return (
    <div
      className="flex gap-4 overflow-x-auto px-0.5 pb-5 snap-x snap-proximity"
      style={{
        scrollbarColor: "rgba(255,255,255,0.18) transparent",
      }}
    >
      {items.map((item, index) => {
        const tilt = TILTS[index % TILTS.length];
        const isActive = index === activeIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Show ${item.caption}`}
            className={`
              flex-none w-56 snap-start rounded-2xl border p-3
              bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03)),linear-gradient(160deg,rgba(19,23,29,0.96),rgba(9,11,15,0.98))]
              shadow-[0_24px_80px_rgba(0,0,0,0.45)] outline-none
              transition-all duration-220 ease-in-out cursor-pointer
              ${isActive
                ? "border-[rgba(240,179,90,0.45)] -translate-y-1.5 rotate-0 scale-[1.01] shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(240,179,90,0.1)]"
                : "border-[var(--line)] hover:border-[rgba(240,179,90,0.45)] hover:-translate-y-1.5 hover:rotate-0 hover:scale-[1.01]"
              }
            `}
            style={isActive ? undefined : { transform: `rotate(${tilt})` }}
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#0c0e12] border border-[rgba(255,255,255,0.12)]">
              <img
                src={item.url}
                alt={item.caption}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_28%,rgba(0,0,0,0.08))]" />
            </div>
            <div className="flex justify-between gap-3 items-end mt-3">
              <div className="min-w-0">
                <strong className="block text-sm leading-tight text-[var(--foreground)]">
                  {item.caption}
                </strong>
                <span className="block mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {item.source}
                </span>
              </div>
              <span className="shrink-0 text-xs text-[rgba(244,239,231,0.54)]">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
