import { useEffect, useRef, useState } from "preact/hooks";
import { popupConfig } from "../data/popup-config";

export interface EnquiryLabels {
  universalEyebrow: string;
  downloadEyebrow: string;
  masterplanEyebrow: string;
  title: string;
  downloadTitle: string;
  masterplanTitle: string;
  subtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  phone: string;
  email: string;
  interestedIn: string;
  selectProject: string;
  message: string;
  requestCallBack: string;
  sending: string;
  orCall: string;
  thankYou: string;
  downloadStarting: string;
  received: string;
  close: string;
  genericError: string;
  networkError: string;
  subscribing: string;
  subscribed: string;
  tryAgain: string;
}

interface Props {
  projectOptions: string[];
  labels: EnquiryLabels;
}

type Status = "idle" | "sending" | "done" | "error";

export default function EnquiryModal({ projectOptions, labels: L }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [project, setProject] = useState("");
  const downloadRef = useRef<string | null>(null);
  const ctaRef = useRef<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);

  // Wire up every [data-enquire] trigger + [data-newsletter] form on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>("[data-enquire]");
      if (!trigger) return;
      e.preventDefault();
      downloadRef.current = trigger.dataset.download || null;
      ctaRef.current = trigger.dataset.cta || "";
      setProject(trigger.dataset.project || "");
      setStatus("idle");
      setErrorMsg("");
      setOpen(true);
    };
    document.addEventListener("click", onClick);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);

    const newsletters = Array.from(document.querySelectorAll<HTMLFormElement>("[data-newsletter]"));
    const onNews = async (e: Event) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const email = (new FormData(form).get("email") as string) || "";
      const btn = form.querySelector("button");
      if (btn) btn.textContent = L.subscribing;
      const res = await postLead({ type: "newsletter", email, source: "newsletter" });
      if (btn) btn.textContent = res.ok ? L.subscribed : L.tryAgain;
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

  // Automatic lead-form pop-up (spec §2.3): once per session, after a delay or near page-end.
  useEffect(() => {
    if (!popupConfig.enabled) return;
    if (sessionStorage.getItem("cr_popup_shown") || localStorage.getItem("cr_lead_submitted")) return;

    let fired = false;
    const openPopup = () => {
      if (fired) return;
      if (sessionStorage.getItem("cr_popup_shown") || localStorage.getItem("cr_lead_submitted")) return;
      if (document.body.style.overflow === "hidden") return;
      fired = true;
      sessionStorage.setItem("cr_popup_shown", "1");
      downloadRef.current = null;
      ctaRef.current = "Auto Popup";
      setProject("");
      setStatus("idle");
      setErrorMsg("");
      setOpen(true);
    };

    const timer = window.setTimeout(openPopup, popupConfig.delayMs);
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (scrolled >= popupConfig.scrollThreshold) openPopup();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isDownload = Boolean(downloadRef.current);
  const isMasterplan = ctaRef.current === "Masterplan Unlock";

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
      try { localStorage.setItem("cr_lead_submitted", "1"); } catch {}
      if (ctaRef.current === "Masterplan Unlock") {
        const proj = data.project || project;
        try { localStorage.setItem("cr_mp_unlock:" + proj, "1"); } catch {}
        document.dispatchEvent(new CustomEvent("cr:masterplan-unlocked", { detail: { project: proj } }));
      } else if (downloadRef.current) {
        const a = document.createElement("a");
        a.href = downloadRef.current;
        a.download = "";
        a.target = "_blank";
        a.click();
      }
    } else {
      setErrorMsg(res.error === "network" ? L.networkError : L.genericError);
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
        aria-label={L.title}
        class="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-offwhite p-8 shadow-2xl sm:rounded-[4px] sm:p-10"
      >
        <button type="button" onClick={() => setOpen(false)} aria-label={L.close} class="absolute right-5 top-5 text-brown-light hover:text-brown-dark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {status === "done" ? (
          <div class="py-8 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brown-lightest/30 text-brown-dark">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 class="mt-6 font-display text-3xl text-brown-dark">{L.thankYou}</h3>
            <p class="mt-3 text-ink-soft">{isDownload ? L.downloadStarting : L.received}</p>
            <button type="button" onClick={() => setOpen(false)} class="mt-8 rounded-[2px] bg-brown-dark px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-offwhite hover:bg-brown-700">
              {L.close}
            </button>
          </div>
        ) : (
          <>
            <p class="text-[12px] font-bold uppercase tracking-[0.14em] text-brown-light">
              {isMasterplan ? L.masterplanEyebrow : isDownload ? L.downloadEyebrow : L.universalEyebrow}
            </p>
            <h3 class="mt-2 font-display text-3xl text-brown-dark">
              {isMasterplan ? L.masterplanTitle : isDownload ? L.downloadTitle : L.title}
            </h3>
            <p class="mt-2 text-[15px] text-ink-soft">{L.subtitle}</p>

            <form class="mt-7 grid gap-5" onSubmit={handleSubmit}>
              <input type="text" name="company" tabIndex={-1} autocomplete="off" class="hidden" aria-hidden="true" />
              <div class="grid gap-5 sm:grid-cols-2">
                <Field label={L.fullName} name="name" placeholder={L.fullNamePlaceholder} required />
                <Field label={L.phone} name="phone" type="tel" placeholder="+91 00000 00000" required />
              </div>
              <Field label={L.email} name="email" type="email" placeholder="vikram@example.com" required />
              <label class="block">
                <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-light">{L.interestedIn}</span>
                <select
                  name="project"
                  value={project}
                  onChange={(e) => setProject((e.target as HTMLSelectElement).value)}
                  class="mt-2 w-full border-b border-brown-light/40 bg-transparent py-2.5 text-[16px] text-brown-dark outline-none focus:border-brown-lightest"
                >
                  <option value="">{L.selectProject}</option>
                  {projectOptions.map((o) => (
                    <option value={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label class="block">
                <span class="text-[12px] font-semibold uppercase tracking-[0.1em] text-brown-light">{L.message}</span>
                <textarea name="message" rows={3} class="mt-2 w-full border-b border-brown-light/40 bg-transparent py-2.5 text-[16px] text-brown-dark outline-none focus:border-brown-lightest" />
              </label>

              {status === "error" && <p class="text-sm text-red-700">{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === "sending"}
                class="mt-2 inline-flex items-center justify-center gap-2 rounded-[2px] bg-brown-lightest px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-brown-dark transition-colors hover:bg-brown-300 disabled:opacity-60"
              >
                {status === "sending" ? L.sending : L.requestCallBack}
              </button>
              <p class="text-center text-[12px] text-brown-light">{L.orCall}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
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
    return { ok: false, error: "network" };
  }
}
