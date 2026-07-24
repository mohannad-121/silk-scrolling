import { createFileRoute } from "@tanstack/react-router";

import { CinematicSalonJourney } from "@/components/cinematic/cinematic-salon-journey";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ÉLAN Nail & Spa — Where Beauty Becomes an Experience" },
      {
        name: "description",
        content:
          "Enter ÉLAN through a cinematic salon journey, then reserve an unhurried nail, pedicure, laser or spa ritual.",
      },
      { property: "og:title", content: "ÉLAN Nail & Spa — Where Beauty Becomes an Experience" },
      {
        property: "og:description",
        content: "A scroll-controlled journey through the ÉLAN beauty house.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-espresso text-ivory">
      <CinematicSalonJourney />
    </div>
  );
}
