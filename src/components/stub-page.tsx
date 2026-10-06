import { Link } from "@tanstack/react-router";

export function StubPage({
  title,
  tagline,
  body,
}: {
  title: string;
  tagline: string;
  body: string;
}) {
  return (
    <div className="min-h-screen bg-ivory pt-[max(7rem,calc(env(safe-area-inset-top,0px)+5rem))] pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <span className="eyebrow">{tagline}</span>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.02]">{title}</h1>
        <p className="mt-6 sm:mt-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {body}
        </p>
        <Link
          to="/"
          className="mt-8 sm:mt-12 inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-primary transition-opacity hover:opacity-80 active:opacity-60"
        >
          ← Return to the story
        </Link>
      </div>
    </div>
  );
}
