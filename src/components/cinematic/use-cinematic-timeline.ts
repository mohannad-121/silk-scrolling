import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cinematicTiming } from "./cinematic-scene-config";

gsap.registerPlugin(ScrollTrigger);

const portalOpen = "inset(0% 0% 0% 0% round 0px)";

export function useCinematicTimeline(
  journeyRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const journey = journeyRef.current;
    const stage = stageRef.current;
    if (!journey || !stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      const q = gsap.utils.selector(stage);
      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.78,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => stage.style.setProperty("--journey-progress", String(self.progress)),
        },
      });

      timeline
        .to(
          q(".room--street .cinematic-room__image"),
          { scale: 1.32, yPercent: -2, duration: cinematicTiming.streetApproach },
          0,
        )
        .to(
          q(".cinematic-street-left"),
          { xPercent: -40, duration: cinematicTiming.streetApproach },
          0,
        )
        .to(
          q(".cinematic-street-right"),
          { xPercent: 40, duration: cinematicTiming.streetApproach },
          0,
        )
        .to(
          q(".cinematic-pavement-glow"),
          { opacity: 1, scale: 1.18, duration: cinematicTiming.streetApproach },
          0,
        )
        .to(q(".cinematic-intro"), { autoAlpha: 0, yPercent: -55, duration: 0.06 }, 0.06)
        .to(
          q(".portal--street"),
          { clipPath: portalOpen, duration: 0.08, ease: "expo.inOut" },
          0.09,
        )
        .to(q(".room--approach"), { clipPath: portalOpen, duration: 0.08, ease: "expo.inOut" }, 0.1)
        .to(
          q(".room--approach .cinematic-room__image"),
          { scale: 1.28, yPercent: -2, duration: 0.09 },
          0.12,
        )
        .to(q(".portal--glass"), { clipPath: portalOpen, duration: 0.08, ease: "expo.inOut" }, 0.18)
        .to(
          q(".room--entrance"),
          { clipPath: portalOpen, duration: 0.08, ease: "expo.inOut" },
          cinematicTiming.mainEntrance,
        )
        .to(q(".portal-door--left"), { xPercent: -105, duration: 0.08, ease: "expo.inOut" }, 0.2)
        .to(q(".portal-door--right"), { xPercent: 105, duration: 0.08, ease: "expo.inOut" }, 0.2)
        .to(
          q(".room--entrance .cinematic-room__image"),
          { scale: 1.13, xPercent: 1, duration: 0.08 },
          0.22,
        )
        .to(q(".cinematic-reception-copy"), { autoAlpha: 1, y: 0, duration: 0.045 }, 0.245)
        .to(q(".cinematic-reception-copy"), { autoAlpha: 0, y: -16, duration: 0.04 }, 0.3)
        .to(
          q(".portal--reception"),
          { clipPath: portalOpen, duration: 0.085, ease: "expo.inOut" },
          0.275,
        )
        .to(
          q(".room--reception"),
          { clipPath: portalOpen, duration: 0.085, ease: "expo.inOut" },
          cinematicTiming.reception,
        )
        .to(
          q(".room--reception .cinematic-room__image"),
          { scale: 1.25, xPercent: 3, duration: 0.1 },
          0.31,
        )
        .to(
          q(".portal--manicure"),
          { clipPath: portalOpen, duration: 0.1, ease: "expo.inOut" },
          0.385,
        )
        .to(
          q(".room--manicure"),
          { clipPath: portalOpen, duration: 0.1, ease: "expo.inOut" },
          cinematicTiming.manicureEntry,
        )
        .to(
          q(".room--manicure .cinematic-room__image"),
          { scale: 1.18, xPercent: -2, duration: 0.09 },
          0.43,
        )
        .to(q(".cinematic-manicure-copy"), { autoAlpha: 1, y: 0, duration: 0.04 }, 0.45)
        .to(q(".cinematic-manicure-copy"), { autoAlpha: 0, y: -16, duration: 0.04 }, 0.49)
        .to(
          q(".portal--nail"),
          { clipPath: "circle(78% at 52% 50%)", duration: 0.1, ease: "expo.inOut" },
          0.49,
        )
        .to(
          q(".room--artist"),
          { clipPath: "circle(78% at 52% 50%)", duration: 0.1, ease: "expo.inOut" },
          cinematicTiming.nailArtist,
        )
        .to(
          q(".room--artist .cinematic-room__image"),
          { scale: 1.25, xPercent: -2, duration: 0.08 },
          0.53,
        )
        .to(
          q(".room--nailReveal"),
          { clipPath: "circle(78% at 52% 50%)", duration: 0.1, ease: "expo.inOut" },
          cinematicTiming.nailReveal,
        )
        .to(
          q(".room--nailReveal .cinematic-room__image"),
          { scale: 1.22, xPercent: 2, duration: 0.08 },
          0.63,
        )
        .to(q(".cinematic-look-copy"), { autoAlpha: 1, duration: 0.04 }, 0.64)
        .to(q(".cinematic-look-copy"), { autoAlpha: 0, duration: 0.035 }, 0.68)
        .to(
          q(".portal--curtain"),
          { clipPath: "inset(0 0 0 0)", duration: 0.09, ease: "expo.inOut" },
          0.68,
        )
        .to(
          q(".room--jacuzziEntry"),
          { clipPath: "inset(0 0 0 0)", duration: 0.09, ease: "expo.inOut" },
          cinematicTiming.jacuzziThreshold,
        )
        .to(q(".room--jacuzziEntry .cinematic-room__image"), { scale: 1.17, duration: 0.08 }, 0.71)
        .to(q(".portal-curtain--left"), { xPercent: -88, duration: 0.08, ease: "expo.inOut" }, 0.77)
        .to(q(".portal-curtain--right"), { xPercent: 88, duration: 0.08, ease: "expo.inOut" }, 0.77)
        .to(
          q(".portal--water"),
          { clipPath: "ellipse(100% 100% at 52% 56%)", duration: 0.09, ease: "expo.inOut" },
          0.78,
        )
        .to(
          q(".room--jacuzzi"),
          { clipPath: "ellipse(100% 100% at 52% 56%)", duration: 0.09, ease: "expo.inOut" },
          cinematicTiming.jacuzziEntry,
        )
        .to(
          q(".room--jacuzzi .cinematic-room__image"),
          { scale: 1.16, yPercent: -2, duration: 0.09 },
          0.82,
        )
        .to(q(".cinematic-steam--spa"), { autoAlpha: 0.72, duration: 0.08 }, 0.81)
        .to(q(".cinematic-water--spa"), { autoAlpha: 0.82, duration: 0.09 }, 0.83)
        .to(q(".cinematic-jacuzzi-copy"), { autoAlpha: 1, duration: 0.04 }, 0.84)
        .to(q(".cinematic-jacuzzi-copy"), { autoAlpha: 0, duration: 0.035 }, 0.89)
        .to(
          q(".portal--massage"),
          { clipPath: portalOpen, duration: 0.09, ease: "expo.inOut" },
          0.89,
        )
        .to(
          q(".room--massage"),
          { clipPath: portalOpen, duration: 0.09, ease: "expo.inOut" },
          cinematicTiming.massageEntry,
        )
        .to(
          q(".room--massage .cinematic-room__image"),
          { scale: 1.15, xPercent: 1, duration: 0.08 },
          0.92,
        )
        .to(
          q(".cinematic-final-copy"),
          { autoAlpha: 1, y: 0, duration: 0.055 },
          cinematicTiming.finalReserve,
        );
    }, journey);
    return () => context.revert();
  }, [journeyRef, stageRef]);
}
