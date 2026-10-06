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
    <div className="min-h-screen bg-ivory pt-[max(7rem,calc(env(safe-area-inset-top,0px)+5.5rem))] pb-24 text-espresso md:pt-40">
      <header className="mx-auto max-w-[1400px] px-5 sm:px-6 md:px-10">
        <span className="eyebrow">The live menu</span>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl sm:text-5xl md:text-8xl leading-[.95] sm:leading-[.92]">
          Rituals made <em className="text-primary">personal.</em>
        </h1>
        <p className="mt-4 sm:mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Our menu is edited in real time by the house. Choose an experience and let the rest unfold
          around you.
        </p>
      </header>
      <main className="mx-auto mt-12 sm:mt-20 max-w-[1400px] px-5 sm:px-6 md:px-10">
        {categories.map((category) => {
          const offerings = services.filter(
            (service) => service.categoryId === category.id && service.enabled,
          );
          if (!offerings.length) return null;
          return (
            <section
              key={category.id}
              className="grid gap-6 sm:gap-8 border-t border-espresso/15 py-8 sm:py-10 lg:grid-cols-[.7fr_1.3fr]"
            >
              <div>
                <span className="eyebrow">{category.shortName}</span>
                <h2 className="mt-2 sm:mt-3 font-serif text-3xl sm:text-4xl">{category.name}</h2>
                <p className="mt-2 sm:mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>
              <ul>
                {offerings.map((service) => (
                  <li key={service.id} className="border-b border-espresso/10 last:border-0">
                    <Link
                      to="/book"
                      search={{ service: service.id }}
                      className="group grid grid-cols-[1fr_auto] gap-3 sm:gap-4 py-4 sm:py-5 min-h-[54px] items-center transition-colors active:bg-espresso/5 rounded-sm px-1 -mx-1"
                    >
                      <span>
                        <b className="font-serif text-xl sm:text-2xl font-normal transition-colors group-hover:text-primary">
                          {service.name}
                        </b>
                        <small className="mt-1 block max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {service.description}
                        </small>
                      </span>
                      <span className="text-right shrink-0">
                        <small className="block text-[10px] uppercase tracking-[.2em] text-muted-foreground">
                          {service.duration} min
                        </small>
                        <b className="mt-1 sm:mt-2 block font-serif text-lg sm:text-xl font-normal text-primary">
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
