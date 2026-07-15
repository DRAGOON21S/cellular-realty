import { useEffect, useRef, useState } from "preact/hooks";
import type { Pillar } from "../data/pillars";

interface Props {
  pillars: Pillar[];
  variant?: "panel" | "center";
}

const AUTOPLAY_MS = 5000;

export default function BrandPillars({ pillars, variant = "panel" }: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setInterval(() => setI((n) => (n + 1) % pillars.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, pillars.length]);

  const go = (n: number) => setI((n + pillars.length) % pillars.length);
  const p = pillars[i];

  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  const dots = (
    <div class="flex items-center justify-center gap-2">
      {pillars.map((_, n) => (
        <button
          type="button"
          aria-label={`Pillar ${n + 1}`}
          onClick={() => setI(n)}
          class={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-brown-lightest" : "w-4 bg-brown-light/40"}`}
        />
      ))}
    </div>
  );

  const image = (
    <div
      class="relative aspect-[16/10] w-full overflow-hidden"
      onTouchStart={onTouchStart as any}
      onTouchEnd={onTouchEnd as any}
    >
      {pillars.map((pil, n) => (
        <img
          src={pil.image}
          alt={pil.tag}
          loading={n === 0 ? "eager" : "lazy"}
          class={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${n === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );

  if (variant === "center") {
    return (
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div class="relative mx-auto max-w-3xl">
          {image}
          <button type="button" aria-label="Previous" onClick={() => go(i - 1)} class="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/90 text-brown-dark shadow hover:bg-offwhite">
            <Arrow dir="left" />
          </button>
          <button type="button" aria-label="Next" onClick={() => go(i + 1)} class="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-offwhite/90 text-brown-dark shadow hover:bg-offwhite">
            <Arrow dir="right" />
          </button>
        </div>
        <div class="mt-7 text-center">
          <p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-brown-light">Pillar {p.num} · {p.tag}</p>
          <h3 class="mt-2 font-display text-3xl text-brown-dark">{p.title}</h3>
          <p class="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-ink-soft">{p.body}</p>
        </div>
        <div class="mt-6">{dots}</div>
      </div>
    );
  }

  // panel (home): image carousel + pillar-name caption + dots (left intro is static in page)
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {image}
      <div class="mt-6 flex items-center justify-between gap-4">
        <p class="font-display text-2xl text-brown-dark">{p.title}</p>
        {dots}
      </div>
      <p class="mt-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-brown-light">{p.tag}</p>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}
