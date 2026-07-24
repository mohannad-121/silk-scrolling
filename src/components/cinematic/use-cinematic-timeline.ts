import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useCinematicTimeline(
  journeyRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const journey = journeyRef.current;
    const stage = stageRef.current;
    if (!journey || !stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.75,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => stage.style.setProperty("--journey-progress", String(self.progress)),
        },
      });

      timeline
        .to(".cinematic-street-image", { scale: 1.48, yPercent: -5, duration: 0.28 }, 0)
        .to(".cinematic-street-left", { xPercent: -30, duration: 0.28, ease: "power2.inOut" }, 0)
        .to(".cinematic-street-right", { xPercent: 28, duration: 0.28, ease: "power2.inOut" }, 0)
        .to(".cinematic-intro", { opacity: 0, yPercent: -45, duration: 0.15 }, 0.1)
        .to(".cinematic-door-glow", { opacity: 1, duration: 0.1 }, 0.19)
        .to(".cinematic-door-left", { xPercent: -98, duration: 0.13, ease: "expo.inOut" }, 0.2)
        .to(".cinematic-door-right", { xPercent: 98, duration: 0.13, ease: "expo.inOut" }, 0.2)
        .to(".scene--reception", { opacity: 1, duration: 0.08 }, 0.235)
        .to(".scene--street", { opacity: 0, filter: "blur(10px)", duration: 0.09 }, 0.27)
        .to(".scene--reception .cinematic-image", { scale: 1.16, xPercent: 1, duration: 0.2 }, 0.3)
        .fromTo(
          ".cinematic-reception-copy",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.06 },
          0.33,
        )
        .to(".cinematic-reception-copy", { opacity: 0, y: -18, duration: 0.06 }, 0.41)
        .to(".cinematic-arch", { scaleX: 1.15, opacity: 1, duration: 0.08 }, 0.4)
        .to(".scene--manicure", { opacity: 1, duration: 0.07 }, 0.43)
        .to(".scene--reception", { opacity: 0, filter: "blur(8px)", duration: 0.08 }, 0.46)
        .to(
          ".scene--manicure .cinematic-image",
          { scale: 1.25, xPercent: -2, duration: 0.17 },
          0.46,
        )
        .to(".cinematic-manicure-copy", { opacity: 1, duration: 0.05 }, 0.49)
        .to(".cinematic-manicure-copy", { opacity: 0, duration: 0.05 }, 0.56)
        .to(".scene--look", { opacity: 1, duration: 0.07 }, 0.57)
        .to(".scene--manicure", { opacity: 0, filter: "blur(10px)", duration: 0.08 }, 0.59)
        .to(
          ".scene--look .cinematic-image",
          { scale: 1.26, xPercent: 2, duration: 0.13, ease: "power2.inOut" },
          0.59,
        )
        .to(".cinematic-look-copy", { opacity: 1, duration: 0.05 }, 0.62)
        .to(".cinematic-look-copy", { opacity: 0, duration: 0.05 }, 0.68)
        .to(".cinematic-curtain", { opacity: 1, scaleX: 1, duration: 0.08 }, 0.67)
        .to(".scene--pedicure", { opacity: 1, duration: 0.07 }, 0.68)
        .to(".scene--look", { opacity: 0, filter: "blur(10px)", duration: 0.08 }, 0.7)
        .to(".scene--pedicure .cinematic-image", { scale: 1.2, yPercent: -2, duration: 0.13 }, 0.7)
        .to(".cinematic-pedicure-copy", { opacity: 1, duration: 0.04 }, 0.72)
        .to(".cinematic-pedicure-copy", { opacity: 0, duration: 0.04 }, 0.77)
        .to(".scene--laser", { opacity: 1, duration: 0.07 }, 0.77)
        .to(".scene--pedicure", { opacity: 0, filter: "blur(10px)", duration: 0.08 }, 0.79)
        .to(".scene--laser .cinematic-image", { scale: 1.15, duration: 0.12 }, 0.79)
        .to(".cinematic-steam", { opacity: 0.8, duration: 0.12 }, 0.82)
        .to(".cinematic-laser-copy", { opacity: 1, duration: 0.04 }, 0.81)
        .to(".cinematic-laser-copy", { opacity: 0, duration: 0.04 }, 0.86)
        .to(".scene--jacuzzi", { opacity: 1, duration: 0.07 }, 0.86)
        .to(".scene--laser", { opacity: 0, filter: "blur(12px)", duration: 0.08 }, 0.88)
        .to(".scene--jacuzzi .cinematic-image", { scale: 1.14, yPercent: -2, duration: 0.14 }, 0.87)
        .to(
          ".cinematic-water",
          { opacity: 0.8, xPercent: 3, duration: 0.12, ease: "sine.inOut" },
          0.88,
        )
        .to(".cinematic-final-copy", { opacity: 1, y: 0, duration: 0.07 }, 0.93);
    }, journey);

    return () => context.revert();
  }, [journeyRef, stageRef]);
}
