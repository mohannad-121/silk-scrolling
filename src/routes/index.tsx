import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

import exterior from "@/assets/scene-exterior.jpg";
import interior from "@/assets/scene-interior.jpg";
import manicure from "@/assets/scene-manicure.jpg";
import artist from "@/assets/scene-artist.jpg";
import pedicure from "@/assets/scene-pedicure.jpg";
import spa from "@/assets/scene-spa.jpg";
import nailsBurgundy from "@/assets/nails-burgundy.jpg";
import nailsFrench from "@/assets/nails-french.jpg";
import nailsChrome from "@/assets/nails-chrome.jpg";
import specialist1 from "@/assets/specialist-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ÉLAN Nail & Spa — Where Beauty Becomes an Experience" },
      { name: "description", content: "Step into ÉLAN — a cinematic luxury destination for manicure, pedicure, nail art, and spa. Book with our specialists today." },
      { property: "og:title", content: "ÉLAN Nail & Spa — Where Beauty Becomes an Experience" },
      { property: "og:description", content: "An editorial beauty experience: nails, pedicure, spa. Reserve your ÉLAN moment." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background text-foreground">
      <SceneExterior />
      <SceneEntrance />
      <SceneManicure />
      <SceneTransformation />
      <SceneGallery />
      <ScenePedicure />
      <SceneSpa />
      <SceneSpecialists />
      <SceneCTA />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 1 — OUTSIDE THE SALON                                    */
/* ────────────────────────────────────────────────────────────── */
function SceneExterior() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const vignette = useTransform(scrollYProgress, [0, 1], [0.55, 0.9]);

  return (
    <section ref={ref} className="relative h-[130vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img
          src={exterior}
          alt="ÉLAN salon exterior at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale, y }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: useTransform(
              vignette,
              (v) => `radial-gradient(ellipse at center, transparent 30%, rgba(20,10,8,${v}) 100%)`,
            ),
          }}
        />
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
        >
          <span className="eyebrow text-white/80">Est. Downtown · Since 2020</span>
          <h1 className="mt-8 max-w-5xl font-serif text-5xl leading-[1.05] text-balance md:text-7xl lg:text-[104px]">
            Where Beauty <em className="italic text-champagne">Becomes</em>
            <br />an Experience
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            A private nail, pedicure and spa house designed as an editorial
            atelier — where every visit is quietly, deliberately, yours.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/book"
              className="rounded-full bg-white px-8 py-4 text-[11px] uppercase tracking-[0.32em] text-primary transition-transform hover:scale-[1.02]"
            >
              Book Your Experience
            </Link>
            <a
              href="#salon"
              className="rounded-full border border-white/60 px-8 py-4 text-[11px] uppercase tracking-[0.32em] text-white transition hover:bg-white/10"
            >
              Explore the Salon
            </a>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
            <div className="h-10 w-px animate-pulse bg-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 2 — ENTERING THE SALON                                   */
/* ────────────────────────────────────────────────────────────── */
function SceneEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  const doorLeft = useTransform(smooth, [0.1, 0.55], ["0%", "-55%"]);
  const doorRight = useTransform(smooth, [0.1, 0.55], ["0%", "55%"]);
  const interiorScale = useTransform(smooth, [0.2, 0.9], [1.4, 1]);
  const interiorOpacity = useTransform(smooth, [0.15, 0.5], [0, 1]);
  const textOpacity = useTransform(smooth, [0.55, 0.75, 0.95], [0, 1, 1]);
  const textY = useTransform(smooth, [0.55, 0.95], ["30px", "0px"]);

  return (
    <section id="salon" ref={ref} className="relative h-[220vh] bg-espresso">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img
          src={interior}
          alt="ÉLAN reception interior"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ scale: interiorScale, opacity: interiorOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/70 via-transparent to-espresso/80" />

        {/* Doors */}
        <motion.div style={{ x: doorLeft }} className="absolute inset-y-0 left-0 w-1/2 bg-espresso border-r border-champagne/30">
          <div className="absolute right-6 top-1/2 h-16 w-px bg-champagne/60" />
        </motion.div>
        <motion.div style={{ x: doorRight }} className="absolute inset-y-0 right-0 w-1/2 bg-espresso border-l border-champagne/30">
          <div className="absolute left-6 top-1/2 h-16 w-px bg-champagne/60" />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-ivory"
        >
          <span className="eyebrow text-champagne">Welcome</span>
          <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-tight text-balance md:text-6xl">
            Step into a world <em className="italic">designed around you.</em>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/70">
            Marble, brass and the quiet hush of velvet. From the moment the
            doors open, every detail is composed with intention.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 3 — THE MANICURE EXPERIENCE                              */
/* ────────────────────────────────────────────────────────────── */
function SceneManicure() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);

  const categories = [
    { name: "Classic Manicure", duration: "45 min", price: "AED 120" },
    { name: "Gel Manicure", duration: "60 min", price: "AED 180" },
    { name: "Russian Manicure", duration: "90 min", price: "AED 280" },
    { name: "Builder Gel", duration: "75 min", price: "AED 240" },
    { name: "Acrylic Extensions", duration: "120 min", price: "AED 380" },
    { name: "Luxury Nail Care", duration: "60 min", price: "AED 220" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-32 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <div className="sticky top-32 aspect-[3/4] overflow-hidden rounded-sm">
            <motion.img
              src={artist}
              alt="Nail artist at work"
              style={{ y: imgY, scale: imgScale }}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="md:col-span-6">
          <span className="eyebrow">Scene III · The Studio</span>
          <h2 className="mt-6 font-serif text-5xl leading-[1.05] text-balance md:text-6xl">
            Craft, quietly <em className="italic text-primary">practiced.</em>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Our nail specialists work slowly, deliberately — the way a couture
            atelier finishes a garment. Every cuticle, every stroke, considered.
          </p>

          <ul className="mt-14 divide-y divide-border">
            {categories.map((c, i) => (
              <motion.li
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="group grid grid-cols-[1fr_auto_auto] items-baseline gap-6 py-5"
              >
                <span className="font-serif text-2xl md:text-3xl">{c.name}</span>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{c.duration}</span>
                <span className="font-serif text-xl text-primary">{c.price}</span>
              </motion.li>
            ))}
          </ul>

          <Link
            to="/services"
            className="mt-12 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-primary hover:gap-4 transition-all"
          >
            View full menu <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 4 — NAIL TRANSFORMATION                                  */
/* ────────────────────────────────────────────────────────────── */
function SceneTransformation() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0.1, 0.9], ["100%", "0%"]);
  const headline = useTransform(scrollYProgress, [0, 0.3], [80, 0]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-espresso text-ivory">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ y: headline }} className="absolute top-20 z-20 px-6 text-center">
          <span className="eyebrow text-champagne">Scene IV · Transformation</span>
          <h2 className="mt-4 font-serif text-4xl md:text-6xl">
            Every Detail. <em className="italic">Designed for you.</em>
          </h2>
        </motion.div>

        <div className="relative aspect-[4/5] w-[min(90vw,600px)] overflow-hidden rounded-sm">
          <img src={manicure} alt="Before manicure" className="absolute inset-0 h-full w-full object-cover grayscale" />
          <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: useTransform(clip, (v) => `inset(0 ${v} 0 0)`) }}>
            <img src={manicure} alt="After manicure" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div
            className="absolute top-0 h-full w-px bg-champagne"
            style={{ left: useTransform(clip, (v) => `calc(100% - ${v})`) }}
          />
        </div>

        <div className="absolute bottom-16 flex gap-8 text-xs uppercase tracking-[0.35em] text-ivory/60">
          <span>Before</span>
          <span>·</span>
          <span className="text-champagne">After</span>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 5 — HORIZONTAL NAIL GALLERY                              */
/* ────────────────────────────────────────────────────────────── */
function SceneGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);

  const looks = [
    { img: nailsBurgundy, name: "Burgundy Silk", cat: "Luxury" },
    { img: nailsFrench, name: "Modern French", cat: "Bridal" },
    { img: nailsChrome, name: "Liquid Chrome", cat: "Editorial" },
    { img: manicure, name: "Nude Glow", cat: "Classic" },
    { img: nailsBurgundy, name: "Wine Almond", cat: "Seasonal" },
    { img: nailsFrench, name: "Blush Tip", cat: "Minimal" },
  ];

  return (
    <section ref={ref} className="relative h-[400vh] bg-ivory">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="flex items-end justify-between px-6 pt-28 md:px-10">
          <div>
            <span className="eyebrow">Scene V · The Gallery</span>
            <h2 className="mt-4 font-serif text-4xl md:text-6xl">
              A wardrobe <em className="italic text-primary">for your hands.</em>
            </h2>
          </div>
          <Link to="/gallery" className="hidden text-[11px] uppercase tracking-[0.3em] text-primary md:block">
            View all looks →
          </Link>
        </div>

        <motion.div style={{ x }} className="mt-12 flex h-full gap-6 pl-6 md:gap-10 md:pl-10">
          {looks.map((l, i) => (
            <figure
              key={i}
              className="group relative flex h-[62vh] shrink-0 flex-col justify-end overflow-hidden rounded-sm"
              style={{ width: i % 2 ? "38vw" : "30vw" }}
            >
              <img
                src={l.img}
                alt={l.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 to-transparent" />
              <figcaption className="relative z-10 p-6 text-ivory">
                <span className="text-[10px] uppercase tracking-[0.35em] text-champagne">{l.cat}</span>
                <p className="mt-2 font-serif text-2xl">{l.name}</p>
                <button className="mt-4 text-[11px] uppercase tracking-[0.3em] underline-offset-4 hover:underline">
                  Book This Look
                </button>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 6 — PEDICURE LOUNGE                                      */
/* ────────────────────────────────────────────────────────────── */
function ScenePedicure() {
  const services = [
    { name: "Classic Pedicure", time: "50 min", price: "AED 150" },
    { name: "Spa Pedicure", time: "75 min", price: "AED 240" },
    { name: "Gel Pedicure", time: "75 min", price: "AED 260" },
    { name: "Luxury Foot Massage", time: "60 min", price: "AED 280" },
  ];
  return (
    <section className="relative overflow-hidden bg-espresso py-32 text-ivory md:py-40">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="aspect-[4/5] overflow-hidden rounded-sm"
        >
          <img src={pedicure} alt="Pedicure lounge" className="h-full w-full object-cover" loading="lazy" />
        </motion.div>
        <div>
          <span className="eyebrow text-champagne">Scene VI · The Lounge</span>
          <h2 className="mt-4 font-serif text-5xl leading-[1.05] md:text-6xl">
            A softer <em className="italic">tempo.</em>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">
            Copper foot baths. Petals warmed by candlelight. Our pedicure lounge
            is a room designed to slow the pulse before it beautifies.
          </p>
          <ul className="mt-10 divide-y divide-ivory/10">
            {services.map((s) => (
              <li key={s.name} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-6 py-4">
                <span className="font-serif text-xl md:text-2xl">{s.name}</span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-ivory/50">{s.time}</span>
                <span className="font-serif text-lg text-champagne">{s.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 7 — SPA                                                  */
/* ────────────────────────────────────────────────────────────── */
function SceneSpa() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const [selected, setSelected] = useState<string[]>(["Hand Spa"]);
  const spaServices = [
    { name: "Hand Spa", time: 30, price: 180 },
    { name: "Foot Spa", time: 45, price: 220 },
    { name: "Aromatherapy Massage", time: 60, price: 380 },
    { name: "Signature Facial", time: 60, price: 420 },
    { name: "Body Scrub", time: 45, price: 340 },
    { name: "Bridal Package", time: 180, price: 1200 },
  ];
  const total = selected.reduce(
    (acc, n) => {
      const s = spaServices.find((x) => x.name === n)!;
      return { time: acc.time + s.time, price: acc.price + s.price };
    },
    { time: 0, price: 0 },
  );
  const toggle = (n: string) =>
    setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));

  return (
    <section ref={ref} className="relative h-[130vh] overflow-hidden bg-ivory">
      <motion.img
        src={spa}
        alt="Spa treatment room"
        style={{ y }}
        className="absolute inset-0 h-[120%] w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-espresso/50 to-espresso/80" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6 py-32 text-ivory md:px-10">
        <span className="eyebrow text-champagne">Scene VII · The Spa</span>
        <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[1.05] md:text-7xl">
          Build your <em className="italic">spa day.</em>
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">
          Compose your own ritual. Choose the treatments — we'll blend them
          into a single, seamless afternoon.
        </p>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {spaServices.map((s) => {
            const active = selected.includes(s.name);
            return (
              <button
                key={s.name}
                onClick={() => toggle(s.name)}
                className={`group flex items-center justify-between rounded-sm border px-5 py-4 text-left backdrop-blur-md transition-all ${
                  active
                    ? "border-champagne bg-champagne/15 text-ivory"
                    : "border-ivory/20 bg-ivory/5 text-ivory/80 hover:border-ivory/50"
                }`}
              >
                <div>
                  <p className="font-serif text-lg">{s.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                    {s.time} min · AED {s.price}
                  </p>
                </div>
                <span className={`h-4 w-4 rounded-full border transition ${active ? "border-champagne bg-champagne" : "border-ivory/40"}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-ivory/15 pt-6">
          <div>
            <p className="eyebrow text-ivory/60">Your Ritual</p>
            <p className="mt-2 font-serif text-3xl md:text-4xl">
              {total.time} min · <span className="text-champagne">AED {total.price}</span>
            </p>
          </div>
          <Link
            to="/book"
            className="rounded-full bg-champagne px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-espresso transition hover:scale-[1.02]"
          >
            Reserve this ritual
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 8 — SPECIALISTS                                          */
/* ────────────────────────────────────────────────────────────── */
function SceneSpecialists() {
  const team = [
    { name: "Layla Farouk", role: "Master Nail Artist", exp: "12 yrs", img: specialist1, spec: "Russian Manicure · Nail Art" },
    { name: "Amelia Rossi", role: "Spa Therapist", exp: "9 yrs", img: specialist1, spec: "Aromatherapy · Facials" },
    { name: "Sara Al-Hashimi", role: "Pedicure Specialist", exp: "7 yrs", img: specialist1, spec: "Foot Care · Reflexology" },
  ];
  return (
    <section className="bg-ivory py-32 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Scene VIII · The Atelier</span>
            <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] md:text-6xl">
              Meet the hands <em className="italic text-primary">behind it all.</em>
            </h2>
          </div>
          <Link to="/specialists" className="text-[11px] uppercase tracking-[0.3em] text-primary">
            Full team →
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {team.map((m, i) => (
            <motion.article
              key={m.name + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-full w-full object-cover grayscale transition duration-[1200ms] group-hover:grayscale-0 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-espresso/70 to-transparent" />
              </div>
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-serif text-2xl">{m.name}</h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{m.exp}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-primary/80">{m.spec}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* SCENE 9 — FINAL CTA                                            */
/* ────────────────────────────────────────────────────────────── */
function SceneCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  return (
    <section ref={ref} className="relative h-[90vh] overflow-hidden bg-espresso">
      <motion.img
        src={exterior}
        style={{ scale }}
        alt="ÉLAN exterior"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/80 via-espresso/60 to-espresso" />
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center text-ivory">
        <span className="eyebrow text-champagne">Your Turn</span>
        <h2 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl">
          Reserve your <em className="italic">ÉLAN moment.</em>
        </h2>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-ivory/70">
          A concierge will confirm your appointment within moments. Walk‑ins
          welcome — reservations preferred.
        </p>
        <Link
          to="/book"
          className="mt-10 rounded-full bg-champagne px-10 py-5 text-[11px] uppercase tracking-[0.35em] text-espresso hover:scale-[1.02] transition-transform"
        >
          Book an Experience
        </Link>
      </div>
    </section>
  );
}

// Suppress unused import lint (used for motion events elsewhere if extended).
export const _mv = useMotionValueEvent;
