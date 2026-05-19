"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { galleryGroups, getFilteredItems, getGroup, statsData } from "@/config/gallery";
import { FilterBar } from "@/components/filter-bar";
import { Filmstrip } from "@/components/filmstrip";
import { HeroViewer } from "@/components/hero-viewer";
import { InquiryForm } from "@/components/inquiry-form";

export default function Home() {
  const [filterKey, setFilterKey] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = getFilteredItems(filterKey);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (!items.length) return;
      setCurrentIndex((prev) => (prev + delta + items.length) % items.length);
    },
    [items.length],
  );

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
    <main className="shell">
      <section className="hero" aria-label="Property photo gallery">
        <div className="title-block">
          <p className="kicker">Vancouver short-term rental media deck</p>
          <h1>Photo frames for the Surrey property.</h1>
          <p className="lede">
            A cinematic carousel for the uploaded condo and environment shots, designed for fast
            browsing on desktop and mobile. The gallery loads images from Cloudflare R2 using the
            flattened filenames.
          </p>
          <div className="stats">
            {statsData.map((stat) => (
              <div key={stat.label} className="stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

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
              {items.length
                ? `${String(currentIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`
                : "0 / 0"}
            </span>
            <span className="badge">{`${getGroup(filterKey).label} frames`}</span>
            <span className="badge">Tap a frame to jump</span>
          </div>
        </aside>
      </section>

      <div className="filter-bar" id="filterBar" aria-label="Gallery filters">
        <FilterBar groups={galleryGroups} activeKey={filterKey} onFilterChange={handleFilterChange} />
      </div>

      <section aria-label="Frame carousel">
        <div className="section-head">
          <div>
            <h2>Carousel frames</h2>
          </div>
          <p>
            Swipe horizontally, click any frame, or use the arrow keys. The active image stays
            large and centered.
          </p>
        </div>
        <Filmstrip items={items} activeIndex={currentIndex} onSelect={handleSelect} />
      </section>

      <div className="footer-note">
        Images are loaded from Cloudflare R2 Object Storage. If you change where images are served
        from, update the NEXT_PUBLIC_R2_PUBLIC_URL environment variable.
      </div>

      <section className="mt-10 space-y-6">
        <div className="rounded-[34px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] font-bold text-primary">
            Contact
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground m-0">
            William
          </h2>
          <a
            href="tel:+12369923846"
            className="inline-block mt-3 text-xl text-primary hover:opacity-80 transition-opacity"
          >
            236-992-3846
          </a>
        </div>

        <div className="rounded-[34px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
          <p className="mb-4 text-xs uppercase tracking-[0.24em] font-bold text-accent-2">
            Book a viewing
          </p>
          <h3 className="font-serif text-2xl tracking-tight text-foreground m-0 mb-6">
            Send us an inquiry
          </h3>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
