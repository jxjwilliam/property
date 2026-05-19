"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryGroup, GalleryStat } from "@/config/gallery";
import { getFilteredItems } from "@/config/gallery";
import { StatsBar } from "./stats-bar";
import { FilterBar } from "./filter-bar";
import { Filmstrip } from "./filmstrip";
import { HeroViewer } from "./hero-viewer";

interface GalleryProps {
  groups: GalleryGroup[];
  stats: GalleryStat[];
}

export function Gallery({ groups, stats }: GalleryProps) {
  const [filterKey, setFilterKey] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = getFilteredItems(filterKey);

  const step = useCallback(
    (delta: number) => {
      if (!items.length) return;
      setCurrentIndex((prev) => (prev + delta + items.length) % items.length);
    },
    [items.length],
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!playing) return;
    timerRef.current = setInterval(() => step(1), 5000);
  }, [clearTimer, playing, step]);

  const handleFilterChange = useCallback((key: string) => {
    setFilterKey(key);
    setCurrentIndex(0);
  }, []);

  const handlePrev = useCallback(() => {
    step(-1);
    startTimer();
  }, [step, startTimer]);

  const handleNext = useCallback(() => {
    step(1);
    startTimer();
  }, [step, startTimer]);

  const handleTogglePlay = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      startTimer();
    },
    [startTimer],
  );

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [filterKey, playing, startTimer, clearTimer]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        clearTimer();
      } else if (playing) {
        startTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [playing, clearTimer, startTimer]);

  return (
    <div className="space-y-6">
      <StatsBar stats={stats} />

      <HeroViewer
        items={items}
        currentIndex={currentIndex}
        playing={playing}
        onPrev={handlePrev}
        onNext={handleNext}
        onTogglePlay={handleTogglePlay}
        onPause={clearTimer}
        onResume={startTimer}
      />

      <div className="flex flex-wrap gap-2.5">
        <FilterBar groups={groups} activeKey={filterKey} onFilterChange={handleFilterChange} />
        <span className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-xs text-[var(--muted-foreground)] self-center">
          Tap a frame to jump
        </span>
      </div>

      <div>
        <div className="flex justify-between items-end gap-4 mb-3.5">
          <h2 className="font-serif text-xl sm:text-2xl tracking-tight text-[var(--foreground)] m-0">
            Carousel frames
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] max-w-[52ch] text-right m-0">
            Swipe horizontally, click any frame, or use the arrow keys. The active image stays large
            and centered.
          </p>
        </div>
        <Filmstrip items={items} activeIndex={currentIndex} onSelect={handleSelect} />
      </div>
    </div>
  );
}
