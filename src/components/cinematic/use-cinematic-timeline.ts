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
      const q = gsap.utils.selector(stage);
      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.72,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => stage.style.setProperty("--journey-progress", String(self.progress)),
        },
      });
      timeline
        .to(
          q(".scene--street .cinematic-image"),
          { scale: 1.4, xPercent: -2, yPercent: -3, duration: 0.16 },
          0,
        )
        .to(q(".cinematic-street-left"), { xPercent: -34, duration: 0.16 }, 0)
        .to(q(".cinematic-street-right"), { xPercent: 34, duration: 0.16 }, 0)
        .to(q(".cinematic-intro"), { autoAlpha: 0, yPercent: -65, duration: 0.1 }, 0.09)
        .to(
          q(".cinematic-doorway"),
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.13, ease: "expo.inOut" },
          0.15,
        )
        .to(
          q(".scene--reception"),
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.13, ease: "expo.inOut" },
          0.15,
        )
        .to(q(".cinematic-door-left"), { xPercent: -108, duration: 0.12, ease: "expo.inOut" }, 0.16)
        .to(q(".cinematic-door-right"), { xPercent: 108, duration: 0.12, ease: "expo.inOut" }, 0.16)
        .to(
          q(".scene--reception .cinematic-image"),
          { scale: 1.18, xPercent: 2, duration: 0.16 },
          0.25,
        )
        .to(q(".cinematic-reception-copy"), { autoAlpha: 1, y: 0, duration: 0.06 }, 0.27)
        .to(q(".cinematic-reception-copy"), { autoAlpha: 0, y: -18, duration: 0.06 }, 0.36)
        .to(
          q(".cinematic-arch-mask"),
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.12, ease: "expo.inOut" },
          0.35,
        )
        .to(
          q(".scene--manicure"),
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.12, ease: "expo.inOut" },
          0.35,
        )
        .to(
          q(".scene--manicure .cinematic-image"),
          { scale: 1.24, xPercent: -4, duration: 0.16 },
          0.42,
        )
        .to(q(".cinematic-manicure-copy"), { autoAlpha: 1, y: 0, duration: 0.06 }, 0.45)
        .to(q(".cinematic-manicure-copy"), { autoAlpha: 0, y: -16, duration: 0.06 }, 0.54)
        .to(
          q(".cinematic-reveal-mask"),
          { clipPath: "circle(78% at 54% 48%)", duration: 0.13, ease: "expo.inOut" },
          0.53,
        )
        .to(
          q(".scene--look"),
          { clipPath: "circle(78% at 54% 48%)", duration: 0.13, ease: "expo.inOut" },
          0.53,
        )
        .to(q(".scene--look .cinematic-image"), { scale: 1.2, xPercent: 2, duration: 0.12 }, 0.59)
        .to(q(".cinematic-look-copy"), { autoAlpha: 1, duration: 0.06 }, 0.6)
        .to(q(".cinematic-look-copy"), { autoAlpha: 0, duration: 0.05 }, 0.68)
        .to(
          q(".cinematic-curtain-mask"),
          { clipPath: "inset(0 0 0 0)", duration: 0.12, ease: "expo.inOut" },
          0.67,
        )
        .to(
          q(".scene--pedicure"),
          { clipPath: "inset(0 0 0 0)", duration: 0.12, ease: "expo.inOut" },
          0.67,
        )
        .to(
          q(".scene--pedicure .cinematic-image"),
          { scale: 1.18, yPercent: -3, duration: 0.13 },
          0.72,
        )
        .to(q(".cinematic-pedicure-copy"), { autoAlpha: 1, duration: 0.05 }, 0.73)
        .to(q(".cinematic-pedicure-copy"), { autoAlpha: 0, duration: 0.04 }, 0.79)
        .to(
          q(".cinematic-laser-mask"),
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 0.11,
            ease: "expo.inOut",
          },
          0.78,
        )
        .to(
          q(".scene--laser"),
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 0.11,
            ease: "expo.inOut",
          },
          0.78,
        )
        .to(
          q(".scene--laser .cinematic-image"),
          { scale: 1.15, xPercent: -2, duration: 0.12 },
          0.81,
        )
        .to(q(".cinematic-steam"), { autoAlpha: 0.75, duration: 0.08 }, 0.82)
        .to(q(".cinematic-laser-copy"), { autoAlpha: 1, duration: 0.05 }, 0.82)
        .to(q(".cinematic-laser-copy"), { autoAlpha: 0, duration: 0.04 }, 0.87)
        .to(
          q(".cinematic-water-mask"),
          { clipPath: "ellipse(100% 100% at 52% 58%)", duration: 0.12, ease: "expo.inOut" },
          0.86,
        )
        .to(
          q(".scene--jacuzzi"),
          { clipPath: "ellipse(100% 100% at 52% 58%)", duration: 0.12, ease: "expo.inOut" },
          0.86,
        )
        .to(
          q(".scene--jacuzzi .cinematic-image"),
          { scale: 1.14, yPercent: -2, duration: 0.13 },
          0.89,
        )
        .to(q(".cinematic-water"), { autoAlpha: 0.78, duration: 0.11 }, 0.9)
        .to(q(".cinematic-final-copy"), { autoAlpha: 1, y: 0, duration: 0.07 }, 0.93);
    }, journey);
    return () => context.revert();
  }, [journeyRef, stageRef]);
}
