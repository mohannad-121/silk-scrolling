import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/salon-i18n";

export function StubPage({
  page,
}: {
  page: "about" | "contact" | "gallery" | "spa" | "specialists";
}) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-ivory pb-32 pt-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="eyebrow">{t(`stub.${page}.tag`)}</span>
        <h1 className="mt-4 font-serif text-6xl leading-[1.02] md:text-7xl">
          {t(`stub.${page}.title`)}
        </h1>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground">
          {t(`stub.${page}.body`)}
        </p>
        <Link
          to="/"
          className="mt-12 inline-block text-[11px] uppercase tracking-[0.28em] text-primary"
        >
          ← {t("booking.return")}
        </Link>
      </div>
    </div>
  );
}
