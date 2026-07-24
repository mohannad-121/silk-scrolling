import { Link } from "@tanstack/react-router";

export function StubPage({ title, tagline, body }: { title: string; tagline: string; body: string }) {
  return (
    <div className="min-h-screen bg-ivory pt-40 pb-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="eyebrow">{tagline}</span>
        <h1 className="mt-4 font-serif text-6xl leading-[1.02] md:text-7xl">
          {title}
        </h1>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground">{body}</p>
        <Link to="/" className="mt-12 inline-block text-[11px] uppercase tracking-[0.32em] text-primary">
          ← Return to the story
        </Link>
      </div>
    </div>
  );
}