"use client";

import { ArrowUpRight, Check, Copy, FileText, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { profile, sectionIndex, socials } from "@/data";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { DataSurface } from "@/components/three/DataSurface";

/**
 * Optional form backend. Set NEXT_PUBLIC_CONTACT_ENDPOINT to any endpoint that
 * accepts a JSON POST of { name, email, message } (e.g. a Formspree form URL).
 * Without it, submitting opens the visitor's mail app with the message filled in.
 */
const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const inputClasses =
  "w-full rounded-xl border border-line bg-ink-950/60 px-4 py-3 text-fg placeholder:text-fg-subtle transition-colors duration-200 hover:border-line-strong focus:border-accent/70 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-accent/30";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      }}
      className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
      aria-label={copied ? "Email address copied" : "Copy email address"}
    >
      {copied ? (
        <Check className="size-4 text-emerald-400" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const links = socials.filter((s) => s.platform !== "email");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    if (!endpoint) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus({ kind: "sent" });
    } catch {
      setStatus({ kind: "error", message: `Something went wrong. Please email me directly at ${profile.email}.` });
    }
  }

  return (
    <Section
      id="contact"
      index={sectionIndex("contact")}
      className="overflow-hidden"
      backdrop={<DataSurface />}
      eyebrow="Contact"
      title={
        <>
          Let&apos;s build something <span className="text-gradient">worth using.</span>
        </>
      }
      description="I'm looking for entry-level roles and internships in software, data and AI. If you think I'd be a good fit — or just want to talk shop — my inbox is open."
    >
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-4 lg:col-span-5">
          <div className="rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-5">
            <p className="font-mono text-[11px] tracking-widest text-fg-subtle uppercase">Email</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <a href={`mailto:${profile.email}`} className="truncate text-lg font-medium text-fg hover:text-accent-2">
                {profile.email}
              </a>
              <CopyEmail />
            </div>
          </div>

          {links.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-ink-850"
            >
              <span className="grid size-10 place-items-center rounded-full border border-line bg-white/[0.03] text-fg">
                <SocialIcon platform={s.platform} className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block font-medium text-fg">{s.label}</span>
                {s.handle && <span className="block text-sm text-fg-muted">{s.handle}</span>}
              </span>
              <ArrowUpRight
                className="size-4 text-fg-subtle transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                aria-hidden="true"
              />
            </a>
          ))}

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group ring-gradient flex items-center gap-4 rounded-[var(--radius-card)] bg-ink-850 p-5"
          >
            <span className="grid size-10 place-items-center rounded-full bg-fg text-ink-950">
              <FileText className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-medium text-fg">Resume</span>
              <span className="block text-sm text-fg-muted">Download PDF</span>
            </span>
            <ArrowUpRight className="size-4 text-fg-subtle group-hover:text-fg" aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="relative h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink-900/70 p-6 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-20 -bottom-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(79_140_255/0.14),transparent)]"
            />
            <h3 className="relative text-lg font-semibold">Send a message</h3>
            <p className="relative mt-1 text-sm text-fg-muted">Messages go straight to my inbox.</p>

            <div className="relative mt-6 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="text-fg-muted">Name</span>
                <input name="name" required autoComplete="name" className={inputClasses} placeholder="Your name" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-fg-muted">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputClasses}
                  placeholder="you@company.com"
                />
              </label>
              <label className="grid gap-1.5 text-sm sm:col-span-2">
                <span className="text-fg-muted">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className={cn(inputClasses, "resize-y")}
                  placeholder="What would you like to talk about?"
                />
              </label>
            </div>

            <div className="relative mt-6 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-ink-950 transition-colors hover:bg-white disabled:opacity-60"
                >
                  {status.kind === "sending" ? "Sending…" : endpoint ? "Send message" : "Compose email"}
                  <Send
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </Magnetic>
              <p role="status" aria-live="polite" className="text-sm">
                {status.kind === "sent" && (
                  <span className="text-emerald-400">Thanks — your message is on its way.</span>
                )}
                {status.kind === "error" && <span className="text-rose-400">{status.message}</span>}
                {status.kind === "idle" && !endpoint && (
                  <span className="text-fg-subtle">Opens your email app with the message ready.</span>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
