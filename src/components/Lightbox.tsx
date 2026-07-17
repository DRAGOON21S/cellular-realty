import { useEffect, useRef, useState } from "preact/hooks";

interface Item {
  src: string;
  alt?: string;
}

/**
 * Reusable image lightbox (spec §5.3 RERA/QR, §5.5 gallery).
 * Opens on any click of a `[data-lightbox]` element (reads `data-lightbox-src`,
 * `data-lightbox-alt`, optional `data-lightbox-group` to enable prev/next across a set),
 * or programmatically via `document.dispatchEvent(new CustomEvent("cr:lightbox", { detail: { items, index } }))`.
 * Escape closes, arrows/swipe navigate, focus is trapped and returned to the opener.
 */
export default function Lightbox() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  const openWith = (list: Item[], start: number) => {
    if (!list.length) return;
    prevFocus.current = document.activeElement as HTMLElement;
    setItems(list);
    setIdx(Math.max(0, Math.min(start, list.length - 1)));
  };
  const close = () => {
    setItems(null);
    prevFocus.current?.focus?.();
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-lightbox]");
      if (!trigger) return;
      e.preventDefault();
      const group = trigger.dataset.lightboxGroup;
      const nodes = group
        ? Array.from(document.querySelectorAll<HTMLElement>(`[data-lightbox][data-lightbox-group="${group}"]`))
        : [trigger];
      const list = nodes
        .map((n) => ({ src: n.dataset.lightboxSrc || "", alt: n.dataset.lightboxAlt || "" }))
        .filter((i) => i.src);
      openWith(list, Math.max(0, nodes.indexOf(trigger)));
    };
    const onCustom = (e: Event) => {
      const d = (e as CustomEvent).detail as { items?: Item[]; index?: number };
      if (d?.items?.length) openWith(d.items, d.index ?? 0);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("cr:lightbox", onCustom as EventListener);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("cr:lightbox", onCustom as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!items) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") setIdx((i) => (i + 1) % items.length);
      else if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + items.length) % items.length);
      else if (e.key === "Tab") {
        e.preventDefault(); // simple focus trap: keep focus on the dialog
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [items]);

  if (!items) return null;
  const many = items.length > 1;
  const go = (n: number) => setIdx((n + items.length) % items.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      class="fixed inset-0 z-[110] flex items-center justify-center bg-brown-900/90 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e: any) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e: any) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40 && many) go(idx + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={close}
        aria-label="Close"
        class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-offwhite/20"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>

      {many && (
        <button
          type="button"
          onClick={() => go(idx - 1)}
          aria-label="Previous image"
          class="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-offwhite/20 sm:left-8"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
      )}

      <img src={items[idx].src} alt={items[idx].alt || ""} class="max-h-[88vh] max-w-[92vw] rounded-[4px] object-contain shadow-2xl" />

      {many && (
        <button
          type="button"
          onClick={() => go(idx + 1)}
          aria-label="Next image"
          class="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-offwhite/10 text-offwhite transition-colors hover:bg-offwhite/20 sm:right-8"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      )}

      {many && (
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] font-medium text-offwhite/80">
          {idx + 1} / {items.length}
        </div>
      )}
    </div>
  );
}
