import { useEffect, useRef, useState } from "preact/hooks";

export interface FeaturedItem {
  slug: string;
  name: string;
  location: string;
  landArea: string;
  plotSizes: string;
  image: string;
  badge: string;
}

interface Props {
  items: FeaturedItem[];
}

const AUTOPLAY_MS = 6000;

export default function FeaturedProjects({ items }: Props) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    if (paused || reduced.current || items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const go = (n: number) => setI((n + items.length) % items.length);
  const p = items[i];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e: any) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e: any) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div class="overflow-hidden border border-[color:var(--color-line)] bg-offwhite">
        <a href={`/projects/${p.slug}`} class="relative block aspect-[21/9] overflow-hidden">
          {items.map((it, n) => (
            <img
              src={it.image}
              alt={it.name}
              loading={n === 0 ? "eager" : "lazy"}
              class={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${n === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <span class="absolute right-5 top-5 bg-brown-lightest px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brown-dark">
            {p.badge}
          </span>
        </a>
        <div class="flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-9">
          <div>
            <h3 class="font-display text-3xl text-brown-dark lg:text-[34px]">{p.name}</h3>
            <p class="mt-1.5 text-[15px] text-brown-light">{p.location}</p>
          </div>
          <div class="flex items-center gap-10">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.1em] text-brown-light">Land Area</p>
              <p class="mt-1 font-display text-xl text-brown-dark">{p.landArea}</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.1em] text-brown-light">Plot Size</p>
              <p class="mt-1 font-display text-xl text-brown-dark">{p.plotSizes}</p>
            </div>
          </div>
          <a
            href={`/projects/${p.slug}`}
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border border-brown-dark px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-dark transition-colors hover:bg-brown-dark hover:text-offwhite"
          >
            Explore {p.name} →
          </a>
        </div>
      </div>

      {items.length > 1 && (
        <div class="mt-7 flex items-center justify-center gap-2">
          {items.map((_, n) => (
            <button
              type="button"
              aria-label={`Project ${n + 1}`}
              onClick={() => setI(n)}
              class={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-brown-lightest" : "w-4 bg-brown-light/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
