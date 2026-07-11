import Image from "next/image";

const FILTERS = [
  { label: "Location", value: "Bengaluru South" },
  { label: "Budget Range", value: "₹50L - ₹1.2Cr" },
  { label: "Project Status", value: "Pre-Launch" },
];

type HeroProps = {
  iconSuffix?: string;
};

export default function Hero({ iconSuffix = "" }: HeroProps) {
  return (
    <section className="relative h-[1280px] overflow-hidden bg-forest">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-image.jpeg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative mx-auto max-w-[1920px] px-[120px] pt-[422px]">
        <p className="text-2xl font-bold uppercase tracking-[3.6px] text-gold-light">
          Engineering Excellence Since 2026
        </p>
        <h1 className="mt-[21px] font-serif text-[96px] font-bold leading-[1.1] tracking-[-1.92px] text-cream">
          Builders first,
          <br />
          <span className="font-medium italic text-gold-light-2">developers</span>{" "}
          by choice.
        </h1>
        <p className="mt-[21px] max-w-[863px] text-[27px] font-medium leading-[1.556] text-cream/80">
          Years of infrastructure discipline on every plot. We don&apos;t just
          sell land; we engineer foundations for generations.
        </p>
      </div>

      <div className="relative mx-auto mt-[303px] max-w-[1920px] px-[222px]">
        <div className="flex h-[123px] items-center divide-x divide-cream/15 border-[1.5px] border-cream/15 bg-cream/5 pr-[34px] backdrop-blur-[9px]">
          {FILTERS.map((filter) => (
            <div key={filter.label} className="flex flex-1 items-center justify-between px-[42px]">
              <div>
                <p className="text-[15px] font-semibold uppercase leading-[1.5] text-amber">
                  {filter.label}
                </p>
                <p className="mt-1 font-hanken text-2xl leading-[1.5] text-cream">
                  {filter.value}
                </p>
              </div>
              <Image
                src={`/images/vector6${iconSuffix}.svg`}
                alt=""
                width={21}
                height={13}
                className="rotate-180"
              />
            </div>
          ))}

          <button
            type="button"
            className="flex h-[80px] w-[220px] shrink-0 items-center justify-center gap-[10px] bg-gradient-to-b from-gold-light to-gold text-xl font-bold uppercase tracking-[1.8px] text-cream"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
