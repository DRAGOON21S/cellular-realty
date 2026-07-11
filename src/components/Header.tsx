const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "Projects", href: "#" },
  { label: "Blogs", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Buyers' Guide", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-30 w-full">
      <div className="mx-auto flex h-[140px] max-w-[1920px] items-center justify-between px-[40px]">
        <a
          href="#"
          className="flex h-[80px] w-[103px] items-center justify-center bg-cream font-serif text-lg font-semibold text-forest"
        >
          CR
        </a>

        <nav className="flex items-center gap-[50px]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-2xl font-bold tracking-[1.8px] transition-colors hover:text-amber ${
                link.active
                  ? "border-b-2 border-amber pb-1 text-amber"
                  : "text-cream"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-[60px]">
          <div className="flex items-center gap-[58px] text-2xl font-semibold">
            <span className="tracking-[0.43px] text-amber">EN</span>
            <span className="font-bold text-cream">हिं</span>
          </div>
          <a
            href="#"
            className="flex h-[70px] w-[186px] items-center justify-center bg-gold text-xl font-semibold tracking-[0.36px] text-cream"
          >
            ENQUIRE
          </a>
        </div>
      </div>
    </header>
  );
}
