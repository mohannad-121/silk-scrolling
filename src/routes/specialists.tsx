import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/specialists")({
  head: () => ({
    meta: [
      { title: "Specialists — ÉLAN Nail & Spa" },
      {
        name: "description",
        content: "Meet ÉLAN's master nail artists, pedicure specialists and spa therapists.",
      },
      { property: "og:title", content: "Specialists — ÉLAN Nail & Spa" },
      { property: "og:description", content: "Our editorial team of nail and spa specialists." },
    ],
  }),
  component: () => (
    <StubPage
      title="The Atelier"
      tagline="Specialists"
      body="Full team directory with schedules and portfolios is next."
    />
  ),
});
