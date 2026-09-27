import { ArrowUp } from "lucide-react";
import { profile, socials } from "@/data";
import { Container } from "@/components/ui/Section";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-fg-subtle">
          © {new Date().getFullYear()} {profile.name}. Designed & built by me.
        </p>
        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.platform}
              href={s.href}
              aria-label={s.label}
              {...(s.platform !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="grid size-10 place-items-center rounded-full text-fg-subtle transition-colors hover:bg-white/[0.06] hover:text-fg"
            >
              <SocialIcon platform={s.platform} className="size-4" />
            </a>
          ))}
          <a
            href="#top"
            className="ml-2 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-4 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            Back to top
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
