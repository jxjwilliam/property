"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryGroup } from "@/config/gallery";
import { getFilteredItems, getGroup } from "@/config/gallery";
import { FilterBar } from "./filter-bar";
import { Filmstrip } from "./filmstrip";
import { HeroViewer } from "./hero-viewer";

interface GalleryProps {
  groups: GalleryGroup[];
}

export function Gallery({ groups }: GalleryProps) {
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
    <aside className="panel" aria-label="Current slide preview">
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

      <div className="status-row">
        <span className="badge">
          {items.length ? `${String(currentIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}` : "0 / 0"}
        </span>
        <span className="badge">{`${getGroup(filterKey).label} frames`}</span>
        <span className="badge">Tap a frame to jump</span>
      </div>

      <div className="filter-bar" id="filterBar" aria-label="Gallery filters">
        <FilterBar groups={groups} activeKey={filterKey} onFilterChange={handleFilterChange} />
      </div>

      <section aria-label="Frame carousel">
        <div className="section-head">
          <div>
            <h2>Carousel frames</h2>
          </div>
          <p>Swipe horizontally, click any frame, or use the arrow keys. The active image stays large and centered.</p>
        </div>
        <Filmstrip items={items} activeIndex={currentIndex} onSelect={handleSelect} />
      </section>
    </aside>
  );
}
