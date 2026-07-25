import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SalonConcierge } from "@/components/salon-concierge";
import { I18nProvider, useI18n } from "@/i18n/salon-i18n";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("common.loading")}</h2>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          {t("booking.return")}
        </Link>
      </div>
    </div>
  );
}
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn’t load</h1>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ELAN Nail & Spa — Where Beauty Becomes an Experience" },
      {
        name: "description",
        content: "Luxury manicure, pedicure, laser and spa rituals in Amman.",
      },
      { name: "author", content: "ELAN Nail & Spa" },
      { property: "og:title", content: "ELAN Nail & Spa" },
      {
        property: "og:description",
        content: "Cinematic luxury nail, pedicure, laser and spa destination.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SmoothScroll>
          <SiteChrome />
          <SalonConcierge />
        </SmoothScroll>
      </I18nProvider>
    </QueryClientProvider>
  );
}
function SiteChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useI18n();
  const pathname = useRouterState({
    select: (s: { location: { pathname: string } }) => s.location.pathname,
  });
  const isHome = pathname === "/";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!mobileOpen) return;

    mobileMenuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);
  const nav = [
    { to: "/services", label: t("nav.services") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/spa", label: t("nav.spa") },
    { to: "/specialists", label: t("nav.specialists") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;
  const headerMode = isHome ? (scrolled ? "journey-scrolled" : "journey") : "page";
  return (
    <>
      <header className={`site-header site-header--${headerMode}`}>
        <div className="site-header__frame">
          <Link to="/" className="salon-brand" aria-label="ELAN Nail & Spa">
            <img
              className="salon-brand__mark"
              src="/brand/elan-monogram.svg"
              alt=""
              aria-hidden="true"
            />
            <span className="salon-brand__wordmark">ELAN</span>
            <span className="salon-brand__descriptor">Nail · Spa</span>
          </Link>
          <nav className="site-header__links" aria-label={t("nav.primary")}>
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="site-header__link">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="site-header__actions">
            <div className="language-switch site-header__language" aria-label={t("nav.language")}>
              <button onClick={() => setLanguage("en")} aria-pressed={language === "en"}>
                EN
              </button>
              <span>·</span>
              <button onClick={() => setLanguage("ar")} aria-pressed={language === "ar"}>
                ع
              </button>
            </div>
            <Link to="/book" className="site-header__book">
              {t("nav.book")}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="site-header__menu-toggle"
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.menu")}
              aria-controls="site-mobile-menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div
            id="site-mobile-menu"
            ref={mobileMenuRef}
            className="site-header__mobile-menu"
            role="dialog"
            aria-modal="true"
          >
            <nav aria-label={t("nav.primary")}>
              {nav.map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="site-header__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              to="/book"
              className="site-header__mobile-book"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.book")}
            </Link>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      {!isHome && <SiteFooter />}
      <Link
        to="/book"
        className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-primary px-8 py-3 text-[11px] uppercase tracking-[0.28em] text-primary-foreground shadow-2xl shadow-primary/30 lg:hidden"
      >
        {t("nav.reserve")}
      </Link>
    </>
  );
}
function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-espresso text-ivory">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="font-serif text-4xl tracking-[0.2em]">ELAN</div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/70">{t("footer.copy")}</p>
          <p className="eyebrow mt-8 text-ivory/50">{t("footer.phone")}</p>
          <p className="mt-2 font-serif text-2xl">+962 7 9000 0000</p>
        </div>
        <div>
          <p className="eyebrow text-ivory/50">{t("footer.visit")}</p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/80">
            ELAN Nail & Spa
            <br />
            {t("footer.address")}
          </p>
        </div>
        <div>
          <p className="eyebrow text-ivory/50">{t("footer.follow")}</p>
          <ul className="mt-3 space-y-2 text-sm text-ivory/80">
            <li>Instagram</li>
            <li>TikTok</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs uppercase tracking-[0.25em] text-ivory/40">
        © {new Date().getFullYear()} {t("footer.rights")}
      </div>
    </footer>
  );
}
