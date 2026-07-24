import { createFileRoute, Link } from "@tanstack/react-router";

import { useSalonData } from "@/lib/salon-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ÉLAN Nail & Spa" },
      {
        name: "description",
        content:
          "Explore ÉLAN's live manicure, pedicure, laser and spa menu with prices and durations.",
      },
      { property: "og:title", content: "Services — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Explore the ÉLAN ritual menu." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { categories, services } = useSalonData();
  return (
    <div className="min-h-screen bg-ivory pt-32 pb-24 text-espresso md:pt-40">
      <header className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="eyebrow">The live menu</span>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[.92] md:text-8xl">
          Rituals made <em className="text-primary">personal.</em>
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Our menu is edited in real time by the house. Choose an experience and let the rest unfold
          around you.
        </p>
      </header>
      <main className="mx-auto mt-20 max-w-[1400px] px-6 md:px-10">
        {categories.map((category) => {
          const offerings = services.filter(
            (service) => service.categoryId === category.id && service.enabled,
          );
          if (!offerings.length) return null;
          return (
            <section
              key={category.id}
              className="grid gap-8 border-t border-espresso/15 py-10 lg:grid-cols-[.7fr_1.3fr]"
            >
              <div>
                <span className="eyebrow">{category.shortName}</span>
                <h2 className="mt-3 font-serif text-4xl">{category.name}</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <ul>
                {offerings.map((service) => (
                  <li key={service.id} className="border-b border-espresso/10 last:border-0">
                    <Link
                      to="/book"
                      search={{ service: service.id }}
                      className="group grid grid-cols-[1fr_auto] gap-4 py-5"
                    >
                      <span>
                        <b className="font-serif text-2xl font-normal transition-colors group-hover:text-primary">
                          {service.name}
                        </b>
                        <small className="mt-1 block max-w-xl text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </small>
                      </span>
                      <span className="text-right">
                        <small className="block text-[10px] uppercase tracking-[.2em] text-muted-foreground">
                          {service.duration} min
                        </small>
                        <b className="mt-2 block font-serif text-xl font-normal text-primary">
                          AED {service.price}
                        </b>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}
