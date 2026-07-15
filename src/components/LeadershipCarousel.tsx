import { useState } from "preact/hooks";

export interface LeaderItem {
  name: string;
  designation: string;
  bio: string;
  image: string | null;
}

interface Props {
  leaders: LeaderItem[];
}

export default function LeadershipCarousel({ leaders }: Props) {
  const [i, setI] = useState(0);
  const l = leaders[i];

  return (
    <div class="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_1.1fr] lg:gap-16">
      {/* Featured photo */}
      <div class="relative aspect-[4/5] w-full max-w-md overflow-hidden bg-brown-800">
        {l.image && <img src={l.image} alt={l.name} class="h-full w-full object-cover object-top" />}
      </div>

      {/* Details + thumbnails */}
      <div>
        <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-brown-300">{l.designation}</p>
        <h3 class="mt-2 font-display text-4xl text-offwhite lg:text-5xl">{l.name}</h3>
        <p class="mt-6 max-w-xl text-[16px] leading-relaxed text-offwhite/70">{l.bio}</p>

        <div class="mt-10">
          <p class="text-[12px] font-semibold uppercase tracking-[0.14em] text-brown-300">Our Leadership</p>
          <div class="mt-4 flex flex-wrap gap-3">
            {leaders.map((ld, n) => (
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={ld.name}
                aria-current={n === i ? "true" : "false"}
                class={`h-16 w-16 overflow-hidden rounded-[2px] border-2 transition-all ${n === i ? "border-brown-lightest" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                {ld.image && <img src={ld.image} alt="" class="h-full w-full object-cover object-top" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
