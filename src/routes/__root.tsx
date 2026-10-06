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
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SalonConcierge } from "@/components/salon-concierge";
import { Menu, X, ChevronRight, Phone, MapPin } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ÉLAN Nail & Spa — Where Beauty Becomes an Experience" },
      {
        name: "description",
        content:
          "A luxury destination for manicure, pedicure, nail art, laser and spa. Book with our specialists at ÉLAN — an editorial beauty experience.",
      },
      { name: "author", content: "ÉLAN Nail & Spa" },
      { property: "og:title", content: "ÉLAN Nail & Spa — Where Beauty Becomes an Experience" },
      {
        property: "og:description",
        content:
          "Cinematic luxury nail, pedicure, laser and spa destination. Book your ÉLAN experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap",
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
    <html lang="en">
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
      <SmoothScroll>
        <SiteChrome />
        <SalonConcierge />
      </SmoothScroll>
    </QueryClientProvider>
  );
}

function SiteChrome() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = useRouterState({
    select: (s: { location: { pathname: string } }) => s.location.pathname,
  });
  const isHome = pathname === "/";
  const isBook = pathname === "/book";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile navigation drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nav = [
    { to: "/services", label: "Services" },
    { to: "/gallery", label: "Gallery" },
    { to: "/spa", label: "Spa" },
    { to: "/specialists", label: "Specialists" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ] as const;

  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top,0px)] ${
          solid || mobileMenuOpen
            ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-xs"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 sm:px-6 sm:py-4 md:px-10 md:py-5">
          <Link to="/" className="group flex items-baseline gap-2 py-1">
            <span
              className={`font-serif text-2xl tracking-[0.25em] transition-colors ${
                solid ? "text-foreground" : "text-white"
              }`}
            >
              ÉLAN
            </span>
            <span
              className={`hidden text-[10px] uppercase tracking-[0.4em] sm:inline ${
                solid ? "text-muted-foreground" : "text-white/70"
              }`}
            >
              Nail · Spa
            </span>
          </Link>

          {/* Desktop Navigation - preserved exactly */}
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-[11px] uppercase tracking-[0.28em] transition-colors ${
                  solid ? "text-foreground/75 hover:text-primary" : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`hidden text-[10px] uppercase tracking-[0.3em] sm:inline ${
                solid ? "text-muted-foreground" : "text-white/70"
              }`}
            >
              EN · AR
            </span>
            <Link
              to="/book"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] transition-all min-h-[44px] ${
                solid
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-white/70 text-white hover:bg-white hover:text-primary"
              }`}
            >
              Book Now
            </Link>

            {/* Mobile Navigation Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`inline-flex lg:hidden items-center justify-center p-2.5 rounded-full border min-w-[44px] min-h-[44px] transition-colors ${
                solid
                  ? "border-border/80 text-foreground hover:bg-muted"
                  : "border-white/40 text-white hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay / Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-espresso/98 backdrop-blur-2xl text-ivory lg:hidden pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1rem))] px-6 overflow-y-auto animate-in fade-in duration-300"
        >
          <div className="space-y-6">
            <div className="border-b border-ivory/15 pb-3">
              <span className="eyebrow text-champagne/80">Navigation</span>
            </div>
            <nav className="flex flex-col divide-y divide-ivory/10">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-2xl sm:text-3xl font-serif tracking-[0.05em] text-ivory/90 hover:text-champagne transition-colors"
                >
                  <span>{item.label}</span>
                  <ChevronRight size={18} className="text-champagne/70" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8 space-y-6 border-t border-ivory/15 pt-6">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-champagne py-3.5 px-6 text-xs font-medium uppercase tracking-[0.25em] text-espresso shadow-lg transition-transform active:scale-[0.98]"
            >
              Reserve an Appointment
            </Link>
            <div className="space-y-3 text-xs text-ivory/70">
              <a
                href="tel:+97140000000"
                className="flex min-h-[44px] items-center gap-2.5 text-ivory/80 hover:text-champagne transition-colors"
              >
                <Phone size={16} className="text-champagne shrink-0" />
                <span className="text-sm font-medium tracking-wide">+971 4 000 0000</span>
              </a>
              <div className="flex min-h-[44px] items-center gap-2.5">
                <MapPin size={16} className="text-champagne shrink-0" />
                <span className="leading-snug">The Avenue, 12 Rose Court · Downtown</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      {!isHome && <SiteFooter />}

      {/* Persistent mobile CTA - excluded on booking page to prevent blocking form controls */}
      {!isBook && !mobileMenuOpen && (
        <Link
          to="/book"
          className="fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] left-1/2 z-40 -translate-x-1/2 rounded-full bg-primary px-8 py-3 text-[11px] uppercase tracking-[0.32em] text-primary-foreground shadow-2xl shadow-primary/30 min-h-[44px] flex items-center justify-center transition-transform active:scale-95 lg:hidden"
        >
          Reserve
        </Link>
      )}
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-espresso text-ivory">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="font-serif text-4xl tracking-[0.2em]">ÉLAN</div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/70">
            An editorial beauty destination — nails, pedicure and spa — designed as an experience,
            not an appointment.
          </p>
          <p className="eyebrow mt-8 text-ivory/50">Book by phone</p>
          <p className="mt-2 font-serif text-2xl">+971 4 000 0000</p>
        </div>
        <div>
          <p className="eyebrow text-ivory/50">Visit</p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/80">
            The Avenue, 12 Rose Court
            <br />
            Downtown · Open daily 10 — 22
          </p>
        </div>
        <div>
          <p className="eyebrow text-ivory/50">Follow</p>
          <ul className="mt-3 space-y-2 text-sm text-ivory/80">
            <li>Instagram</li>
            <li>TikTok</li>
            <li>Pinterest</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-6 text-center text-xs uppercase tracking-[0.3em] text-ivory/40">
        © {new Date().getFullYear()} ÉLAN Nail & Spa · Crafted with care
      </div>
    </footer>
  );
}
