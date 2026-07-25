import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/salon-i18n";
import { useSalonData } from "@/lib/salon-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ELAN Nail & Spa" },
      {
        name: "description",
        content: "Explore ELAN’s live manicure, pedicure, laser and spa menu in Jordanian dinars.",
      },
    ],
  }),
  component: ServicesPage,
});
function ServicesPage() {
  const { categories, services } = useSalonData();
  const { t, text, formatCurrency } = useI18n();
  return (
    <div className="min-h-screen bg-ivory pb-24 pt-32 text-espresso md:pt-40">
      <header className="mx-auto max-w-[1400px] px-6 md:px-10">
        <span className="eyebrow">{t("services.eyebrow")}</span>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[.92] md:text-8xl">
          {t("services.title")}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("services.copy")}
        </p>
      </header>
      <main className="mx-auto mt-20 max-w-[1400px] px-6 md:px-10">
        {categories.map((category) => {
          const offerings = services.filter(
            (item) => item.categoryId === category.id && item.enabled,
          );
          if (!offerings.length) return null;
          return (
            <section
              key={category.id}
              className="grid gap-8 border-t border-espresso/15 py-10 lg:grid-cols-[.7fr_1.3fr]"
            >
              <div>
                <span className="eyebrow">{text(category, "shortName")}</span>
                <h2 className="mt-3 font-serif text-4xl">{text(category, "name")}</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {text(category, "description")}
                </p>
              </div>
              <ul>
                {offerings.map((item) => (
                  <li key={item.id} className="border-b border-espresso/10 last:border-0">
                    <Link
                      to="/book"
                      search={{ service: item.id }}
                      className="group grid grid-cols-[1fr_auto] gap-4 py-5"
                    >
                      <span>
                        <b className="font-serif text-2xl font-normal transition-colors group-hover:text-primary">
                          {text(item, "name")}
                        </b>
                        <small className="mt-1 block max-w-xl text-sm leading-relaxed text-muted-foreground">
                          {text(item, "description")}
                        </small>
                      </span>
                      <span className="text-end">
                        <small className="block text-[10px] uppercase tracking-[.2em] text-muted-foreground">
                          {item.duration} {t("common.minutes")}
                        </small>
                        <b className="mt-2 block font-serif text-xl font-normal text-primary">
                          {formatCurrency(item.price)}
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
