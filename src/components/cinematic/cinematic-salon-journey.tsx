import { useEffect, useRef, useState, type ReactNode } from "react";

import { useI18n } from "@/i18n/salon-i18n";
import { useSalonData } from "@/lib/salon-data";

import {
  cinematicRooms,
  firstCinematicAssets,
  type CinematicRoomConfig,
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

function CinematicRoom({ room }: { room: CinematicRoomConfig }) {
  return (
    <article className={`cinematic-room room--${room.id}`} aria-label={room.alt}>
      <img
        className="cinematic-room__image"
        src={room.image}
        alt={room.alt}
        style={{ objectPosition: room.focal }}
        loading={room.id === "street" ? "eager" : "lazy"}
      />
      <div className="cinematic-room__shade" />
    </article>
  );
}

function RoomPortal({ name }: { name: string }) {
  return (
    <div className={`cinematic-portal portal--${name}`} aria-hidden="true">
      {name === "glass" && (
        <>
          <i className="portal-door portal-door--left" />
          <i className="portal-door portal-door--right" />
        </>
      )}
      {name === "curtain" && (
        <>
          <i className="portal-curtain portal-curtain--left" />
          <i className="portal-curtain portal-curtain--right" />
        </>
      )}
    </div>
  );
}

function ServiceRail({ categoryIds }: { categoryIds: string[] }) {
  const { services } = useSalonData();
  const { formatCurrency, t, text } = useI18n();
  const choices = services
    .filter((service) => service.enabled && categoryIds.includes(service.categoryId))
    .slice(0, 3);
  return (
    <aside className="cinematic-service-rail" aria-label={t("home.selectRitual")}>
      <span className="cinematic-mini-label">{t("home.selectRitual")}</span>
      {choices.map((service) => (
        <a href={`/book?service=${service.id}`} key={service.id} className="cinematic-service-link">
          <span>{text(service, "name")}</span>
          <span>{formatCurrency(service.price)}</span>
        </a>
      ))}
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
  children: ReactNode;
}) {
  return (
    <div className={`cinematic-scene-copy ${className}`}>
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
      className="cinematic-journey cinematic-walkthrough grain"
      aria-label="ELAN cinematic walkthrough"
    >
      <div ref={stageRef} className="cinematic-stage cinematic-walkthrough__stage">
        {cinematicRooms.map((room) => (
          <CinematicRoom room={room} key={room.id} />
        ))}

        <div className="cinematic-street-left" aria-hidden="true">
          <span>Rue des Fleurs</span>
        </div>
        <div className="cinematic-street-right" aria-hidden="true">
          <span>Maison de Soin</span>
        </div>
        <div className="cinematic-pavement-glow" aria-hidden="true" />
        <RoomPortal name="street" />
        <RoomPortal name="glass" />
        <RoomPortal name="reception" />
        <RoomPortal name="manicure" />
        <RoomPortal name="nail" />
        <RoomPortal name="curtain" />
        <RoomPortal name="water" />
        <RoomPortal name="massage" />
        <div className="cinematic-steam cinematic-steam--spa" aria-hidden="true" />
        <div className="cinematic-water cinematic-water--spa" aria-hidden="true" />

        <div className="cinematic-intro cinematic-intro--walkthrough">
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
        <SceneCopy className="cinematic-jacuzzi-copy" eyebrow={t("home.final")}>
          <p>{t("home.finalCopy")}</p>
          <ServiceRail categoryIds={["jacuzzi", "spa"]} />
        </SceneCopy>
        <div className="cinematic-final-copy cinematic-scene-copy">
          <span className="eyebrow text-champagne">{t("home.massage")}</span>
          <h2>{t("home.build")}</h2>
          <p>{t("home.massageCopy")}</p>
          <a href="/book?service=relaxation-massage" className="cinematic-final-cta">
            {t("home.reserveRitual")} <span>↗</span>
          </a>
        </div>

        <div className="cinematic-progress" aria-hidden="true">
          <span>{t("home.scroll")}</span>
          <div className="cinematic-progress-track">
            <i />
          </div>
          <span>10</span>
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
