import { useMemo, useState } from "preact/hooks";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

/** Compact ₹ label: 43,391 · 54.1 L · 1.04 Cr */
function inrCompact(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${inr(n)}`;
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState(5_000_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = r === 0 ? amount / n : (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    return { emi, totalInterest: totalPayable - amount, totalPayable };
  }, [amount, years, rate]);

  return (
    <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Sliders */}
      <div>
        <Slider label="Loan Amount (₹)" value={inr(amount)} min={500_000} max={30_000_000} step={100_000} raw={amount} onInput={setAmount} />
        <Slider label="Tenure (Years)" value={String(years)} min={1} max={30} step={1} raw={years} onInput={setYears} />
        <Slider label="Interest Rate (% p.a.)" value={rate.toFixed(1)} min={5} max={15} step={0.1} raw={rate} onInput={setRate} />
      </div>

      {/* Result */}
      <div class="flex flex-col justify-center bg-brown-dark p-9 text-offwhite">
        <p class="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-offwhite/60">
          Estimated Monthly Payment
        </p>
        <p class="mt-3 text-center font-display text-5xl">₹{inr(emi)}</p>
        <p class="mx-auto mt-3 max-w-sm text-center text-[13px] text-offwhite/55">
          This estimate is calculated using the values selected. Final loan eligibility, interest
          rates and repayment terms may vary by bank or lender.
        </p>
        <div class="mt-8 grid grid-cols-2 gap-6 border-t border-offwhite/15 pt-6">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-offwhite/60">Total Interest</p>
            <p class="mt-1 font-display text-xl">{inrCompact(totalInterest)}</p>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-offwhite/60">Total Payable</p>
            <p class="mt-1 font-display text-xl">{inrCompact(totalPayable)}</p>
          </div>
        </div>
        <button
          type="button"
          data-enquire
          data-cta="Request Payment Guidance"
          data-project="Not Sure Yet"
          class="mt-8 w-full rounded-[2px] bg-brown-lightest px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-brown-dark hover:bg-brown-300"
        >
          Request Payment Guidance
        </button>
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, raw, onInput,
}: {
  label: string; value: string; min: number; max: number; step: number; raw: number; onInput: (n: number) => void;
}) {
  return (
    <div class="mb-9">
      <div class="flex items-baseline justify-between">
        <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-light">{label}</span>
        <span class="font-display text-xl text-brown-dark">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={raw}
        onInput={(e) => onInput(parseFloat((e.target as HTMLInputElement).value))}
        class="mt-3 w-full accent-brown-lightest"
      />
    </div>
  );
}
