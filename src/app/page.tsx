"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getFilteredItems, getGroup, statsData } from "@/config/gallery";
import { Filmstrip } from "@/components/filmstrip";
import { HeroViewer } from "@/components/hero-viewer";
import { InquiryForm } from "@/components/inquiry-form";

const PROPERTY_ADDRESS = "13573 98A Ave, Surrey, BC V3T 0X1";
const PROPERTY_PHONE = "236-992-3846";
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const googleMapsEmbedUrl = GOOGLE_MAPS_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(PROPERTY_ADDRESS)}`
  : `https://www.google.com/maps?q=${encodeURIComponent(PROPERTY_ADDRESS)}&output=embed`;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const items = getFilteredItems("all");

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
  }, [playing, startTimer, clearTimer]);

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
          <h1>Central Surrey summer rental.</h1>
          <p className="lede">
            Brand-new and never lived in, with a bright layout, modern finishings, in-suite
            washer/dryer, and one secure underground parking stall included. Ideal for a summer
            short-term stay in central Surrey, steps from King George SkyTrain and major bus
            routes, with quick Highway 1 access and about a 40-minute ride to downtown Vancouver.
            Close to Surrey City Centre Mall, T&T Supermarket, Holland Park, SFU Surrey, KPU,
            and everyday essentials.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a
              href="#inquiry-form"
              className="rounded-2xl border border-line bg-[rgba(8,10,14,0.6)] px-4 py-3 transition-colors hover:border-primary hover:bg-[rgba(240,179,90,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-1">
                Book now
              </p>
              <p className="text-sm text-muted-foreground">
                Summer short-term stays in central Surrey.
              </p>
            </a>
            <div className="rounded-2xl border border-line bg-[rgba(8,10,14,0.6)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-1">
                Easy commute
              </p>
              <p className="text-sm text-muted-foreground">
                SkyTrain, Highway 1, and downtown access.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-[rgba(8,10,14,0.6)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-1">
                Walkable living
              </p>
              <p className="text-sm text-muted-foreground">
                Mall, park, transit, and daily essentials nearby.
              </p>
            </div>
          </div>
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
            <span className="badge">{`${getGroup("all").label} frames`}</span>
            <span className="badge">Tap a frame to jump</span>
          </div>
        </aside>
      </section>

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
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[34px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="border-t border-line bg-[rgba(9,11,15,0.72)]">
              <iframe
                title="Google Map for the property"
                src={googleMapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-136 w-full border-0 sm:h-152 lg:h-176"
                allowFullScreen
              />
            </div>
          </div>

          <div className="rounded-[34px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
            <p className="mb-4 text-xs uppercase tracking-[0.24em] font-bold text-accent-2">
              Book a viewing
            </p>
            <h3 className="font-serif text-2xl tracking-tight text-foreground m-0 mb-6">
              Send us an inquiry
            </h3>
            <InquiryForm id="inquiry-form" />

            <div className="mt-8 border-t border-line pt-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] font-bold text-primary">
                Location
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">{PROPERTY_ADDRESS}</p>
              <a
                href={`tel:+1${PROPERTY_PHONE.replace(/[^0-9]/g, "")}`}
                className="block text-sm sm:text-base font-medium text-primary hover:opacity-80 transition-opacity"
              >
                {PROPERTY_PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
