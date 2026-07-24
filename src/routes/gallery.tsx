import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Nail Gallery — ÉLAN Nail & Spa" },
      {
        name: "description",
        content:
          "Editorial nail design gallery — burgundy, chrome, french, minimal, bridal and seasonal looks.",
      },
      { property: "og:title", content: "Nail Gallery — ÉLAN Nail & Spa" },
      { property: "og:description", content: "A gallery of luxury nail looks." },
    ],
  }),
  component: () => (
    <StubPage
      title="The Gallery"
      tagline="Looks"
      body="Full lightbox gallery with cursor-follow zoom is next in the build."
    />
  ),
});
