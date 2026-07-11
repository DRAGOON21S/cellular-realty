const QUOTE = [
  '"As a retired civil engineer, I was',
  "impressed by the drainage systems at",
  "South City Greens. Cellular Realty",
  "treats a small plot with the same",
  'respect L&T treats a bridge. Truly',
  'builder-first."',
];

const TESTIMONIALS = [
  { name: "Ramesh K.", title: "Retired Chief Engineer" },
  { name: "Ramesh K.", title: "Retired Chief Engineer" },
  { name: "Ramesh K.", title: "Retired Chief Engineer" },
];

function Star() {
  return (
    <svg className="h-[28px] w-[30px] text-amber" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.26 6.9.6-5.2 4.53L18.2 21 12 17.27 5.8 21l1.6-7.61L2.2 8.86l6.9-.6L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-cream pb-[128px] pt-[80px]">
      <div className="mx-auto max-w-[1920px] px-[94px] text-center">
        <p className="text-2xl font-bold uppercase tracking-[3.6px] text-gold">
          Testimonials
        </p>
        <h2 className="mt-[16px] font-serif text-7xl font-semibold leading-[1.167] text-forest">
          Voices of Trust
        </h2>

        <div className="mt-[81px] grid grid-cols-3 gap-[32px] text-left">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col border-[1.5px] border-border-gray/20 bg-cream/90 p-[60px] shadow-[0px_30px_60px_0px_rgba(0,0,0,0.1)] backdrop-blur-[9px]"
            >
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} />
                ))}
              </div>
              <p className="mt-[36px] text-2xl italic leading-[1.6] text-body">
                {QUOTE.map((line, li) => (
                  <span key={li}>
                    {line}
                    {li < QUOTE.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="mt-[48px] flex items-center gap-4">
                <div className="h-[72px] w-[72px] shrink-0 rounded-full bg-border-tan" />
                <div>
                  <p className="text-2xl font-medium text-forest">{t.name}</p>
                  <p className="text-[15px] uppercase text-muted">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[59px] flex justify-center gap-[12px]">
          <span className="h-1.5 w-12 bg-amber-dark" />
          <span className="h-1.5 w-12 bg-border-tan" />
          <span className="h-1.5 w-12 bg-border-tan" />
        </div>
      </div>
    </section>
  );
}
