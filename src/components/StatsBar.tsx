import Image from "next/image";

const STATS = [
  {
    icon: "icon5",
    iconSize: { width: 28, height: 28 },
    value: "25+ Years",
    label: ["OF ARCHITECTURAL", "LEGACY"],
  },
  {
    icon: "icon6",
    iconSize: { width: 53, height: 24 },
    value: "10,000+",
    label: ["FAMILIES SERVED", "GLOBALLY"],
  },
  {
    icon: "icon7",
    iconSize: { width: 35, height: 28 },
    value: "15M+",
    label: ["SQ.FT DELIVERED", "NATIONWIDE"],
  },
];

type StatsBarProps = {
  iconSuffix?: string;
};

export default function StatsBar({ iconSuffix = "" }: StatsBarProps) {
  return (
    <section className="h-[390px] border-y-[1.5px] border-border-tan bg-cream">
      <div className="mx-auto grid h-full max-w-[1920px] grid-cols-3 divide-x-[1.5px] divide-border-tan px-[120px]">
        {STATS.map((stat) => (
          <div key={stat.value} className="flex items-center justify-center gap-[38px]">
            <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center">
              <Image src={`/images/ellipse2${iconSuffix}.svg`} alt="" fill className="object-contain" />
              <Image
                src={`/images/${stat.icon}${iconSuffix}.svg`}
                alt=""
                width={stat.iconSize.width}
                height={stat.iconSize.height}
                className="relative"
              />
            </div>
            <div>
              <p className="font-serif text-[48px] font-semibold leading-[1.3] tracking-[2.4px] text-ink">
                {stat.value}
              </p>
              <p className="mt-[2px] text-[18px] font-bold uppercase leading-[1] tracking-[3.6px] text-taupe">
                {stat.label[0]}
                <br />
                {stat.label[1]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
