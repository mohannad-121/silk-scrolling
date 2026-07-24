import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/salon-i18n";
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
    const done = () => {
      loaded += 1;
      if (mounted) setProgress(Math.round((loaded / firstCinematicAssets.length) * 100));
    };
    firstCinematicAssets.forEach((source) => {
      const image = new Image();
      image.onload = done;
      image.onerror = done;
      image.src = source;
    });
    return () => {
      mounted = false;
    };
  }, []);
  return progress;
}
function SceneLayer({ scene }: { scene: CinematicSceneConfig }) {
  return (
    <article className={`cinematic-scene scene--${scene.id}`} aria-label={scene.alt}>
      <img
        className="cinematic-image"
        src={scene.image}
        alt={scene.alt}
        style={{ objectPosition: scene.focal }}
        loading={scene.id === "street" ? "eager" : "lazy"}
      />
      <div className="cinematic-scene-shade" />
    </article>
  );
}
function ServiceRail({ categoryIds }: { categoryIds: string[] }) {
  const { services } = useSalonData();
  const { formatCurrency, t, text } = useI18n();
  const choices = services
    .filter((item) => item.enabled && categoryIds.includes(item.categoryId))
    .slice(0, 4);
  return (
    <aside className="cinematic-service-rail" aria-label={t("home.selectRitual")}>
      <span className="cinematic-mini-label">{t("home.selectRitual")}</span>
      <div>
        {choices.map((item) => (
          <a href={`/book?service=${item.id}`} key={item.id} className="cinematic-service-link">
            <span>{text(item, "name")}</span>
            <span>{formatCurrency(item.price)}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
function SceneCopy({
  className,
  eyebrow,
  children,
}: {
  className: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${className} cinematic-scene-copy`}>
      <span className="eyebrow text-champagne">{eyebrow}</span>
      {children}
    </div>
  );
}
export function CinematicSalonJourney() {
  const journeyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useCinematicLoader();
  const { t } = useI18n();
  useCinematicTimeline(journeyRef, stageRef);
  return (
    <section
      ref={journeyRef}
      className="cinematic-journey grain"
      aria-label="ELAN cinematic journey"
    >
      <div ref={stageRef} className="cinematic-stage">
        {cinematicScenes.map((scene) => (
          <SceneLayer scene={scene} key={scene.id} />
        ))}
        <div className="cinematic-street-left" aria-hidden="true">
          <span>Maison No. 11</span>
        </div>
        <div className="cinematic-street-right" aria-hidden="true">
          <span>Atelier du Parfum</span>
        </div>
        <div className="cinematic-doorway" aria-hidden="true">
          <div className="cinematic-door cinematic-door-left" />
          <div className="cinematic-door cinematic-door-right" />
        </div>
        <div className="cinematic-arch-mask" aria-hidden="true" />
        <div className="cinematic-reveal-mask" aria-hidden="true" />
        <div className="cinematic-curtain-mask" aria-hidden="true" />
        <div className="cinematic-laser-mask" aria-hidden="true" />
        <div className="cinematic-water-mask" aria-hidden="true" />
        <div className="cinematic-steam" aria-hidden="true" />
        <div className="cinematic-water" aria-hidden="true" />
        <div className="cinematic-intro">
          <span className="eyebrow text-white/70">{t("home.eyebrow")}</span>
          <h1>{t("home.title")}</h1>
          <p>{t("home.follow")}</p>
          <a href="#journey-start" className="cinematic-quiet-link">
            {t("home.begin")} <span>↓</span>
          </a>
        </div>
        <SceneCopy className="cinematic-reception-copy" eyebrow={t("home.reception")}>
          <p>{t("home.receptionCopy")}</p>
        </SceneCopy>
        <SceneCopy className="cinematic-manicure-copy" eyebrow={t("home.atelier")}>
          <p>{t("home.atelierCopy")}</p>
          <ServiceRail categoryIds={["nails"]} />
        </SceneCopy>
        <SceneCopy className="cinematic-look-copy" eyebrow={t("home.reveal")}>
          <p>{t("home.revealCopy")}</p>
          <a className="cinematic-book-look" href="/book?service=nail-art&look=burgundy">
            {t("home.bookLook")} <span>↗</span>
          </a>
        </SceneCopy>
        <SceneCopy className="cinematic-pedicure-copy" eyebrow={t("home.pedicure")}>
          <p>{t("home.pedicureCopy")}</p>
          <ServiceRail categoryIds={["pedicure"]} />
        </SceneCopy>
        <SceneCopy className="cinematic-laser-copy" eyebrow={t("home.laser")}>
          <p>{t("home.laserCopy")}</p>
          <ServiceRail categoryIds={["laser"]} />
        </SceneCopy>
        <div className="cinematic-final-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">{t("home.final")}</span>
          <h2>{t("home.build")}</h2>
          <p>{t("home.finalCopy")}</p>
          <a href="/book?service=private-jacuzzi" className="cinematic-final-cta">
            {t("home.reserveRitual")} <span>↗</span>
          </a>
        </div>
        <div className="cinematic-progress" aria-hidden="true">
          <span>{t("home.scroll")}</span>
          <div className="cinematic-progress-track">
            <i />
          </div>
          <span>07</span>
        </div>
        <div id="journey-start" className="cinematic-anchor" />
        {progress < 100 && (
          <div className="cinematic-loader">
            <span className="eyebrow text-white/60">{t("home.prepare")}</span>
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
