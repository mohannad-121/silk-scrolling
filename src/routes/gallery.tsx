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
  component: () => <StubPage page="gallery" />,
});
