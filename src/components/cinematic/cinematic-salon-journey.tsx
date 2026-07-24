import { useEffect, useRef, useState } from "react";

import { useSalonData } from "@/lib/salon-data";

import {
  cinematicScenes,
  firstCinematicAssets,
  type CinematicSceneConfig,
} from "./cinematic-scene-config";
import { useCinematicTimeline } from "./use-cinematic-timeline";

function useCinematicLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    const assets = firstCinematicAssets;
    const complete = () => {
      loaded += 1;
      if (mounted) setProgress(Math.round((loaded / assets.length) * 100));
    };
    assets.forEach((source) => {
      const image = new Image();
      image.onload = complete;
      image.onerror = complete;
      image.src = source;
    });
    return () => {
      mounted = false;
    };
  }, []);

  return progress;
}

function CinematicScene({ scene }: { scene: CinematicSceneConfig }) {
  return (
    <article className={`cinematic-scene scene--${scene.id}`} aria-label={scene.label}>
      <img
        className="cinematic-image"
        src={scene.image}
        alt={scene.alt}
        loading={scene.id === "street" ? "eager" : "lazy"}
      />
      <div className={`cinematic-scene-shade cinematic-scene-shade--${scene.id}`} />
      <div className="cinematic-scene-meta">
        <span>{scene.label}</span>
        <span>{scene.eyebrow}</span>
      </div>
    </article>
  );
}

function ServiceRail({ categoryIds }: { categoryIds: string[] }) {
  const { services } = useSalonData();
  const choices = services
    .filter((service) => service.enabled && categoryIds.includes(service.categoryId))
    .slice(0, 4);
  return (
    <aside className="cinematic-service-rail" aria-label="Featured services">
      <span className="cinematic-mini-label">Select a ritual</span>
      <div>
        {choices.map((service) => (
          <a
            href={`/book?service=${service.id}`}
            key={service.id}
            className="cinematic-service-link"
          >
            <span>{service.name}</span>
            <span>AED {service.price}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function CinematicProgressIndicator() {
  return (
    <div className="cinematic-progress" aria-hidden="true">
      <span>Scroll to enter</span>
      <div className="cinematic-progress-track">
        <i />
      </div>
      <span>07</span>
    </div>
  );
}

export function CinematicSalonJourney() {
  const journeyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useCinematicLoader();
  useCinematicTimeline(journeyRef, stageRef);

  return (
    <section
      ref={journeyRef}
      className="cinematic-journey grain"
      aria-label="A cinematic tour through ÉLAN"
    >
      <div ref={stageRef} className="cinematic-stage">
        {cinematicScenes.map((scene) => (
          <CinematicScene key={scene.id} scene={scene} />
        ))}

        <div className="cinematic-street-left" aria-hidden="true">
          <span>Maison No. 11</span>
        </div>
        <div className="cinematic-street-right" aria-hidden="true">
          <span>Atelier du Parfum</span>
        </div>
        <div className="cinematic-door-glow" aria-hidden="true" />
        <div className="cinematic-door cinematic-door-left" aria-hidden="true" />
        <div className="cinematic-door cinematic-door-right" aria-hidden="true" />
        <div className="cinematic-arch" aria-hidden="true" />
        <div className="cinematic-curtain" aria-hidden="true" />
        <div className="cinematic-steam" aria-hidden="true" />
        <div className="cinematic-water" aria-hidden="true" />

        <div className="cinematic-intro">
          <span className="eyebrow text-white/70">ÉLAN Nail & Spa · The Avenue</span>
          <h1>
            Where beauty <em>becomes</em> an experience.
          </h1>
          <p>Follow the light beyond the salon door.</p>
          <a href="#journey-start" className="cinematic-quiet-link">
            Begin the journey <span>↓</span>
          </a>
        </div>

        <div className="cinematic-reception-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">Reception</span>
          <p>Welcome to your private beauty experience.</p>
        </div>

        <div className="cinematic-manicure-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">The Atelier</span>
          <p>Precision, considered down to the last detail.</p>
          <ServiceRail categoryIds={["nails"]} />
        </div>

        <div className="cinematic-look-copy cinematic-scene-copy cinematic-look-copy">
          <span className="eyebrow text-champagne">The Reveal</span>
          <p>A hand-finished moment, made to be remembered.</p>
          <a className="cinematic-book-look" href="/book?service=nail-art&look=burgundy">
            Book this look <span>↗</span>
          </a>
        </div>

        <div className="cinematic-pedicure-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">Pedicure Lounge</span>
          <p>Settle into a ritual with nowhere else to be.</p>
          <ServiceRail categoryIds={["pedicure"]} />
        </div>

        <div className="cinematic-laser-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">Private Laser Suite</span>
          <p>Advanced care in a beautifully calm space.</p>
          <ServiceRail categoryIds={["laser"]} />
        </div>

        <div className="cinematic-final-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">The Private Suite</span>
          <h2>
            Build your <em>spa day.</em>
          </h2>
          <p>A private water ritual, at your pace.</p>
          <a href="/book?service=private-jacuzzi" className="cinematic-final-cta">
            Reserve your ritual <span>↗</span>
          </a>
        </div>

        <CinematicProgressIndicator />
        <div id="journey-start" className="cinematic-anchor" />

        {progress < 100 && (
          <div className="cinematic-loader">
            <span className="eyebrow text-white/60">Preparing the house</span>
            <div>
              <i style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}%</span>
          </div>
        )}
      </div>
    </section>
  );
}
