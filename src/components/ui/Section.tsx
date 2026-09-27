import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

interface SectionProps {
  id: string;
  /** Two-digit index shown in the eyebrow, e.g. "02". */
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Standard page section: anchored, labelled, with a consistent heading block. */
export function Section({ id, index, eyebrow, title, description, className, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn("relative py-24 sm:py-32", className)}>
      <Container>
        <Reveal className="mb-12 max-w-2xl sm:mb-16">
          <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-accent-2 uppercase">
            <span className="text-fg-subtle">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-accent-2 to-transparent" />
            {eyebrow}
          </p>
          <h2 id={headingId} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description && <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>}
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
