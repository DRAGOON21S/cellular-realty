import Image from "next/image";

export default function NewsletterCTA() {
  return (
    <section className="relative overflow-hidden bg-forest pb-[95px] pt-[95px]">
      <div className="absolute inset-y-0 right-0 w-[40%] opacity-40 mix-blend-multiply">
        <Image src="/images/image1.png" alt="" fill className="object-cover" />
      </div>

      <div className="relative mx-auto max-w-[1920px] px-[120px]">
        <h2 className="font-serif text-7xl font-medium leading-[1.2] tracking-[3.6px] text-cream">
          Join the Cellular
          <br />
          Realty Family
        </h2>
        <p className="mt-[54px] max-w-[557px] text-2xl leading-[1.6] text-gold-light-2">
          Exclusive updates on new projects, market insights, and investment
          opportunities.
        </p>

        <div className="mt-[55px] max-w-[1344px]">
          <p className="text-lg font-bold uppercase tracking-[3.6px] text-cream/70">
            Email Address
          </p>
          <form className="mt-[20px] flex flex-row gap-[22px]">
            <input
              type="email"
              placeholder="YOUR@EMAIL.COM"
              className="h-[86px] max-w-[897px] w-full border border-cream bg-transparent px-5 text-xl text-cream placeholder:text-cream/25 focus:outline-none"
            />
            <button
              type="submit"
              className="h-[66px] w-[425px] shrink-0 self-center bg-gradient-to-b from-gold-light to-gold px-10 text-lg font-bold uppercase tracking-[3.6px] text-forest"
            >
              Subscribe to Updates
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
