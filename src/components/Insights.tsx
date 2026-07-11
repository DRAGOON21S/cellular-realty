import Image from "next/image";

const POSTS = [
  {
    tag: "ARCHITECTURE • 5 MIN READ",
    title: ["The Future of Cellular", "Urbanism"],
    excerpt:
      "Exploring how biological patterns are reshaping the way we design high-density residential…",
  },
  {
    tag: "DESIGN • 4 MIN READ",
    title: ["Minimalism vs.", "Human-Centricity"],
    excerpt:
      "Why the next generation of luxury homes prioritizes emotional well-being over pure…",
  },
  {
    tag: "SUSTAINABILITY • 7 MIN READ",
    title: ["Engineering for", "Longevity"],
    excerpt:
      "A deep dive into the precision materials that allow our structures to withstand the test of…",
  },
];

export default function Insights() {
  return (
    <section className="bg-cream-2 pb-[84px] pt-[100px]">
      <div className="mx-auto max-w-[1920px] px-[120px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold uppercase tracking-[3.6px] text-gold">
              Knowledge Hub
            </p>
            <h2 className="mt-[24px] font-serif text-7xl font-semibold leading-[1.167] text-forest">
              Latest Insights
            </h2>
          </div>
          <button
            type="button"
            className="flex h-[69px] w-[294px] shrink-0 items-center justify-center border border-gold text-xl font-semibold uppercase tracking-[1.8px] text-gold transition-colors hover:bg-gold hover:text-cream"
          >
            View Blogs
          </button>
        </div>

        <div className="mt-[72px] grid grid-cols-3 gap-[36px]">
          {POSTS.map((post) => (
            <article key={post.tag} className="flex flex-col">
              <div className="relative aspect-[536/301] w-full overflow-hidden">
                <Image src="/images/image4.jpg" alt="" fill className="object-cover" />
              </div>
              <p className="mt-[44px] text-xl font-bold uppercase tracking-[3.6px] text-gold">
                {post.tag}
              </p>
              <h3 className="mt-[25px] font-serif text-[48px] font-medium leading-[1.25] text-forest">
                {post.title[0]}
                <br />
                {post.title[1]}
              </h3>
              <p className="mt-[62px] text-2xl leading-[1.6] text-taupe">
                {post.excerpt}
              </p>
              <a
                href="#"
                className="mt-[59px] flex items-center gap-3 text-lg font-bold uppercase tracking-[3.6px] text-amber-dark"
              >
                Read Article
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
