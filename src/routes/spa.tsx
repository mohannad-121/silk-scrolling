import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/spa")({
  head: () => ({
    meta: [
      { title: "Spa — ÉLAN Nail & Spa" },
      {
        name: "description",
        content: "Massage, facials, body scrubs, and bridal packages at ÉLAN.",
      },
      { property: "og:title", content: "Spa — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Immersive spa rituals at ÉLAN." },
    ],
  }),
  component: () => (
    <StubPage
      title="The Spa"
      tagline="Rituals"
      body="Full spa page with ritual builder, therapist profiles and calming imagery is next."
    />
  ),
});
