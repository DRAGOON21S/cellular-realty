import type { APIRoute } from "astro";
import { z } from "zod";

export const prerender = false; // on-demand endpoint

const LeadSchema = z.object({
  type: z.enum(["enquiry", "download", "newsletter"]).default("enquiry"),
  name: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  email: z.string().trim().email().max(160),
  project: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.string().trim().max(200).optional().default(""),
  // honeypot — real users leave this empty
  company: z.string().max(0).optional().default(""),
});

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    const ct = request.headers.get("content-type") || "";
    payload = ct.includes("application/json")
      ? await request.json()
      : Object.fromEntries(await request.formData());
  } catch {
    return json({ ok: false, error: "Invalid request body" }, 400);
  }

  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: "Please check the form and try again." }, 422);
  }
  const lead = parsed.data;
  if (lead.company) return json({ ok: true }); // honeypot tripped, pretend success

  // Non-newsletter leads should carry a name + phone.
  if (lead.type !== "newsletter" && (!lead.name || !lead.phone)) {
    return json({ ok: false, error: "Name and phone are required." }, 422);
  }

  const record = { ...lead, receivedAt: new Date().toISOString() };
  delete (record as Record<string, unknown>).company;

  try {
    await deliverLead(record);
  } catch (err) {
    console.error("[lead] delivery failed", err);
    return json({ ok: false, error: "Something went wrong. Please call us instead." }, 502);
  }

  return json({ ok: true });
};

// ---------------------------------------------------------------------------
// Lead delivery. Interim: log to server. Swap the body for a Supabase insert
// (or email via Resend/SES) without touching the UI — the contract is stable.
// e.g.  await supabase.from("leads").insert(record)
// ---------------------------------------------------------------------------
async function deliverLead(record: Record<string, unknown>): Promise<void> {
  console.log("[lead]", JSON.stringify(record));
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
