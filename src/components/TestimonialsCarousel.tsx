import { useEffect, useRef, useState } from "preact/hooks";

export interface TItem {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface Props {
  items: TItem[];
  perView?: number;
}

const AUTOPLAY_MS = 7000;

export default function TestimonialsCarousel({ items, perView = 3 }: Props) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pv, setPv] = useState(perView);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPv(mq.matches ? 1 : perView);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [perView]);

  const pages = Math.ceil(items.length / pv);
  useEffect(() => {
    if (paused || reduced.current || pages < 2) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pages), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, pages]);
  useEffect(() => setPage((p) => Math.min(p, pages - 1)), [pages]);

  const start = page * pv;
  const shown = items.slice(start, start + pv);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div class="grid gap-8 md:grid-cols-3">
        {shown.map((t) => (
          <figure class="flex flex-col bg-offwhite p-8 shadow-[0_18px_50px_-30px_rgba(65,49,38,0.4)]">
            <div class="flex gap-1 text-brown-lightest">
              {Array.from({ length: t.rating }).map(() => (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <blockquote class="mt-5 flex-1 text-[16px] leading-relaxed text-ink">"{t.quote}"</blockquote>
            <figcaption class="mt-7 flex items-center gap-4">
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-brown-200 font-display text-lg text-brown-dark">{t.name.charAt(0)}</span>
              <span>
                <span class="block font-display text-lg text-brown-dark">{t.name}</span>
                <span class="block text-[11px] font-semibold uppercase tracking-[0.1em] text-brown-light">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {pages > 1 && (
        <div class="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: pages }).map((_, n) => (
            <button
              type="button"
              aria-label={`Testimonials page ${n + 1}`}
              onClick={() => setPage(n)}
              class={`h-1.5 rounded-full transition-all ${n === page ? "w-8 bg-brown-lightest" : "w-4 bg-brown-light/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
