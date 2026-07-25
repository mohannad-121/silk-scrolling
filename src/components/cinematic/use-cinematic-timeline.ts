import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cinematicTiming } from "./cinematic-scene-config";

gsap.registerPlugin(ScrollTrigger);

const aperture = "inset(0% 0% 0% 0% round 0px)";
const arch = "inset(0% 0% 0% 0% round 3rem 3rem 1rem 1rem / 34% 34% 1rem 1rem)";

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
      const reveal = (selector: string, at: number, shape = aperture, duration = 0.075) =>
        timeline.to(q(selector), { clipPath: shape, duration, ease: "expo.inOut" }, at);
      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: journey,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.82,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => stage.style.setProperty("--journey-progress", String(self.progress)),
        },
      });

      timeline
        .to(
          q(".room--street .cinematic-room__image"),
          { scale: 1.27, yPercent: -2, duration: 0.11 },
          0,
        )
        .to(q(".cinematic-street-left"), { xPercent: -40, duration: 0.1 }, 0)
        .to(q(".cinematic-street-right"), { xPercent: 40, duration: 0.1 }, 0)
        .to(q(".cinematic-pavement-glow"), { opacity: 1, scale: 1.16, duration: 0.1 }, 0)
        .to(q(".cinematic-intro"), { autoAlpha: 0, yPercent: -55, duration: 0.06 }, 0.06);

      reveal(".portal--street", 0.1);
      reveal(".room--approach", 0.1);
      timeline.to(
        q(".room--approach .cinematic-room__image"),
        { scale: 1.24, duration: 0.1 },
        0.12,
      );

      reveal(".portal--glass", 0.18, aperture, 0.08);
      timeline
        .to(q(".portal-door--left"), { xPercent: -42, rotateY: -22, duration: 0.045 }, 0.19)
        .to(q(".portal-door--right"), { xPercent: 42, rotateY: 22, duration: 0.045 }, 0.19)
        .to(q(".portal-door--left"), { xPercent: -108, rotateY: -55, duration: 0.055 }, 0.235)
        .to(q(".portal-door--right"), { xPercent: 108, rotateY: 55, duration: 0.055 }, 0.235);
      reveal(".room--entrance", cinematicTiming.mainEntrance, aperture, 0.09);
      timeline.to(
        q(".room--entrance .cinematic-room__image"),
        { scale: 1.13, xPercent: 1, duration: 0.08 },
        0.22,
      );

      timeline.to(q(".cinematic-reception-copy"), { autoAlpha: 1, y: 0, duration: 0.04 }, 0.25);
      timeline.to(q(".cinematic-reception-copy"), { autoAlpha: 0, y: -16, duration: 0.04 }, 0.315);
      reveal(".portal--reception", 0.28, arch, 0.085);
      reveal(".room--reception", cinematicTiming.reception, arch, 0.085);
      timeline.to(
        q(".room--reception .cinematic-room__image"),
        { scale: 1.22, xPercent: 4, duration: 0.09 },
        0.31,
      );

      reveal(".portal--manicure", 0.375, arch, 0.09);
      reveal(".room--manicure", cinematicTiming.manicureEntry, arch, 0.09);
      timeline.to(
        q(".room--manicure .cinematic-room__image"),
        { scale: 1.16, xPercent: -2, duration: 0.08 },
        0.42,
      );
      timeline.to(q(".cinematic-manicure-copy"), { autoAlpha: 1, y: 0, duration: 0.04 }, 0.43);
      timeline.to(q(".cinematic-manicure-copy"), { autoAlpha: 0, y: -16, duration: 0.04 }, 0.48);
      reveal(".portal--nail", 0.48, "circle(78% at 52% 50%)", 0.09);
      reveal(".room--artist", cinematicTiming.nailArtist, "circle(78% at 52% 50%)", 0.09);
      timeline.to(
        q(".room--artist .cinematic-room__image"),
        { scale: 1.2, xPercent: -2, duration: 0.08 },
        0.52,
      );
      reveal(".room--nailReveal", cinematicTiming.nailReveal, "circle(78% at 52% 50%)", 0.1);
      timeline.to(
        q(".room--nailReveal .cinematic-room__image"),
        { scale: 1.16, xPercent: 2, duration: 0.07 },
        0.61,
      );
      timeline.to(q(".cinematic-look-copy"), { autoAlpha: 1, duration: 0.04 }, 0.62);
      timeline.to(q(".cinematic-look-copy"), { autoAlpha: 0, duration: 0.035 }, 0.665);

      reveal(".portal--massage", 0.66, arch, 0.045);
      reveal(".room--massage", cinematicTiming.massageEntry, arch, 0.045);
      timeline.to(
        q(".room--massage .cinematic-room__image"),
        { scale: 1.13, xPercent: 1, duration: 0.07 },
        0.7,
      );
      timeline.to(q(".cinematic-massage-copy"), { autoAlpha: 1, duration: 0.04 }, 0.705);
      timeline.to(q(".cinematic-massage-copy"), { autoAlpha: 0, duration: 0.035 }, 0.75);

      reveal(".portal--curtain", 0.75, aperture, 0.08);
      reveal(".room--jacuzziEntry", cinematicTiming.jacuzziThreshold, aperture, 0.08);
      timeline.to(q(".portal-curtain--left"), { xPercent: -88, duration: 0.07 }, 0.785);
      timeline.to(q(".portal-curtain--right"), { xPercent: 88, duration: 0.07 }, 0.785);
      reveal(".portal--water", 0.805, "ellipse(100% 100% at 52% 56%)", 0.08);
      reveal(".room--jacuzzi", cinematicTiming.jacuzziEntry, "ellipse(100% 100% at 52% 56%)", 0.08);
      timeline.to(
        q(".room--jacuzzi .cinematic-room__image"),
        { scale: 1.14, yPercent: -2, duration: 0.08 },
        0.835,
      );
      timeline.to(q(".cinematic-steam--spa"), { autoAlpha: 0.65, duration: 0.06 }, 0.82);
      timeline.to(q(".cinematic-water--spa"), { autoAlpha: 0.72, duration: 0.07 }, 0.835);
      timeline.to(q(".cinematic-jacuzzi-copy"), { autoAlpha: 1, duration: 0.04 }, 0.845);
      timeline.to(q(".cinematic-jacuzzi-copy"), { autoAlpha: 0, duration: 0.03 }, 0.885);

      reveal(".portal--hair", 0.88, arch, 0.08);
      reveal(".room--hairRoom", cinematicTiming.hairEntry, arch, 0.08);
      timeline.to(
        q(".room--hairRoom .cinematic-room__image"),
        { scale: 1.1, xPercent: 2, duration: 0.05 },
        0.9,
      );
      timeline.to(q(".cinematic-hair-copy"), { autoAlpha: 1, duration: 0.035 }, 0.9);
      timeline.to(q(".cinematic-hair-copy"), { autoAlpha: 0, duration: 0.025 }, 0.935);
      reveal(".room--hairStyle", cinematicTiming.hairStyle, "circle(78% at 56% 52%)", 0.06);
      timeline.to(
        q(".room--hairStyle .cinematic-room__image"),
        { scale: 1.1, duration: 0.035 },
        0.95,
      );
      reveal(".room--hairFinish", cinematicTiming.hairFinish, "circle(82% at 60% 52%)", 0.045);
      timeline.to(
        q(".room--hairFinish .cinematic-room__image"),
        { scale: 1.08, duration: 0.02 },
        0.985,
      );
      timeline.to(q(".cinematic-final-copy"), { autoAlpha: 1, y: 0, duration: 0.035 }, 0.985);
    }, journey);

    return () => context.revert();
  }, [journeyRef, stageRef]);
}
