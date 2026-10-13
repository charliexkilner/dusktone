import { site } from "@/data/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Delivers the contact form by email through Resend (https://resend.com).
// Needs RESEND_API_KEY; CONTACT_TO / CONTACT_FROM override the defaults.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();
  const subject = String(body?.subject ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 200);

  // honeypot filled in: pretend it worked
  if (body?.website) return Response.json({ ok: true });

  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return Response.json({ error: "Please write a message (up to 5000 characters)." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || site.contactEmail;
  if (!key || !to) {
    return Response.json({ error: "The contact form isn't connected yet." }, { status: 501 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || `${site.name} <onboarding@resend.dev>`,
      to,
      reply_to: email,
      subject: subject || `${site.name} enquiry from ${email}`,
      text: `From: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: "Your message couldn't be sent. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
