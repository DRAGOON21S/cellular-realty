import Image from "next/image";

const PROJECT_LINKS = [
  "South City Greens",
  "South City 02",
  "Industrial Plots",
  "Upcoming Locations",
];

const COMPANY_LINKS = [
  "Our History",
  "Engineering Process",
  "Investors",
  "Careers",
];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Disclaimer"];

type FooterProps = {
  iconSuffix?: string;
};

export default function Footer({ iconSuffix = "" }: FooterProps) {
  return (
    <footer className="border-t-[1.5px] border-border-gray bg-cream">
      <div className="mx-auto max-w-[1920px] px-[120px] pt-[180px]">
        <div className="grid grid-cols-[521px_402px_400px_349px]">
          <div>
            <p className="font-serif text-[48px] font-medium leading-[1.25] text-forest">
              Cellular Realty
            </p>
            <p className="mt-[36px] max-w-[380px] text-2xl leading-[1.5] text-body">
              Builders by history, developers by choice. Delivering
              infrastructure-grade plotted townships across South India.
            </p>
            <div className="mt-[46px] flex items-center gap-6">
              <Image src={`/images/icon3${iconSuffix}.svg`} alt="Facebook" width={29} height={32} />
              <Image src={`/images/icon4${iconSuffix}.svg`} alt="Instagram" width={32} height={26} />
            </div>
          </div>

          <div>
            <p className="text-2xl font-semibold uppercase tracking-[1.8px] text-forest">
              Projects
            </p>
            <ul className="mt-[36px] flex flex-col gap-[27px]">
              {PROJECT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-2xl text-body hover:text-forest">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-2xl font-semibold uppercase tracking-[1.8px] text-forest">
              Company
            </p>
            <ul className="mt-[36px] flex flex-col gap-[27px]">
              {COMPANY_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-2xl text-body hover:text-forest">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-2xl font-semibold uppercase tracking-[1.8px] text-forest">
              Newsletter
            </p>
            <p className="mt-[36px] text-2xl leading-[1.5] text-body">
              Stay updated on pre-launch opportunities.
            </p>
            <form className="mt-[62px] flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email Address"
                className="border-b border-border-gray bg-transparent py-2 text-xl text-body placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="w-fit text-2xl font-semibold uppercase tracking-[1.8px] text-forest"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-[210px] flex items-center justify-between border-t border-border-gray/60 pb-[50px] pt-[36px] text-lg font-medium uppercase tracking-[1.8px] text-body">
          <p>© 2026 Cellular All Rights Reserved.</p>
          <div className="flex gap-8">
            {LEGAL_LINKS.map((link) => (
              <a key={link} href="#" className="hover:text-forest">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
