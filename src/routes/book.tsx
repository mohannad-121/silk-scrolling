import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book — ÉLAN Nail & Spa" },
      { name: "description", content: "Reserve your manicure, pedicure, or spa ritual at ÉLAN. Booking wizard coming next." },
      { property: "og:title", content: "Book — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Reserve your ÉLAN experience." },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <div className="min-h-screen bg-ivory pt-40 pb-32">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <span className="eyebrow">Reserve</span>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
          Book your <em className="italic text-primary">ÉLAN moment.</em>
        </h1>
        <p className="mt-6 text-muted-foreground">
          The full multi-step booking wizard, live availability, and specialist
          selector are next in the build. For now, call{" "}
          <span className="font-serif text-primary">+971 4 000 0000</span> or
          message us on WhatsApp.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="tel:+97140000000" className="rounded-full bg-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-primary-foreground">
            Call the Salon
          </a>
          <Link to="/" className="rounded-full border border-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-primary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}