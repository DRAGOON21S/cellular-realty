import Image from "next/image";

type ProjectCardProps = {
  image: string;
  location: string;
  name: string;
  plotSize: string;
  price: string;
  ctaLabel: string;
  dark?: boolean;
};

function ProjectCard({
  image,
  location,
  name,
  plotSize,
  price,
  ctaLabel,
  dark,
}: ProjectCardProps) {
  return (
    <div className="flex flex-1 flex-col border-[1.5px] border-border-gray/10 bg-cream shadow-[0px_30px_60px_0px_rgba(0,0,0,0.1)]">
      <div className="relative aspect-[813/400] w-full overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col px-[48px] pb-[48px] pt-[40px]">
        <div>
          <h3 className="font-serif text-5xl font-medium text-forest">{name}</h3>
          <p className="text-2xl leading-[1.5] text-body">{location}</p>
        </div>
        <div className="mt-[34px] flex flex-wrap gap-8">
          <div>
            <p className="text-[15px] font-medium uppercase text-muted">
              Plot Sizes
            </p>
            <p className="mt-[2px] text-[30px] font-semibold leading-[1.4] tracking-[1.5px] text-forest">
              {plotSize}
            </p>
          </div>
          <div>
            <p className="text-[15px] font-medium uppercase text-muted">
              Starting Price
            </p>
            <p className="mt-[2px] text-[30px] font-semibold leading-[1.4] tracking-[1.5px] text-gold">
              {price}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={`mt-[48px] flex h-[72px] items-center justify-center gap-3 border-2 border-gold text-xl font-bold uppercase tracking-[1.8px] transition-colors ${
            dark ? "bg-gold text-cream" : "bg-cream text-gold hover:bg-gold hover:text-cream"
          }`}
        >
          {ctaLabel}
          <svg
            className="h-4 w-4 rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section className="bg-cream pb-[100px] pt-[100px]">
      <div className="mx-auto max-w-[1920px] px-[120px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold uppercase tracking-[3.6px] text-gold">
              Our Portfolio
            </p>
            <h2 className="mt-[24px] font-serif text-7xl font-semibold leading-[1.167] text-forest">
              Iconic Plotted Townships
            </h2>
          </div>
          <button
            type="button"
            className="flex h-[69px] w-[294px] shrink-0 items-center justify-center border border-gold text-xl font-semibold uppercase tracking-[1.8px] text-gold transition-colors hover:bg-gold hover:text-cream"
          >
            Explore More
          </button>
        </div>

        <div className="mt-[40px] flex gap-[48px]">
          <ProjectCard
            image="/images/image.png"
            location="Hill Road, Mumbai"
            name="Name of the Plot"
            plotSize="1200 - 4000 Sq.Ft"
            price="₹48 Lakhs*"
            ctaLabel="Explore South City Green"
          />
          <ProjectCard
            image="/images/image2.png"
            location="Hill Road, Mumbai"
            name="Name of the Plot"
            plotSize="1200 - 4000 Sq.Ft"
            price="₹48 Lakhs*"
            ctaLabel="Explore South City Green"
            dark
          />
        </div>
      </div>
    </section>
  );
}
