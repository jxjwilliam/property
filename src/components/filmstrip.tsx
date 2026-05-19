"use client";

import type { CSSProperties } from "react";
import type { GalleryImage } from "@/config/gallery";

interface FilmstripProps {
  items: GalleryImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const TILTS = ["-0.7deg", "0.6deg", "-0.3deg"];

export function Filmstrip({ items, activeIndex, onSelect }: FilmstripProps) {
  return (
    <div className="filmstrip">
      {items.map((item, index) => {
        const tilt = TILTS[index % TILTS.length];
        const isActive = index === activeIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Show ${item.caption}`}
            className={`card ${isActive ? "active" : ""}`}
            style={isActive ? undefined : ({ ["--tilt" as never]: tilt } as CSSProperties)}
          >
            <div className="frame">
              <img
                src={item.url}
                alt={item.caption}
                loading="lazy"
                decoding="async"
                className="frame-image"
              />
            </div>
            <div className="card-meta">
              <div>
                <strong>{item.caption}</strong>
                <span>{item.source}</span>
              </div>
              <span className="card-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
