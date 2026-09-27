"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { FileText, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navItems, profile, socials } from "@/data";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SocialIcon } from "@/components/ui/SocialIcon";

/** Tracks which section is currently in the middle band of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const ids = navItems.map((n) => n.id);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(ids);
  const { scrollY, scrollYProgress } = useScroll();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Lock scroll and support Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 transition-all duration-500 ease-out-expo sm:px-4",
            scrolled || open ? "glass shadow-[0_10px_40px_-15px_rgb(0_0_0/0.8)]" : "border border-transparent",
          )}
        >
          <a
            href="#top"
            className="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1.5 font-medium tracking-tight"
            onClick={() => setOpen(false)}
          >
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 font-mono text-xs font-semibold text-ink-950"
            >
              {profile.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </span>
            <span>{profile.shortName}</span>
            <span className="sr-only">— back to top</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors duration-300",
                    active === item.id ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-white sm:inline-flex"
            >
              <FileText className="size-4" aria-hidden="true" />
              Resume
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-white/[0.07] lg:hidden"
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-0 -z-10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-between px-6 pt-28 pb-10">
              <ul className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease, delay: 0.04 * i }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center justify-between border-b border-line py-3 text-2xl font-medium tracking-tight"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-4">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-fg px-5 text-sm font-medium text-ink-950"
                >
                  <FileText className="size-4" aria-hidden="true" />
                  Resume
                </a>
                {socials
                  .filter((s) => s.platform !== "email")
                  .map((s) => (
                    <a
                      key={s.platform}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="glass grid size-12 place-items-center rounded-full"
                    >
                      <SocialIcon platform={s.platform} />
                    </a>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
