"use client";

import { createContext, useContext, useRef, useState, type FormEvent, type ReactNode } from "react";
import { bookingEnquiry, site } from "@/data/site";

type Prefill = { subject: string; message: string };
type Status = "idle" | "sending" | "sent" | "error";

const ContactContext = createContext<(prefill?: Prefill) => void>(() => {});

export function ContactProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  // the last booking template dropped in, so an untouched one can be cleared again
  const template = useRef<Prefill | null>(null);

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const open = (prefill?: Prefill) => {
    if (prefill) {
      setSubject(prefill.subject);
      setMessage(prefill.message);
    } else if (template.current && message === template.current.message) {
      // plain "contact" after an unedited booking template: start clean
      setSubject("");
      setMessage("");
    }
    template.current = prefill ?? null;
    setStatus((s) => (s === "sent" ? "idle" : s));
    setError("");
    dialog.current?.showModal();
    requestAnimationFrame(() => emailField.current?.focus());
  };
  const close = () => dialog.current?.close();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, subject, message, website }),
      });
      if (res.ok) {
        setSubject("");
        setMessage("");
        template.current = null;
        setStatus("sent");
        return;
      }
      // No mail provider configured yet: hand the message to the visitor's mail app instead.
      if (res.status === 501 && site.contactEmail) {
        window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
          subject || `${site.name} enquiry`
        )}&body=${encodeURIComponent(message)}`;
        setStatus("idle");
        return;
      }
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Couldn't reach the server. Please try again.");
    }
    setStatus("error");
  }

  return (
    <ContactContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="contact"
        aria-labelledby="contact-title"
        onClick={(e) => e.target === dialog.current && close()}
      >
        <form onSubmit={submit}>
          <header>
            <h2 id="contact-title">Contact</h2>
            <button type="button" className="contact-close" onClick={close} aria-label="Close">
              ×
            </button>
          </header>

          {status === "sent" ? (
            <p className="contact-note" role="status">
              ⋆₊ ⊹ Message sent — we&rsquo;ll be in touch.
            </p>
          ) : (
            <>
              <input
                ref={emailField}
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="From: (enter your email address)…"
                aria-label="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                name="subject"
                maxLength={200}
                placeholder="Subject…"
                aria-label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <textarea
                name="message"
                required
                maxLength={5000}
                placeholder="Write your message…"
                aria-label="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {/* honeypot: real visitors never see or fill this */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="contact-hp" aria-hidden="true" />
              {error && (
                <p className="contact-error" role="alert">
                  {error}
                </p>
              )}
            </>
          )}

          <footer>
            <button type="button" onClick={close}>
              {status === "sent" ? "Close" : "Cancel"}
            </button>
            {status !== "sent" && (
              <button type="submit" className="primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send"}
              </button>
            )}
          </footer>
        </form>
      </dialog>
    </ContactContext.Provider>
  );
}

export function ContactButton({ children = "contact" }: { children?: ReactNode }) {
  const open = useContext(ContactContext);
  return (
    <button type="button" className="link" onClick={() => open()}>
      {children}
    </button>
  );
}

/** Opens the contact pop-up with a booking enquiry for this artist already written out. */
export function BookButton({ artist }: { artist: string }) {
  const open = useContext(ContactContext);
  return (
    <button type="button" className="book" onClick={() => open(bookingEnquiry(artist))}>
      Book {artist}
    </button>
  );
}
