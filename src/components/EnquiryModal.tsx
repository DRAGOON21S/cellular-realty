import { useEffect, useRef, useState } from "preact/hooks";

interface Props {
  projectOptions: string[];
}

type Status = "idle" | "sending" | "done" | "error";

export default function EnquiryModal({ projectOptions }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [project, setProject] = useState("");
  const downloadRef = useRef<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Wire up every [data-enquire] trigger + [data-newsletter] form on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-enquire]");
      if (!trigger) return;
      e.preventDefault();
      downloadRef.current = trigger.dataset.download || null;
      setProject(trigger.dataset.project || "");
      setStatus("idle");
      setErrorMsg("");
      setOpen(true);
    };
    document.addEventListener("click", onClick);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);

    // Newsletter forms submit inline (no modal).
    const newsletters = Array.from(document.querySelectorAll<HTMLFormElement>("[data-newsletter]"));
    const onNews = async (e: Event) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const email = (new FormData(form).get("email") as string) || "";
      const btn = form.querySelector("button");
      if (btn) btn.textContent = "Subscribing…";
      const res = await postLead({ type: "newsletter", email, source: "newsletter" });
      if (btn) btn.textContent = res.ok ? "Subscribed ✓" : "Try again";
      if (res.ok) form.reset();
    };
    newsletters.forEach((f) => f.addEventListener("submit", onNews));

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      newsletters.forEach((f) => f.removeEventListener("submit", onNews));
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isDownload = Boolean(downloadRef.current);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    const res = await postLead({
      type: isDownload ? "download" : "enquiry",
      name: data.name,
      phone: data.phone,
      email: data.email,
      project: data.project,
      message: data.message,
      company: data.company, // honeypot
      source: isDownload ? `download:${downloadRef.current}` : "enquiry",
    });
    if (res.ok) {
      setStatus("done");
      if (downloadRef.current) {
        const a = document.createElement("a");
        a.href = downloadRef.current;
        a.download = "";
        a.target = "_blank";
        a.click();
      }
    } else {
      setErrorMsg(res.error || "Something went wrong.");
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div
      class="fixed inset-0 z-[100] flex items-end justify-center bg-brown-900/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry form"
        class="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-offwhite p-8 shadow-2xl sm:rounded-[4px] sm:p-10"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          class="absolute right-5 top-5 text-brown-light hover:text-brown-dark"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {status === "done" ? (
          <div class="py-8 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brown-lightest/30 text-brown-dark">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 class="mt-6 font-display text-3xl text-brown-dark">Thank you</h3>
            <p class="mt-3 text-ink-soft">
              {isDownload
                ? "Your download is starting. Our team will also reach out shortly."
                : "We've received your details. A specialist will contact you shortly."}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              class="mt-8 rounded-[2px] bg-brown-dark px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-offwhite hover:bg-brown-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p class="text-[12px] font-bold uppercase tracking-[0.14em] text-brown-light">
              {isDownload ? "Download Brochure" : "Universal Enquiry"}
            </p>
            <h3 class="mt-2 font-display text-3xl text-brown-dark">
              {isDownload ? "Enter your details to receive the file" : "Let's find your next address"}
            </h3>
            <p class="mt-2 text-[15px] text-ink-soft">
              Please provide your details and a specialist will contact you shortly.
            </p>

            <form class="mt-7 grid gap-5" onSubmit={handleSubmit}>
              <input type="text" name="company" tabIndex={-1} autocomplete="off" class="hidden" aria-hidden="true" />
              <div class="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="e.g. Vikram Singh" required />
                <Field label="Phone Number" name="phone" type="tel" placeholder="+91 00000 00000" required />
              </div>
              <Field label="Email Address" name="email" type="email" placeholder="vikram@example.com" required />
              <label class="block">
                <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-light">Interested In</span>
                <select
                  name="project"
                  value={project}
                  onChange={(e) => setProject((e.target as HTMLSelectElement).value)}
                  class="mt-2 w-full border-b border-brown-light/40 bg-transparent py-2.5 text-[16px] text-brown-dark outline-none focus:border-brown-lightest"
                >
                  <option value="">Select a project</option>
                  {projectOptions.map((o) => (
                    <option value={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label class="block">
                <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-light">Message (optional)</span>
                <textarea
                  name="message"
                  rows={3}
                  class="mt-2 w-full border-b border-brown-light/40 bg-transparent py-2.5 text-[16px] text-brown-dark outline-none focus:border-brown-lightest"
                />
              </label>

              {status === "error" && <p class="text-sm text-red-700">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                class="mt-2 inline-flex items-center justify-center gap-2 rounded-[2px] bg-brown-lightest px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-brown-dark transition-colors hover:bg-brown-300 disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Request Call Back"}
              </button>
              <p class="text-center text-[12px] text-brown-light">
                Or call us directly · +91 99585 49955
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label class="block">
      <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-light">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        class="mt-2 w-full border-b border-brown-light/40 bg-transparent py-2.5 text-[16px] text-brown-dark outline-none placeholder:text-brown-light/50 focus:border-brown-lightest"
      />
    </label>
  );
}

async function postLead(body: Record<string, string>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
