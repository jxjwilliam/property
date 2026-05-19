"use client";

import { useCallback, useEffect, useRef } from "react";
import type { GalleryImage } from "@/config/gallery";

interface HeroViewerProps {
  items: GalleryImage[];
  currentIndex: number;
  playing: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onPause: () => void;
  onResume: () => void;
}

export function HeroViewer({
  items,
  currentIndex,
  playing,
  onPrev,
  onNext,
  onTogglePlay,
  onPause,
  onResume,
}: HeroViewerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const switchingRef = useRef(false);

  const current = items[currentIndex];

  const showSwitch = useCallback(() => {
    if (switchingRef.current) return;
    switchingRef.current = true;
    frameRef.current?.classList.add("opacity-20", "scale-[1.04]");
    window.setTimeout(() => {
      switchingRef.current = false;
      frameRef.current?.classList.remove("opacity-20", "scale-[1.04]");
    }, 220);
  }, []);

  useEffect(() => {
    if (!current) return;
    showSwitch();
  }, [current, showSwitch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        onTogglePlay();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPrev, onNext, onTogglePlay]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const pause = () => onPause();
    const resume = () => onResume();
    el.addEventListener("mouseenter", pause);
    el.addEventListener("focusin", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusout", resume);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusout", resume);
    };
  }, [onPause, onResume]);

  if (!current) {
    return (
      <div className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] flex items-center justify-center aspect-[4/3]">
        <p className="text-[var(--muted-foreground)]">No images found.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[34px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      <div className="relative aspect-[4/3]" ref={frameRef}>
        <img
          ref={imgRef}
          src={current.url}
          alt={`${current.caption} from ${current.source}`}
          decoding="async"
          className="w-full h-full object-cover block scale-[1.01] transition-all duration-240 ease"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,6,8,0.92)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
          <div className="min-w-0 flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-widest text-[var(--primary)] font-bold">
              {current.source}
            </span>
            <p className="font-serif text-lg sm:text-xl leading-tight tracking-tight text-[var(--foreground)] m-0">
              {current.caption}
            </p>
            <span className="text-sm text-[var(--muted-foreground)]">
              {current.subcaption}
            </span>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              className="w-12 h-12 inline-grid place-items-center rounded-full border border-[var(--line)] bg-[rgba(9,11,15,0.72)] text-[var(--foreground)] text-lg cursor-pointer transition-all duration-180 hover:border-[rgba(255,255,255,0.28)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-px active:translate-y-0"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="w-12 h-12 inline-grid place-items-center rounded-full border border-[var(--line)] bg-[rgba(9,11,15,0.72)] text-[var(--foreground)] text-lg cursor-pointer transition-all duration-180 hover:border-[rgba(255,255,255,0.28)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-px active:translate-y-0"
            >
              ›
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
              className="w-12 h-12 inline-grid place-items-center rounded-full border border-[var(--line)] bg-[rgba(9,11,15,0.72)] text-[var(--foreground)] text-sm cursor-pointer transition-all duration-180 hover:border-[rgba(255,255,255,0.28)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-px active:translate-y-0"
            >
              {playing ? "❚❚" : "▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
