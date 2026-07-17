import { useMemo, useState } from "preact/hooks";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));

/** Compact ₹ label: 43,391 · 54.1 L · 1.04 Cr */
function inrCompact(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${inr(n)}`;
}

interface Labels {
  loanAmount?: string;
  tenure?: string;
  interestRate?: string;
  estimatedMonthly?: string;
  disclaimer?: string;
  totalInterest?: string;
  totalPayable?: string;
  requestGuidance?: string;
}
interface Props {
  /** Optional section header rendered at the top of the left (sliders) column,
   *  so the dark result card top-aligns with the heading on the same line. */
  eyebrow?: string;
  heading?: string;
  intro?: string;
  /** Optional localized labels; default to English. */
  labels?: Labels;
}

export default function EmiCalculator({ eyebrow, heading, intro, labels = {} }: Props = {}) {
  const L = {
    loanAmount: labels.loanAmount ?? "Loan Amount (₹)",
    tenure: labels.tenure ?? "Tenure (Years)",
    interestRate: labels.interestRate ?? "Interest Rate (% p.a.)",
    estimatedMonthly: labels.estimatedMonthly ?? "Estimated Monthly Payment",
    disclaimer: labels.disclaimer ?? "This estimate is calculated using the values selected. Final loan eligibility, interest rates and repayment terms may vary by bank or lender.",
    totalInterest: labels.totalInterest ?? "Total Interest",
    totalPayable: labels.totalPayable ?? "Total Payable",
    requestGuidance: labels.requestGuidance ?? "Request Payment Guidance",
  };
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
      {/* Heading (optional) + sliders */}
      <div>
        {(eyebrow || heading || intro) && (
          <div class="mb-10">
            {eyebrow && <p class="eyebrow">{eyebrow}</p>}
            {heading && <h2 class="mt-4 font-display text-4xl text-brown-dark lg:text-[52px]">{heading}</h2>}
            {intro && <p class="mt-5 text-[17px] leading-relaxed text-ink-soft">{intro}</p>}
          </div>
        )}
        <Slider label={L.loanAmount} value={inr(amount)} min={500_000} max={30_000_000} step={100_000} raw={amount} onInput={setAmount} />
        <Slider label={L.tenure} value={String(years)} min={1} max={30} step={1} raw={years} onInput={setYears} />
        <Slider label={L.interestRate} value={rate.toFixed(1)} min={5} max={15} step={0.1} raw={rate} onInput={setRate} />
      </div>

      {/* Result */}
      <div class="flex flex-col justify-center bg-brown-dark p-9 text-offwhite">
        <p class="text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-offwhite/60">
          {L.estimatedMonthly}
        </p>
        <p class="mt-3 text-center font-display text-5xl">₹{inr(emi)}</p>
        <p class="mx-auto mt-3 max-w-sm text-center text-[13px] text-offwhite/55">{L.disclaimer}</p>
        <div class="mt-8 grid grid-cols-2 gap-6 border-t border-offwhite/15 pt-6">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-offwhite/60">{L.totalInterest}</p>
            <p class="mt-1 font-display text-xl">{inrCompact(totalInterest)}</p>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-offwhite/60">{L.totalPayable}</p>
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
          {L.requestGuidance}
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
