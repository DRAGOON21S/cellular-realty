import type { Metadata } from "next";
import Link from "next/link";
import HouseScroll from "@/components/HouseScroll";

export const metadata: Metadata = {
  title: "House Build Scroll — Cellular Realty",
  description:
    "Scroll-driven 3D house build demo: an empty plot becomes a home as you scroll.",
};

export default function HouseScrollPage() {
  return (
    <div className="theme-brown flex flex-col">
      {/* Intro — gives the pinned scene a runway and sets expectations */}
      <section className="flex h-[70vh] flex-col items-center justify-center gap-6 px-8 text-center">
        <p className="text-xs font-medium tracking-[0.35em] text-[#9a7d5e] uppercase">
          Cellular Realty
        </p>
        <h1
          className="max-w-4xl text-5xl leading-tight text-[#413126] md:text-6xl"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Every home starts with empty ground.
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-[#413126]/70">
          Keep scrolling — and watch one get built.
        </p>
        <span aria-hidden className="mt-6 animate-bounce text-2xl text-[#9a7d5e]">
          ↓
        </span>
      </section>

      {/* The pinned, scroll-scrubbed 3D build */}
      <HouseScroll />

      {/* Outro */}
      <section className="flex h-[60vh] flex-col items-center justify-center gap-6 px-8 text-center">
        <h2
          className="max-w-3xl text-4xl text-[#413126]"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Ready to build yours?
        </h2>
        <Link
          href="/"
          className="border border-[#9a7d5e] px-8 py-3 text-xs font-medium tracking-[0.25em] text-[#413126] uppercase transition-colors hover:bg-[#9a7d5e] hover:text-[#fcfdf5]"
        >
          Back to home
        </Link>
      </section>
    </div>
  );
}
