import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { mapCities, type MapStatus, type ProjectMapItem } from "../lib/project-map";

interface Props {
  items: ProjectMapItem[];
  eyebrow: string;
  heading: string;
  paragraph: string;
}

type Filter = "All" | "Ongoing" | "Completed" | "Upcoming";
const FILTERS: Filter[] = ["All", "Ongoing", "Completed", "Upcoming"];

const cx = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

const CSS = `
.cr-map-mk{transform-box:fill-box;transform-origin:center;transition:transform .22s ease,opacity .22s ease;cursor:pointer;outline:none}
.cr-map-mk--hover{transform:scale(1.22)}
.cr-map-mk--dim{opacity:.32}
.cr-map-mk--hidden{opacity:.1;pointer-events:none}
.cr-map-marker[data-focus="on"] .cr-map-focus{opacity:1}
.cr-map-focus{opacity:0;transition:opacity .15s ease}
.cr-map-route{transition:opacity .35s ease,stroke-width .3s ease}
.cr-map-draw{stroke-dasharray:1;stroke-dashoffset:1}
.cr-map-draw.cr-in{stroke-dashoffset:0;transition:stroke-dashoffset 1.15s ease}
.cr-map-fade{opacity:0}
.cr-map-fade.cr-in{opacity:var(--o,1);transition:opacity .8s ease}
.cr-map-enter{opacity:0;transform:scale(.82);transform-box:fill-box;transform-origin:center}
.cr-map-enter.cr-in{opacity:1;transform:scale(1);transition:opacity .35s ease,transform .35s ease}
.cr-map-label{paint-order:stroke;stroke:var(--color-offwhite);stroke-width:3px;stroke-linejoin:round}
@keyframes cr-map-pulse{0%,100%{opacity:.55;r:20px}50%{opacity:0;r:31px}}
.cr-map-pulse{animation:cr-map-pulse 2.6s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){
  .cr-map-pulse{animation:none}
  .cr-map-draw{stroke-dashoffset:0!important;transition:none!important}
  .cr-map-fade{opacity:var(--o,1)!important;transition:none!important}
  .cr-map-enter{opacity:1!important;transform:none!important;transition:none!important}
}
`;

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function Check({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function statusMatch(status: MapStatus, filter: Filter) {
  return filter === "All" || status === filter;
}

/** Info card (used for the desktop active card and each mobile carousel card). */
function ProjectCardBody({ item }: { item: ProjectMapItem }) {
  const toneCls =
    item.status === "Ongoing"
      ? "bg-brown-lightest/25 text-brown-dark"
      : item.status === "Completed"
        ? "bg-brown-100 text-brown-700"
        : "border border-brown-light/40 text-brown-light";
  return (
    <>
      <span class={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", toneCls)}>
        {item.status === "Completed" && <Check size={12} />}
        {item.status}
      </span>
      <h3 class="mt-4 font-display text-3xl leading-tight text-brown-dark">{item.name}</h3>
      <p class="mt-1 text-[14px] text-brown-light">{item.location}</p>
      <p class="mt-4 text-[15px] leading-relaxed text-ink-soft">{item.description}</p>
      {item.details.length > 0 && (
        <ul class="mt-4 space-y-1.5">
          {item.details.map((d) => (
            <li class="flex items-center gap-2 text-[14px] text-brown-dark">
              <span class="h-1 w-1 rounded-full bg-brown-lightest" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
      )}
      <div class="mt-6">
        {item.cta.kind === "link" ? (
          <a
            href={item.cta.href}
            class="inline-flex items-center gap-2 rounded-[2px] bg-brown-dark px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-offwhite transition-colors hover:bg-brown-700"
          >
            {item.cta.label} <ArrowRight />
          </a>
        ) : (
          <button
            type="button"
            data-enquire
            data-project={item.cta.project}
            data-cta="Register Interest"
            class="inline-flex items-center gap-2 rounded-[2px] bg-brown-dark px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-offwhite transition-colors hover:bg-brown-700"
          >
            {item.cta.label} <ArrowRight />
          </button>
        )}
      </div>
    </>
  );
}

export default function ProjectMap({ items, eyebrow, heading, paragraph }: Props) {
  const firstOngoing = items.find((i) => i.status === "Ongoing") ?? items[0];
  const [activeId, setActiveId] = useState(firstOngoing?.id ?? "");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [revealed, setRevealed] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  const isVisible = (i: ProjectMapItem) => statusMatch(i.status, filter);
  const visibleItems = useMemo(() => items.filter(isVisible), [items, filter]);
  const active = items.find((i) => i.id === activeId) ?? firstOngoing;
  const hoverItem = hoverId ? items.find((i) => i.id === hoverId) : null;

  // Reveal (route draw-on + marker fade) once the map scrolls into view.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setRevealed(true);
      return;
    }
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the active item within the current filter.
  useEffect(() => {
    if (active && !isVisible(active) && visibleItems[0]) setActiveId(visibleItems[0].id);
  }, [filter]);

  // Sync mobile carousel to the active card.
  useEffect(() => {
    const row = carouselRef.current;
    if (!row) return;
    const card = row.querySelector<HTMLElement>(`[data-card="${activeId}"]`);
    if (!card) return;
    programmatic.current = true;
    card.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    const t = setTimeout(() => (programmatic.current = false), 500);
    return () => clearTimeout(t);
  }, [activeId]);

  const activate = (id: string) => setActiveId(id);

  const onFilter = (f: Filter) => {
    setFilter(f);
    const firstOfFilter = items.find((i) => statusMatch(i.status, f));
    if (firstOfFilter) setActiveId(firstOfFilter.id);
    setHoverId(null);
  };

  // Reverse sync: swiping the carousel updates the active marker.
  const onCarouselScroll = () => {
    if (programmatic.current) return;
    const row = carouselRef.current;
    if (!row) return;
    const center = row.scrollLeft + row.clientWidth / 2;
    let best: string | null = null;
    let bestDist = Infinity;
    row.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
      const mid = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = c.dataset.card ?? null;
      }
    });
    if (best && best !== activeId) setActiveId(best);
  };

  const highlightPrimary = hoverItem && (hoverItem.cityLabel === "Jhajjar" || hoverItem.cityLabel === "Farrukhnagar");
  const highlightRewari = hoverItem && hoverItem.cityLabel === "Rewari";
  const inCls = (base: string) => `${base}${revealed ? " cr-in" : ""}`;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div class="lg:grid lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:items-start lg:gap-12">
        {/* LEFT column */}
        <div>
          <p class="eyebrow">{eyebrow}</p>
          <h2 class="mt-4 font-display text-4xl leading-[1.1] text-brown-dark lg:text-[46px]">{heading}</h2>
          <p class="mt-5 text-[16px] leading-relaxed text-ink-soft">{paragraph}</p>

          {/* Filters */}
          <div class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by status">
            {FILTERS.map((f) => {
              const on = filter === f;
              return (
                <button
                  type="button"
                  aria-pressed={on ? "true" : "false"}
                  onClick={() => onFilter(f)}
                  class={cx(
                    "min-h-[40px] rounded-[2px] border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                    on
                      ? "border-brown-dark bg-brown-dark text-offwhite"
                      : "border-brown-light/40 text-brown-light hover:border-brown-dark hover:text-brown-dark",
                  )}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Desktop active card */}
          <div class="mt-8 hidden lg:block" aria-live="polite">
            {active && (
              <div class="rounded-[4px] border border-[color:var(--color-line)] bg-offwhite p-7">
                <ProjectCardBody item={active} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT column: SVG map */}
        <div class="mt-8 lg:mt-0">
          <svg
            ref={svgRef}
            viewBox="0 0 1000 750"
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Map of Cellular Realty projects across the Gurugram, Farrukhnagar, Jhajjar and Rewari corridor"
            class="h-auto w-full"
          >
            {/* ---- routes (behind) ---- */}
            <g fill="none" stroke-linecap="round">
              {/* Delhi–Gurugram (secondary) */}
              <path d="M 872 128 Q 800 220 726 320" class={inCls("cr-map-route cr-map-fade")} style="--o:.5" stroke="var(--color-brown-light)" stroke-width="2" />
              {/* Rewari future route (secondary dotted) */}
              <path d="M 470 402 Q 380 512 300 612" class={inCls("cr-map-route cr-map-fade")} style={`--o:${highlightRewari ? 0.85 : 0.4}`} stroke="var(--color-brown-light)" stroke-width={highlightRewari ? 2.4 : 1.6} stroke-dasharray="2 8" />
              {/* KMP Expressway (secondary dotted) */}
              <path d="M 430 250 Q 402 430 470 604" class={inCls("cr-map-route cr-map-fade")} style="--o:.4" stroke="var(--color-brown-light)" stroke-width="1.6" stroke-dasharray="2 8" />
              {/* PRIMARY Gurugram–Farrukhnagar–Jhajjar corridor */}
              <path
                d="M 726 322 Q 590 352 470 402 Q 348 336 244 224"
                pathLength={1}
                class={inCls("cr-map-route cr-map-draw")}
                stroke="var(--color-brown-lightest)"
                stroke-width={highlightPrimary ? 4.5 : 3.4}
                style={highlightPrimary ? "opacity:1" : "opacity:.9"}
              />
              {/* corridor label */}
              <text x="500" y="332" text-anchor="middle" transform="rotate(-13 500 332)" class="cr-map-label" fill="var(--color-brown-dark)" font-size="15" font-weight="600" style="font-family:var(--font-sans)">
                Gurugram–Jhajjar Growth Corridor
              </text>
              <text x="392" y="452" text-anchor="middle" class="cr-map-label" fill="var(--color-brown-light)" font-size="12" style="font-family:var(--font-sans)">KMP Expressway</text>
            </g>

            {/* ---- reference city labels ---- */}
            <g fill="var(--color-brown-light)" style="font-family:var(--font-sans)">
              {mapCities.map((c) => (
                <text
                  x={c.x}
                  y={c.y}
                  text-anchor={c.anchor}
                  font-size="15"
                  font-weight="600"
                  class={cx("cr-map-label", c.secondary && "max-md:hidden")}
                >
                  {c.name}
                </text>
              ))}
              {/* project city cluster labels */}
              <text x="238" y="168" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-brown-dark)" class="cr-map-label" style="font-family:var(--font-display)">Jhajjar</text>
              <text x="470" y="446" text-anchor="middle" font-size="16" font-weight="700" fill="var(--color-brown-dark)" class="cr-map-label" style="font-family:var(--font-display)">Farrukhnagar</text>
              <text x="300" y="656" text-anchor="middle" font-size="16" font-weight="700" fill="var(--color-brown-dark)" class="cr-map-label" style="font-family:var(--font-display)">Rewari</text>
            </g>

            {/* ---- markers (on top) ---- */}
            <g>
              {items.map((item, i) => {
                const shown = isVisible(item);
                const isActive = activeId === item.id;
                const isHover = hoverId === item.id;
                const dim = !!hoverId && !isHover && shown;
                const ringColor = item.status === "Completed" ? "var(--color-brown-dark)" : "var(--color-brown-lightest)";
                return (
                  <g
                    class="cr-map-marker"
                    data-focus="off"
                    role="button"
                    tabIndex={shown ? 0 : -1}
                    aria-label={`View ${item.name} project information`}
                    transform={`translate(${item.position.x} ${item.position.y})`}
                    onMouseEnter={() => shown && (setHoverId(item.id), activate(item.id))}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={(e) => {
                      if (!shown) return;
                      (e.currentTarget as SVGGElement).setAttribute("data-focus", "on");
                      setHoverId(item.id);
                      activate(item.id);
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as SVGGElement).setAttribute("data-focus", "off");
                      setHoverId(null);
                    }}
                    onClick={() => shown && activate(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        activate(item.id);
                      }
                    }}
                  >
                    {/* invisible hit target (≥44px at smallest render) */}
                    <circle r="46" fill="transparent" />
                    <g class={cx(inCls("cr-map-enter"), "cr-map-mk", isHover && "cr-map-mk--hover", dim && "cr-map-mk--dim", !shown && "cr-map-mk--hidden")} style={`transition-delay:${revealed ? 0 : i * 80}ms`}>
                      {/* focus ring */}
                      <circle class="cr-map-focus" r="27" fill="none" stroke="var(--color-brown-lightest)" stroke-width="2" stroke-dasharray="3 3" />
                      {/* status-specific outer treatment */}
                      {item.status === "Upcoming" && <circle class="cr-map-pulse" r="20" fill="none" stroke="var(--color-brown-lightest)" stroke-width="1.5" />}
                      {(isActive || item.status === "Ongoing") && <circle r="23" fill="none" stroke="var(--color-brown-lightest)" stroke-opacity="0.45" stroke-width="1.5" />}
                      {/* base marker */}
                      <circle r="15" fill="var(--color-offwhite)" stroke={ringColor} stroke-width="2.6" stroke-dasharray={item.status === "Upcoming" ? "4 3" : undefined} />
                      <circle r="4.5" fill="var(--color-brown-dark)" />
                      {/* completed check badge */}
                      {item.status === "Completed" && (
                        <g transform="translate(11 -11)">
                          <circle r="8" fill="var(--color-brown-lightest)" />
                          <g transform="translate(-4 -4) scale(0.33)" fill="none" stroke="var(--color-brown-dark)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </g>
                        </g>
                      )}
                    </g>
                    {/* short label on hover/active */}
                    {(isHover || isActive) && shown && (
                      <text x="0" y="34" text-anchor="middle" class="cr-map-label" fill="var(--color-brown-dark)" font-size="13" font-weight="600" style="font-family:var(--font-sans)">
                        {item.shortName}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* MOBILE carousel (synced with markers) */}
        <div class="mt-6 lg:hidden">
          <div
            ref={carouselRef}
            onScroll={onCarouselScroll}
            class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {visibleItems.map((item) => (
              <button
                type="button"
                data-card={item.id}
                onClick={() => activate(item.id)}
                class={cx(
                  "w-[86%] shrink-0 snap-center rounded-[4px] border p-6 text-left transition-colors",
                  activeId === item.id ? "border-brown-dark bg-offwhite" : "border-[color:var(--color-line)] bg-offwhite/70",
                )}
              >
                <ProjectCardBody item={item} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
