import Image from "next/image";

export default function BrandNarrative() {
  return (
    <section className="bg-cream py-[120px]">
      <div className="mx-auto grid max-w-[1920px] grid-cols-[679px_965px] items-start gap-[26px] pl-[130px] pr-[120px]">
        <div className="pt-[70px]">
          <p className="text-2xl font-bold uppercase tracking-[3.6px] text-gold">
            About Us
          </p>
          <h2 className="mt-[24px] font-serif text-7xl font-semibold leading-[1.2] tracking-[3.6px] text-ink">
            Our Values &amp;
            <br />
            Evolutionary
            <br />
            Story
          </h2>
          <p className="mt-[92px] max-w-[633px] text-[27px] leading-[1.6] tracking-[0.27px] text-taupe">
            At Cellular Realty, we don&apos;t just build structures; we
            architect ecosystems. Inspired by the precision of cellular
            biology, our designs emphasize interconnectedness,
            sustainability, and human-centric luxury.
            <br />
            <br />
            Our journey didn&apos;t start with marketing brochures.
          </p>
          <button
            type="button"
            className="mt-[48px] flex h-[69px] w-[377px] items-center justify-center border-[1.5px] border-gold text-xl font-bold uppercase tracking-[3.6px] text-gold transition-colors hover:bg-gold hover:text-cream"
          >
            Explore Our Legacy
          </button>
        </div>

        <div className="relative">
          <div className="absolute -right-[72px] -top-[72px] h-72 w-72 border-[1.5px] border-gold/30" />
          <div className="absolute -bottom-[72px] -left-[72px] h-96 w-96 border-[1.5px] border-forest/20" />
          <div className="relative aspect-[965/900] w-full overflow-hidden">
            <Image
              src="/images/image8.png"
              alt="Cellular Realty site engineers on location"
              fill
              className="object-cover object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
