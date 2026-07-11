const CLIENTS = [
  "L&T Infra",
  "CPWD",
  "Indian Railways",
  "NBCC",
  "PWD Haryana",
];

export default function ClientLogos() {
  return (
    <section className="h-[260px] border-t-[1.5px] border-border-gray/40 bg-cream-2">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between px-[120px]">
        {CLIENTS.map((name) => (
          <span
            key={name}
            className="font-serif text-[36px] font-semibold tracking-[0.5px] text-forest opacity-70"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
