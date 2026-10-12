"use client";

import { createContext, useContext, useRef, useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/data/site";

const ContactContext = createContext<() => void>(() => {});

type Status = "idle" | "sending" | "sent" | "error";

export function ContactProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const open = () => {
    setStatus((s) => (s === "sent" ? "idle" : s));
    setError("");
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      // No mail provider configured yet: hand the message to the visitor's mail app instead.
      if (res.status === 501 && site.contactEmail) {
        window.location.href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
          `${site.name} enquiry`
        )}&body=${encodeURIComponent(data.message)}`;
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
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="From: (enter your email address)…"
                aria-label="Your email address"
              />
              <textarea
                name="message"
                required
                maxLength={5000}
                placeholder="Write your message…"
                aria-label="Your message"
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
    <button type="button" className="link" onClick={open}>
      {children}
    </button>
  );
}
