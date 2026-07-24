import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ÉLAN Nail & Spa" },
      {
        name: "description",
        content: "The story behind ÉLAN — an editorial atelier for nails, pedicure and spa.",
      },
      { property: "og:title", content: "About — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Our story, our craft, our house." },
    ],
  }),
  component: () => (
    <StubPage
      title="Our House"
      tagline="About"
      body="Founder story, philosophy, and press coverage will live here."
    />
  ),
});
