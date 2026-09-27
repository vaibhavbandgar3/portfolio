import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80svh] place-items-center px-5 pt-24 text-center">
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
      <div className="relative">
        <p className="font-mono text-sm tracking-[0.3em] text-accent-2">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This page doesn&apos;t exist.</h1>
        <p className="mt-4 text-fg-muted">The link may be broken, or the page may have moved.</p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-ink-950 hover:bg-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </div>
    </section>
  );
}
